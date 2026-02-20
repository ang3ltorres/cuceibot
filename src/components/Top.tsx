import type { FunctionalComponent } from "preact";
import type { Dispatch, StateUpdater } from "preact/hooks";

import botLogo from '../assets/cuceibot.svg?raw'
import menuIcon from '../assets/menu.svg?raw'
import refreshIcon from '../assets/refresh.svg?raw'
import './Top.css'

interface TopProps {
  clear: () => void;
  setMenuOpen: Dispatch<StateUpdater<boolean>>;
}

const Top: FunctionalComponent<TopProps> = ({ clear, setMenuOpen }) => {

  return (
    <div class="top-area">
      <div class="avatar">
        <span class="logo" dangerouslySetInnerHTML={{ __html: botLogo }} />
      </div>
      <span class="top-title">Cucei Bot</span>
      <div class="top-actions">
        <button
          class="icon-button"
          title="Menu"
          onClick={() => setMenuOpen(true)}
        >
          <span class="icon" dangerouslySetInnerHTML={{ __html: menuIcon }} />
        </button>
        <button
          class="icon-button"
          title="Nuevo chat"
          onClick={clear}
        >
          <span class="icon" dangerouslySetInnerHTML={{ __html: refreshIcon }} />
        </button>
      </div>
    </div>
  );
};

export default Top;
