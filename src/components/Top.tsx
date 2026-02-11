import type { FunctionalComponent } from "preact";

import cuceiLogo from '../assets/cucei_logo_01.svg?raw'
import menuIcon from '../assets/menu.svg?raw'
import refreshIcon from '../assets/refresh.svg?raw'
import './Top.css'

interface TopProps {
  setMessages: (fn: (prev: { id: string, text: string }[]) => { id: string, text: string }[]) => void;
  welcomeMessage: () => string;
  onMenuToggle: () => void;
}

const Top: FunctionalComponent<TopProps> = ({ setMessages, welcomeMessage, onMenuToggle }) => {

  const menuToggle = () => {
    onMenuToggle();
  };
  
  const clear = () => {

    setMessages(() => [{
      id: crypto.randomUUID(),
      text: welcomeMessage()
    }]);
  };

  return (
    <div class="top-area">
      <div class="avatar">
        <span class="logo" dangerouslySetInnerHTML={{ __html: cuceiLogo }} />
      </div>
      <span class="top-title">Cucei Bot</span>
      <div class="top-actions">
        <button
          class="icon-button"
          title="Menu"
          onClick={menuToggle}
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
