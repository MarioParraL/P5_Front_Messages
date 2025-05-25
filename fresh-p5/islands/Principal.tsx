import { useEffect, useState } from "preact/hooks";
import { FunctionalComponent } from "preact";
import Axios from "axios";

type Contact = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  chatId: string;
};

type Message = {
  _id: string;
  chatId: string;
  isContactMessage: boolean;
  content: string;
  timestamp: string;
};

const Principal: FunctionalComponent = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");

  const getContacts = async () => {
    try {
      const response = await Axios.get(
        "https://back-a-p4.onrender.com/contacts",
      );
      setContacts(response.data.data);
    } catch (e) {
      console.error("Error en el fetch de contactos", e);
    }
  };

  const getMessages = async (chatId: string) => {
    try {
      const res = await Axios.get(
        `https://back-a-p4.onrender.com/messages/chat/${chatId}`,
      );

      setMessages(res.data.data);
    } catch (e) {
      console.error("Error haciendo el fetch de mensajes", e);
    }
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setSelectedChatId(contact.chatId);
    getMessages(contact.chatId);
  };

  const handleSendMessage = async (e: Event) => {
    e.preventDefault();
    if (!message.trim() || !selectedChatId) return;

    const Message = {
      chatId: selectedChatId,
      isContactMessage: false,
      content: message,
      timestamp: new Date(),
    };

    try {
      const response = await fetch("https://back-a-p4.onrender.com/messages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Message),
      });

      if (response.ok) {
        const json = await response.json();
        setMessages((prev) => [...prev, json.data]);
        setMessage("");
      }
    } catch (e) {
      console.error("Error al enviar mensaje:", e);
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  useEffect(() => {
    const container = document.querySelector("messagesContainer");
    if (container) container.scrollTop = container.scrollHeight;
  }, [messages]);

  return (
    <div class="principal">
      <div class="contactList">
        <a href="/contact" class="contactButton">
          <strong>Crear Contacto</strong>
        </a>
        {contacts.map((c) => (
          <div
            key={c._id}
            class="contactCard"
            onClick={() => handleContactClick(c)}
          >
            <h3>
              <strong>{c.name}</strong>
            </h3>
            <p>{c.phone}</p>
          </div>
        ))}
      </div>

      <div class="Chats">
        {selectedContact
          ? (
            <div>
              <h2>{selectedContact.name}</h2>
              <div class="messagesContainer">
                {messages.map((m) => (
                  <div
                    class={m.isContactMessage
                      ? "message left"
                      : "message right"}
                  >
                    {m.content}
                    <p>{m.timestamp}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} class="messageForm">
                <input
                  type="text"
                  value={message}
                  onInput={(e) => setMessage(e.currentTarget.value)}
                  placeholder="Escribe tu mensaje"
                />
                <button type="submit">Enviar</button>
              </form>
            </div>
          )
          : <p>Selecciona un contacto para comenzar a chatear</p>}
      </div>
    </div>
  );
};

export default Principal;
