import type { FunctionalComponent } from "preact";
import { useEffect, useRef } from "preact/hooks";
import './Chat.css'

type MessageBubbleType = "user" | "agent";

interface MessageBubbleProps {

  message: string,
  type: MessageBubbleType,
}

const MessageBubble: FunctionalComponent<MessageBubbleProps> = ({message, type}) => {
  const isTyping = (message === "__typing__");

  return (

    <p
      class={`message-bubble ${type} ${isTyping ? 'typing' : ''}`}
    >
      {isTyping ? (
        <span class="typing-dots" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
      ) : (
        message
      )}
    </p>
  );
};

interface ChatProps {

  messages: { id: string, text: string }[],
}

const Chat: FunctionalComponent<ChatProps> = ({messages}) => {

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatRef.current) return;

    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  return (

    <div
      class="chat-area"
      ref={chatRef}
    >

      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message.text}
          type={(index % 2 == 0) ? "agent" : "user"}
        />
      ))}

    </div>
  );
};

export default Chat;
