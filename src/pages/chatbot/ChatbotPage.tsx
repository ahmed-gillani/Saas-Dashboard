// src/pages/chatbot/ChatbotPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import { createChat, getChats } from '../../utils/chatStorage';

export default function ChatbotPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState<Record<string, any>>({});

  // Load chats on mount and when id changes
  useEffect(() => {
    const chats = getChats() || {};        // ← Safety fix
    setConversations(chats);

    if (!id) {
      if (Object.keys(chats).length > 0) {
        // Go to the most recent chat
        const firstId = Object.keys(chats)[0];
        navigate(`/chatbot/${firstId}`, { replace: true });
      } else {
        // Create new chat if none exists
        const newId = createChat();
        navigate(`/chatbot/${newId}`, { replace: true });
      }
    }
  }, [id, navigate]);

  const handleNewChat = () => {
    const newId = createChat();
    setConversations(getChats() || {});
    navigate(`/chatbot/${newId}`);
  };

  const handleDelete = (cid: string) => {
    const chats = getChats() || {};
    delete chats[cid];
    localStorage.setItem("nexus_chat_conversations", JSON.stringify(chats));
    
    setConversations(chats);

    if (id === cid) {
      const remainingIds = Object.keys(chats);
      if (remainingIds.length > 0) {
        navigate(`/chatbot/${remainingIds[0]}`);
      } else {
        navigate('/chatbot');
      }
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-950 overflow-hidden">
      <ChatSidebar 
        conversations={conversations} 
        activeId={id} 
        onNewChat={handleNewChat}
        onSelect={(cid) => navigate(`/chatbot/${cid}`)}
        onDelete={handleDelete}
      />
      
      {id && <ChatWindow chatId={id} />}
    </div>
  );
}