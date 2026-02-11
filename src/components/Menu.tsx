import type { FunctionalComponent } from "preact";

import closeIcon from '../assets/close.svg?raw'
import './Menu.css'

interface MenuProps {
	open: boolean;
	onMenuToggle: () => void;
}

const Menu: FunctionalComponent<MenuProps> = ({ open, onMenuToggle }) => {
	return (
		<div class={`menu-overlay ${open ? 'open' : ''}`} aria-hidden={!open}>
			<div class="menu-body">
				<div class="menu-header">
					<span class="menu-title">Menu</span>

        <button
          class="icon-button"
          title="Close"
          onClick={onMenuToggle}
        >
          <span class="icon" dangerouslySetInnerHTML={{ __html: closeIcon }} />
        </button>
				</div>
				<div class="menu-content">
					<button class="menu-item" type="button">Iniciar sesión</button>
					<button class="menu-item" type="button">Ajustes</button>
					<button class="menu-item" type="button">Salir</button>
				</div>
			</div>
		</div>
	);
};

export default Menu;
