import type { FunctionalComponent } from "preact";
import { useRef, useState, type Dispatch, type StateUpdater } from 'preact/hooks'
import './Prompt.css'

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

interface PromptProps {

  messages: { id: string, text: string }[];
  setMessages: Dispatch<StateUpdater<{ id: string, text: string }[]>>;
}

const Prompt: FunctionalComponent<PromptProps> = ({messages, setMessages}) => {

  const [input, setInput] = useState("");
  const pendingRequestRef = useRef(false);
  const conversationIdRef = useRef<string | null>(null);
  const isWaitingForAgent = messages.some((message) => message.text === "__typing__");

  const send = async () => {

    if (!input.trim()) return;

    if (isWaitingForAgent || pendingRequestRef.current) return;

    pendingRequestRef.current = true;

    const userMessage = { id: crypto.randomUUID(), text: input };
    const loadingId = crypto.randomUUID();

    setMessages(prev => [
      ...prev,
      userMessage,
      { id: loadingId, text: "__typing__" }
    ]);

    setInput("");

    try {
      const accessToken = localStorage.getItem("access_token");
      const tokenType = localStorage.getItem("token_type") ?? "bearer";

      if (!accessToken) {
        throw new Error("No auth token");
      }

      // Create conversation if it's the first message
      if (messages.length === 1 || !conversationIdRef.current) {
        const createConversationResponse = await fetch("/api/conversations", {
          method: "POST",
          headers: {
            Authorization: `${tokenType} ${accessToken}`,
          },
        });

        if (!createConversationResponse.ok) {
          throw new Error(`HTTP ${createConversationResponse.status}`);
        }

        const createdConversation = await createConversationResponse.json() as { id?: string };
        if (!createdConversation.id) {
          throw new Error("Missing conversation id");
        }

        conversationIdRef.current = createdConversation.id;
      }

      const res = await fetch(
        `/api/conversations/${encodeURIComponent(conversationIdRef.current)}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${tokenType} ${accessToken}`,
          },
          body: JSON.stringify({
            msg: userMessage.text,
          }),
        }
      );

      if (!res.ok)
        throw new Error(`HTTP ${res.status}`);

      const data = await res.json() as { ia_message?: { content?: string } };
      const answer = data.ia_message?.content ?? "Sin respuesta del servidor";

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
    } finally {
      pendingRequestRef.current = false;
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
        disabled={isWaitingForAgent || pendingRequestRef.current}
        onClick={send}
      >↑</button>
    </div>
  );
};

export default Prompt;
