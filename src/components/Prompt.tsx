import type { FunctionalComponent } from "preact";
import { useState } from 'preact/hooks'
import './Prompt.css'

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

interface PromptProps {
  setMessages: (fn: (prev: { id: string, text: string }[]) => { id: string, text: string }[]) => void;
}

const Prompt: FunctionalComponent<PromptProps> = ({setMessages}) => {

  const [input, setInput] = useState("");

  const send = async () => {
    if (!input.trim()) return;

    const userMessage = { id: crypto.randomUUID(), text: input };
    const loadingId = crypto.randomUUID();

    setMessages(prev => [
      ...prev,
      userMessage,
      { id: loadingId, text: "__typing__" }
    ]);

    setInput("");

    try {
      const res = await fetch(
        `/api/ask/question=${encodeURIComponent(input)}`
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      const answer =
        typeof data === "string"
          ? data
          : data.answer ?? Object.values(data)[0];

      setMessages(prev =>
        prev.map(m =>
          m.id === loadingId ? { ...m, text: String(answer) } : m
        )
      );
    } catch (err) {
      setMessages(prev =>
        prev.map(m =>
          m.id === loadingId
            ? { ...m, text: "Error al obtener respuesta" }
            : m
        )
      );
    }
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
