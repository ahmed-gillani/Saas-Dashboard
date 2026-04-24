// src/pages/chatbot/ChatWindow.tsx
import { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import { sendChatMessage } from '../../api/chatApi';
import type { Message } from '../../utils/chatStorage';
import { getChats, updateChat } from '../../utils/chatStorage';
import MessageComponent from './Message';
import { processChunk } from '../../utils/processChunk';

interface ChatWindowProps {
  chatId: string;
}

export default function ChatWindow({ chatId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [chatTitle, setChatTitle] = useState("New Chat");

  const bottomRef = useRef<HTMLDivElement>(null);
  const fullResponse = useRef<string>("");

  useEffect(() => {
    if (!chatId) return;
    const chats = getChats();
    const chat = chats[chatId];
    if (chat) {
      setMessages(chat.messages || []);
      setChatTitle(chat.title);
    }
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!chatId || !input.trim() || isThinking) return;

    const text = input.trim();
    setInput('');
    setIsThinking(true);

    const chats = getChats();
    const chat = chats[chatId];

    const userMsg: Message = { id: Date.now(), role: "user", text };
    chat.messages.push(userMsg);

    if (chat.messages.length === 1) {
      chat.title = text.slice(0, 40) + "...";
      setChatTitle(chat.title);
    }

    updateChat(chatId, chat);
    setMessages([...chat.messages]);

    const botId = Date.now() + 1;
    fullResponse.current = "";

    try {
      await sendChatMessage({
        message: text,
        onStreamChunk: (rawChunk) => {
          processChunk(rawChunk, (token) => {
            fullResponse.current += token;

            const currentChats = getChats();
            const currentChat = currentChats[chatId];

            let botMsg = currentChat.messages.find((m: Message) => m.id === botId);
            if (!botMsg) {
              botMsg = { id: botId, role: "assistant", text: "" };
              currentChat.messages.push(botMsg);
            }

            botMsg.text = fullResponse.current;
            updateChat(chatId, currentChat);
            setMessages([...currentChat.messages]);
          });
        },
        onComplete: () => setIsThinking(false),
      });
    } catch (err) {
      console.error(err);
      setIsThinking(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-gray-800 p-4 flex items-center gap-3 bg-gray-900">
        <div className="w-9 h-9 bg-violet-500/20 rounded-2xl flex items-center justify-center">
          <Bot className="text-violet-400" size={24} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">{chatTitle}</h2>
          <p className="text-xs text-gray-500">AI Assistant • ConnecxGuard</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-950">
        {messages.map((msg) => (
          <MessageComponent
            key={msg.id}
            role={msg.role}
            content={msg.text}
            isThinking={isThinking && msg.role === "assistant"}
            isLastAssistant={msg.role === "assistant" && messages[messages.length - 1]?.id === msg.id}
            onSend={handleSend}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-6 border-t border-gray-800 bg-gray-900">
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-2xl px-6 py-4 focus:outline-none focus:border-violet-500 text-white"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            className="bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 px-8 rounded-2xl transition-colors"
          >
            <Send size={22} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}