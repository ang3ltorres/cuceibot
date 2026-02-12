import type { FunctionalComponent } from "preact";
import { useState } from "preact/hooks";

import closeIcon from "../assets/close.svg?raw";
import type { Dispatch, StateUpdater } from "preact/hooks";
import "./MenuLogin.css";

interface MenuLoginProps {

	menuLoginOpen: string | null;
	setMenuLoginOpen: Dispatch<StateUpdater<string | null>>;

	setUser: Dispatch<StateUpdater<string | null>>;
}

const MenuLogin: FunctionalComponent<MenuLoginProps> = ({ menuLoginOpen, setMenuLoginOpen, setUser }) => {
	type DebugUser = {
		username?: string;
	};

	const [inputUsername, setInputUsername] = useState<string>("");
	const [inputPassword, setInputPassword] = useState<string>("");
	const [inputRepeatPassword, setInputRepeatPassword] = useState<string>("");

	const onLoginSubmit = async (e: Event) => {
		e.preventDefault();
		if (!inputUsername.trim()) return;

		try {
			const response = await fetch("/user.json");
			if (!response.ok) return;

			const userData = (await response.json()) as DebugUser;
			if (!userData.username) return;

			setUser(userData.username);

			setInputUsername("");
			setInputPassword("");
			setInputRepeatPassword("");
			setMenuLoginOpen(null);
		} catch {
			return;
		}
	};

	const onRegisterSubmit = (e: Event) => {
		e.preventDefault();
		if (!inputUsername.trim()) return;
		if (!inputPassword.trim()) return;
		if (inputPassword !== inputRepeatPassword) return;

		setUser(inputUsername.trim());
		setInputUsername("");
		setInputPassword("");
		setInputRepeatPassword("");
		setMenuLoginOpen(null);
	};

	return (
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
						onClick={() => setMenuLoginOpen(null)}
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
	);
};

export default MenuLogin;
