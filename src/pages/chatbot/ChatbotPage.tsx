// src/pages/chatbot/ChatbotPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Menu } from 'lucide-react';

import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import { createChat, getChats } from '../../utils/chatStorage';

export default function ChatbotPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState<Record<string, any>>({});
  const [chatSidebarOpen, setChatSidebarOpen] = useState(false);

  useEffect(() => {
    const chats = getChats() || {};
    setConversations(chats);

    if (!id) {
      if (Object.keys(chats).length > 0) {
        navigate(`/chatbot/${Object.keys(chats)[0]}`, { replace: true });
      } else {
        const newId = createChat();
        navigate(`/chatbot/${newId}`, { replace: true });
      }
    }
  }, [id, navigate]);

  const handleNewChat = () => {
    const newId = createChat();
    setConversations(getChats() || {});
    navigate(`/chatbot/${newId}`);
    setChatSidebarOpen(false);
  };

  const handleDelete = (cid: string) => {
    const chats = getChats() || {};
    delete chats[cid];
    localStorage.setItem("nexus_chat_conversations", JSON.stringify(chats));
    setConversations(chats);

    if (id === cid) {
      const remaining = Object.keys(chats);
      navigate(remaining.length ? `/chatbot/${remaining[0]}` : '/chatbot');
    }
    setChatSidebarOpen(false);
  };

  return (
    <div className="flex h-full bg-gray-950 overflow-hidden relative">
      
      {/* Chatbot Conversation Sidebar */}
      <div className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-gray-950 border-r border-gray-800 transform transition-transform duration-300 ${
        chatSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <ChatSidebar 
          conversations={conversations} 
          activeId={id} 
          onNewChat={handleNewChat}
          onSelect={(cid) => { navigate(`/chatbot/${cid}`); setChatSidebarOpen(false); }}
          onDelete={handleDelete}
        />
      </div>
      

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Mobile Hamburger for Chatbot Sidebar */}
        <div className="md:hidden border-b border-gray-800 p-4 flex items-center gap-3 bg-gray-950">
          <button
            onClick={() => setChatSidebarOpen(true)}
            className="p-2 text-white hover:bg-gray-800 rounded-xl transition-colors"
            title="Chatbot Sidebar Option"
          >
            <Menu size={24} />
          </button>
          <h2 className="text-lg font-semibold text-white">AI Chatbot</h2>
        </div>

        <div className="flex-1 overflow-hidden">
          {id ? (
            <ChatWindow chatId={id} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select or create a new chat from the sidebar
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {chatSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/70 z-40"
          onClick={() => setChatSidebarOpen(false)}
        />
      )}
    </div>
  );
}
