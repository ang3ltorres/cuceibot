import type { FunctionalComponent } from "preact";
import { useState } from 'preact/hooks'
import './Prompt.css'

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

interface PromptProps {
  setMessages: (fn: (prev: { id: string, text: string }[]) => { id: string, text: string }[]) => void;
}

const Prompt: FunctionalComponent<PromptProps> = ({setMessages}) => {

  const [input, setInput] = useState("");

  const send = () => {

    // Avoid empty strings
    if (!input.trim()) return;

    // Update messages and clear visual input
    setMessages(prev => [
      ...prev,
      { id: crypto.randomUUID(), text: input },
      { id: crypto.randomUUID(), text: "Esta IA no es real! Son los papás" }
    ]);
    setInput("");
  };

  return (
    <div
      class="prompt-area"
    >
      <textarea
        placeholder="Ingresa tu pregunta"
        value={input}
        onInput={(e) => setInput((e.target as HTMLInputElement).value)}
        onKeyDown={(e) => {
          if (isMobile)
            return;

          if (e.key === "Enter" && e.shiftKey)
            return;

          if (e.key === "Enter") {
            e.preventDefault();
            send();
          }
        }}
      />
      <button
        type="button"
        onClick={send}
      >↑</button>
    </div>
  );
};

export default Prompt;
