import type { FunctionalComponent } from "preact";
import { useState } from "preact/hooks";

import closeIcon from "../assets/close.svg?raw";
import type { Dispatch, StateUpdater } from "preact/hooks";
import Popup from "./Popup";
import "./MenuLogin.css";

interface MenuLoginProps {

	menuLoginOpen: string | null;
	setMenuLoginOpen: Dispatch<StateUpdater<string | null>>;

	setMenuOpen: Dispatch<StateUpdater<boolean>>;

	setUser: Dispatch<StateUpdater<string | null>>;

	setConversations: Dispatch<StateUpdater<string[][] | null>>;

	clear: () => void;
}

const MenuLogin: FunctionalComponent<MenuLoginProps> = ({ menuLoginOpen, setMenuLoginOpen, setMenuOpen, setUser, setConversations, clear }) => {

	const [inputUsername, setInputUsername] = useState<string>("");
	const [inputEmail, setInputEmail] = useState<string>("");
	const [inputPassword, setInputPassword] = useState<string>("");
	const [inputRepeatPassword, setInputRepeatPassword] = useState<string>("");

	const [popupTitle, setPopupTitle] = useState<string>("");
	const [popupMessage, setPopupMessage] = useState<string>("");
	const [popupOpen, setPopupOpen] = useState<boolean>(false);

	type AuthTokenResponse = {
		access_token?: string;
		token_type?: string;
	};

	type ApiUserResponse = {
		id?: string;
		email?: string;
		username?: string;
	};

	type ConversationResponse = {
		id?: string;
		user_id?: string;
	};

	type ConversationMessageResponse = {
		id?: string;
		content?: string;
		seq?: number;
	};

	const onLoginSubmit = async (e: Event) => {
		e.preventDefault();

		if (!inputEmail.trim() || !inputPassword.trim()) {
			setPopupTitle("Error de registro");
			setPopupMessage("Todos los campos son obligatorios");
			setPopupOpen(true);
			return;
		}

		try {
			const formData = new URLSearchParams();
			formData.append("username", inputEmail.trim());
			formData.append("password", inputPassword);

			const response = await fetch("/api/token", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: formData.toString(),
			});

			if (!response.ok) {
				let errorMessage = "No se pudo autenticar. Por favor, inténtalo de nuevo.";
				try {
					const errorData = await response.json() as { detail?: string; message?: string };
					errorMessage = errorData.detail ?? errorData.message ?? errorMessage;
				}
				catch {
					// Keep default message if backend does not return JSON
				}

				setPopupTitle("Error de autenticación");
				setPopupMessage(errorMessage);
				setPopupOpen(true);
				return;
			}

			const tokenData = await response.json() as AuthTokenResponse;
			if (!tokenData.access_token) {
				setPopupTitle("Error de autenticación");
				setPopupMessage("Respuesta inválida del servidor de autenticación.");
				setPopupOpen(true);
				return;
			}

			const tokenType = tokenData.token_type ?? "bearer";
			localStorage.setItem("access_token", tokenData.access_token);
			localStorage.setItem("token_type", tokenType);
			
			// Get username of authenticated user
			const meResponse = await fetch("/api/users/me", {
				headers: {
					Authorization: `${tokenType} ${tokenData.access_token}`,
				},
			});

			if (!meResponse.ok) {
				setPopupTitle("Error de autenticación");
				setPopupMessage("No se pudo obtener el usuario autenticado.");
				setPopupOpen(true);
				localStorage.removeItem("access_token");
				localStorage.removeItem("token_type");
				return;
			}

			const meData = await meResponse.json() as ApiUserResponse;
			if (!meData.username?.trim()) {
				setPopupTitle("Error de autenticación");
				setPopupMessage("El usuario autenticado no tiene username válido.");
				setPopupOpen(true);
				localStorage.removeItem("access_token");
				localStorage.removeItem("token_type");
				return;
			}

			const conversationsResponse = await fetch("/api/conversations", {
				headers: {
					Authorization: `${tokenType} ${tokenData.access_token}`,
				},
			});

			if (!conversationsResponse.ok) {
				setPopupTitle("Error de autenticación");
				setPopupMessage("No se pudieron obtener las conversaciones del usuario.");
				setPopupOpen(true);
				localStorage.removeItem("access_token");
				localStorage.removeItem("token_type");
				return;
			}

			const conversationsData = await conversationsResponse.json() as ConversationResponse[];

			const conversationsWithMessages = await Promise.all(
				conversationsData.map(async (conversation) => {
					if (!conversation.id) {
						return [] as string[];
					}

					const messagesResponse = await fetch(`/api/conversations/${encodeURIComponent(conversation.id)}/messages`, {
						headers: {
							Authorization: `${tokenType} ${tokenData.access_token}`,
						},
					});

					if (!messagesResponse.ok) {
						throw new Error(`No se pudieron obtener los mensajes de la conversación ${conversation.id}`);
					}

					const messagesData = await messagesResponse.json() as ConversationMessageResponse[];
					return messagesData
						.map((message) => message.content?.trim() ?? "")
						.filter((messageContent) => messageContent.length > 0);
				})
			);


			setUser(meData.username);
			setConversations(conversationsWithMessages);

			setInputUsername("");
			setInputEmail("");
			setInputPassword("");
			setMenuLoginOpen(null);
			setMenuOpen(false);
			clear();
		}
		catch {
			setPopupTitle("Error de autenticación");
			setPopupMessage("No se pudo autenticar. Por favor, inténtalo de nuevo.");
			setPopupOpen(true);
			return;
		}
	};

	const onRegisterSubmit = async (e: Event) => {
		e.preventDefault();

		if (!inputUsername.trim() || !inputEmail.trim() || !inputPassword.trim() || !inputRepeatPassword.trim()) {
			setPopupTitle("Error de registro");
			setPopupMessage("Todos los campos son obligatorios");
			setPopupOpen(true);
			return;
		}

		if (inputPassword !== inputRepeatPassword) {
			setPopupTitle("Error de registro");
			setPopupMessage("Las contraseñas no coinciden");
			setPopupOpen(true);
			return;
		}

		try {
			const response = await fetch("/api/users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: inputUsername.trim(),
					email: inputEmail.trim(),
					password: inputPassword,
				}),
			});

			if (!response.ok) {
				let errorMessage = "No se pudo completar el registro. Inténtalo de nuevo.";
				try {
					const errorData = await response.json() as { detail?: string; message?: string };
					errorMessage = errorData.detail ?? errorData.message ?? errorMessage;
				}
				catch {
					// Keep default error message if response body is not JSON
				}

				setPopupTitle("Error de registro");
				setPopupMessage(errorMessage);
				setPopupOpen(true);
				return;
			}

			const createdUser = await response.json() as ApiUserResponse;
			setUser(createdUser.username?.trim() || inputUsername.trim());
		}
		catch {
			setPopupTitle("Error de registro");
			setPopupMessage("No se pudo conectar con el servidor. Inténtalo de nuevo.");
			setPopupOpen(true);
			return;
		}
		
		setInputUsername("");
		setInputEmail("");
		setInputPassword("");
		setInputRepeatPassword("");
		setMenuLoginOpen(null);
		setMenuOpen(false);
		clear();
	};

	return (
		<>
			<Popup
				open={popupOpen}
				title={popupTitle}
				message={popupMessage}
				onClose={() => setPopupOpen(false)}
			/>

			<div
				class={`menu-login-overlay ${menuLoginOpen ? "open" : ""}`}
				inert={!menuLoginOpen}
			>
				<div class="menu-login-body">
				<div class="menu-login-header">
					<span class="menu-login-title">
						{menuLoginOpen === "register" ? "Registro" : "Login"}
					</span>

					<button
						class="icon-button"
						title="Close"
						onClick={() => {
							setMenuLoginOpen(null);
							setInputUsername("");
							setInputEmail("");
							setInputPassword("");
							setInputRepeatPassword("");
						}}
					>
						<span class="icon" dangerouslySetInnerHTML={{ __html: closeIcon }} />
					</button>
				</div>

				{menuLoginOpen === "register" ? (
					<form class="menu-login-content" onSubmit={onRegisterSubmit as any}>
						<input
							class="menu-login-input"
							type="text"
							placeholder="Usuario"
							value={inputUsername}
							onInput={(e) =>
								setInputUsername((e.currentTarget as HTMLInputElement).value)
							}
							autocomplete="username"
						/>
						<input
							class="menu-login-input"
							type="email"
							placeholder="Correo"
							value={inputEmail}
							onInput={(e) =>
								setInputEmail((e.currentTarget as HTMLInputElement).value)
							}
							autocomplete="email"
						/>
						<input
							class="menu-login-input"
							type="password"
							placeholder="Contraseña"
							value={inputPassword}
							onInput={(e) =>
								setInputPassword((e.currentTarget as HTMLInputElement).value)
							}
							autocomplete="new-password"
						/>
						<input
							class="menu-login-input"
							type="password"
							placeholder="Repetir Contraseña"
							value={inputRepeatPassword}
							onInput={(e) =>
								setInputRepeatPassword((e.currentTarget as HTMLInputElement).value)
							}
							autocomplete="new-password"
						/>

						<button class="menu-login-button" type="submit">
							Registrarse
						</button>
					</form>
				) : (
					<form class="menu-login-content" onSubmit={onLoginSubmit as any}>
						<input
							class="menu-login-input"
							type="email"
							placeholder="Correo"
							value={inputEmail}
							onInput={(e) =>
								setInputEmail((e.currentTarget as HTMLInputElement).value)
							}
							autocomplete="email"
						/>
						<input
							class="menu-login-input"
							type="password"
							placeholder="Contraseña"
							value={inputPassword}
							onInput={(e) =>
								setInputPassword((e.currentTarget as HTMLInputElement).value)
							}
							autocomplete="current-password"
						/>

						<button class="menu-login-button" type="submit">
							Iniciar sesión
						</button>
					</form>
				)}
				</div>
			</div>
		</>
	);
};

export default MenuLogin;
