import type { FunctionalComponent } from "preact";

import cuceiLogo from '../assets/cucei_logo_01.svg?raw'
import refreshIcon from '../assets/refresh.svg?raw'
import './Top.css'

interface TopProps {
  setMessages: (fn: (prev: { id: string, text: string }[]) => { id: string, text: string }[]) => void;
  welcomeMessage: () => string;
}

const Top: FunctionalComponent<TopProps> = ({ setMessages, welcomeMessage }) => {

  

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
      <button
        title="Nuevo chat"
        onClick={clear}
      >
        <span class="refresh-icon" dangerouslySetInnerHTML={{ __html: refreshIcon }} />
      </button>
    </div>
  );
};

export default Top;
