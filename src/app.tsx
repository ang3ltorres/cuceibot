import Chat from './components/Chat'
import Prompt from './components/Prompt'
import Top from './components/Top'
import { useState } from 'preact/hooks'

import './app.css'

export function App() {

  const welcomeMessage = () => {

    const messages = [
`¡Hola! 👋 Soy Cucei Bot.
Estoy aquí para ayudarte a resolver dudas frecuentes sobre trámites, servicios y vida estudiantil en el CUCEI.
Solo escribe tu pregunta y te responderé al instante con la información más relevante.
¿En qué puedo ayudarte hoy? 😊`,

`¡Hola! 👋 Soy Cucei Bot, tu asistente virtual.
Puedo ayudarte con información sobre trámites, servicios, materias, horarios y vida estudiantil en el CUCEI.
¿Qué te gustaría saber hoy? 😊`,

`¡Bienvenido/a al CUCEI! 🎓
Soy Cucei Bot y estoy aquí para apoyarte con tus dudas académicas y administrativas.
Cuéntame, ¿en qué puedo ayudarte?`,

`¡Hola! 😄
Soy Cucei Bot, tu guía para resolver dudas rápidas sobre el CUCEI.
Puedes preguntarme sobre procesos, servicios o información general.
¿Qué necesitas saber?`,

`¡Qué gusto verte por aquí! 🌟
Soy Cucei Bot y estoy listo para brindarte la información que buscas sobre el CUCEI.
Solo dime tu duda y con gusto te ayudo.`,

`¡Hola! 👋 Bienvenido/a al asistente virtual del CUCEI.
Puedo ayudarte con trámites escolares, servicios estudiantiles y respuestas rápidas a preguntas frecuentes.
¿En qué te apoyo hoy?`,

`¡Bienvenido/a! 🤖
Soy Cucei Bot, tu acompañante digital para resolver inquietudes sobre el CUCEI de forma fácil y rápida.
Dime, ¿qué te gustaría consultar?`,

`¡Hola! ✨
Estás chateando con Cucei Bot, el asistente creado para ayudarte en tu vida estudiantil en CUCEI.
Pregunta lo que necesites y te daré la información más útil al instante.`,

`¡Hola, estudiante! 🎓
Soy Cucei Bot, aquí para orientarte sobre trámites, clases, servicios y más.
Escribe tu duda y con gusto te ayudaré.`,

`¡Hola! 😊 Gracias por usar Cucei Bot.
Estoy diseñado para resolver tus preguntas sobre el CUCEI de manera rápida, clara y confiable.
¿En qué puedo ayudarte hoy?`,
];

    return messages[Math.floor(Math.random() * messages.length)]
  };

  const [messages, setMessages] = useState<{ id: string, text: string }[]>([{
      id: crypto.randomUUID(),
      text: welcomeMessage()
    }]);

  return (
    <>
      <Top
        setMessages={setMessages}
        welcomeMessage={welcomeMessage}
      />

      <Chat
        messages={messages}
      />

      <Prompt
        setMessages={setMessages}
      />
    </>
  )
}
