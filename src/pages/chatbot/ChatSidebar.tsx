// src/pages/chatbot/ChatSidebar.tsx
import { Plus, Trash2, MessageSquare } from 'lucide-react';
import type { Chat } from '../../utils/chatStorage';   // ← Fixed with 'type'

interface ChatSidebarProps {
  conversations: Record<string, Chat>;
  activeId?: string;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ChatSidebar({ 
  conversations, 
  activeId, 
  onNewChat, 
  onSelect, 
  onDelete 
}: ChatSidebarProps) {

  const sortedChats = Object.values(conversations)
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col h-full overflow-hidden">
      
      {/* New Chat Button */}
      <div className="p-4 border-b border-gray-800">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 py-3 px-4 rounded-xl text-white font-medium transition-all active:scale-95"
        >
          <Plus size={18} /> 
          New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
        {sortedChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <MessageSquare size={48} className="text-gray-600 mb-4" />
            <p className="text-gray-500">No conversations yet</p>
            <p className="text-xs text-gray-600 mt-1">Start a new chat</p>
          </div>
        ) : (
          sortedChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelect(chat.id)}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
                activeId === chat.id 
                  ? 'bg-gray-800 border-l-2 border-violet-500' 
                  : 'hover:bg-gray-800/70'
              }`}
            >
              <MessageSquare size={18} className="text-gray-400 shrink-0" />
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200 truncate font-medium">
                  {chat.title}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(chat.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(chat.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}