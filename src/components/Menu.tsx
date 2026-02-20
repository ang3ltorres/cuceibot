import type { FunctionalComponent } from "preact";

import closeIcon from '../assets/close.svg?raw'
import './Menu.css'
import type { Dispatch, StateUpdater } from "preact/hooks";

interface MenuProps {

	menuOpen: boolean;
	setMenuOpen: Dispatch<StateUpdater<boolean>>;

	setMenuLoginOpen: Dispatch<StateUpdater<string | null>>;

	user: string | null;
	setUser: Dispatch<StateUpdater<string | null>>;

	conversations: string[][] | null;
	setConversations: Dispatch<StateUpdater<string[][] | null>>;

	setMessages: Dispatch<StateUpdater<{ id: string, text: string }[]>>;
}

const Menu: FunctionalComponent<MenuProps> = ({ menuOpen, setMenuOpen, setMenuLoginOpen, user, setUser, conversations, setConversations, setMessages }) => {
	return (
		<div
			class={`menu-overlay ${menuOpen ? 'open' : ''}`}
			inert={!menuOpen}>
			<div class="menu-body">
				<div class="menu-header">

				<span className="menu-title">
					Hola,<br />
					{user ? user : "Invitado"}
				</span>

        <button
          class="icon-button"
          title="Close"
          onClick={() => setMenuOpen(false)}
        >
          <span class="icon" dangerouslySetInnerHTML={{ __html: closeIcon }} />
        </button>
				</div>
				<div class="menu-content">

					{user ? (
						<>
							<button class="menu-item" type="button">Ajustes</button>
							<button
								class="menu-item"
								type="button"
								onClick={() => {
									setUser(null);
									setConversations(null);
									setMenuOpen(false);
									// TODO: start new conversation or show welcome message
								}}
							>
								Cerrar sesión
							</button>
							<div class="menu-separator" aria-hidden="true" />
							<div class="menu-conversations" role="list">
								{conversations?.map((conv, index) => (
									<button
										class="menu-item"
										type="button"
										key={index}
										onClick={() => {

											// Recover conversation messages
											setMessages(() => conv.map((text) => ({
												id: crypto.randomUUID(),
												text
											})));
											setMenuOpen(false);
										}}
									>
										{`${(conv[1] ?? '').slice(0, 36)}...`}
									</button>
								))}
							</div>
						</>
					) : (
						<>
							<button
								class="menu-item"
								type="button"
								onClick={() => setMenuLoginOpen("login")}>
									Iniciar sesión
							</button>
							<button
								class="menu-item"
								type="button"
								onClick={() => setMenuLoginOpen("register")}>
									Registrarse
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Menu;
