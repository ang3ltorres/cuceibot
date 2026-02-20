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

	type DebugUser = {
		username?: string | null;
		conversations?: string[][] | null;
	};
const MenuLogin: FunctionalComponent<MenuLoginProps> = ({ menuLoginOpen, setMenuLoginOpen, setMenuOpen, setUser, setConversations, clear }) => {

	const [inputUsername, setInputUsername] = useState<string>("");
	const [inputPassword, setInputPassword] = useState<string>("");
	const [inputRepeatPassword, setInputRepeatPassword] = useState<string>("");

	const [popupTitle, setPopupTitle] = useState<string>("");
	const [popupMessage, setPopupMessage] = useState<string>("");
	const [popupOpen, setPopupOpen] = useState<boolean>(false);

	const onLoginSubmit = async (e: Event) => {
		e.preventDefault();

		if (!inputUsername.trim() || !inputPassword.trim()) {
			setPopupTitle("Error de registro");
			setPopupMessage("Todos los campos son obligatorios");
			setPopupOpen(true);
			return;
		}

		try {
			// TODO: Replace with real authentication logic
			const response = await fetch("/user.json");
			if (!response.ok)
				throw new Error("Network response was not ok");

			const userData = (await response.json()) as DebugUser;

			setUser(userData.username ?? null);
			setConversations(userData.conversations ?? null);
			console.log(userData.conversations);

			setInputUsername("");
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

	const onRegisterSubmit = (e: Event) => {
		e.preventDefault();

		if (!inputUsername.trim() || !inputPassword.trim() || !inputRepeatPassword.trim()) {
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

		// TODO: Update on DB through an API
		setUser(inputUsername.trim());
		
		setInputUsername("");
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
