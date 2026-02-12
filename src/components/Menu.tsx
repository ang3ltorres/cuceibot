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
}

const Menu: FunctionalComponent<MenuProps> = ({ menuOpen, setMenuOpen, setMenuLoginOpen, user, setUser }) => {
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
								onClick={() => setUser(null)}
							>
								Cerrar sesión
							</button>
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
