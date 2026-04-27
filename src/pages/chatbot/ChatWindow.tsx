// // src/pages/chatbot/ChatWindow.tsx
// import { useState, useRef, useEffect } from 'react';
// import { Send, Bot } from 'lucide-react';
// import { sendChatMessage } from '../../api/chatApi';
// import type { Message } from '../../utils/chatStorage';
// import { getChats, updateChat } from '../../utils/chatStorage';
// import MessageComponent from './Message';
// import { processChunk } from '../../utils/processChunk';

// interface ChatWindowProps {
//   chatId: string;
// }

// export default function ChatWindow({ chatId }: ChatWindowProps) {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState('');
//   const [isThinking, setIsThinking] = useState(false);
//   const [chatTitle, setChatTitle] = useState("New Chat");

//   const bottomRef = useRef<HTMLDivElement>(null);
//   const fullResponse = useRef<string>("");

//   useEffect(() => {
//     if (!chatId) return;
//     const chats = getChats();
//     const chat = chats[chatId];
//     if (chat) {
//       setMessages(chat.messages || []);
//       setChatTitle(chat.title);
//     }
//   }, [chatId]);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleSend = async () => {
//     if (!chatId || !input.trim() || isThinking) return;

//     const text = input.trim();
//     setInput('');
//     setIsThinking(true);

//     const chats = getChats();
//     const chat = chats[chatId];

//     const userMsg: Message = { id: Date.now(), role: "user", text };
//     chat.messages.push(userMsg);

//     if (chat.messages.length === 1) {
//       chat.title = text.slice(0, 35) + (text.length > 35 ? "..." : "");
//       setChatTitle(chat.title);
//     }

//     updateChat(chatId, chat);
//     setMessages([...chat.messages]);

//     const botId = Date.now() + 1;
//     fullResponse.current = "";

//     try {
//       await sendChatMessage({
//         message: text,
//         onStreamChunk: (rawChunk) => {
//           processChunk(rawChunk, (token) => {
//             fullResponse.current += token;

//             const currentChats = getChats();
//             const currentChat = currentChats[chatId];

//             let botMsg = currentChat.messages.find((m: Message) => m.id === botId);
//             if (!botMsg) {
//               botMsg = { id: botId, role: "assistant", text: "" };
//               currentChat.messages.push(botMsg);
//             }

//             botMsg.text = fullResponse.current;
//             updateChat(chatId, currentChat);
//             setMessages([...currentChat.messages]);
//           });
//         },
//         onComplete: () => setIsThinking(false),
//       });
//     } catch (err) {
//       console.error(err);
//       setIsThinking(false);
//     }
//   };

//   return (
//     <div className="flex-1 flex flex-col h-full">
//       {/* Professional Header */}
//       <div className="border-b border-gray-800 p-4 flex items-center gap-4 bg-gray-900">
//         <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center">
//           <Bot className="text-white" size={26} />
//         </div>
//         <div>
//           <h2 className="text-lg font-semibold text-white">{chatTitle}</h2>
//           <p className="text-xs text-emerald-400 flex items-center gap-1.5">
//             ● Online
//           </p>
//         </div>
//       </div>

//       {/* Messages Area - Clean & Professional */}
//       <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#0f1117]">
//         {messages.length === 0 ? (
//           <div className="h-full flex flex-col items-center justify-center text-center">
//             <div className="w-20 h-20 bg-violet-500/10 rounded-3xl flex items-center justify-center mb-6">
//               <Bot size={48} className="text-violet-400" />
//             </div>
//             <h3 className="text-2xl font-semibold text-white mb-2">How can I help you today?</h3>
//             <p className="text-gray-400 max-w-md">Ask anything about healthcare, policies, or patient care</p>
//           </div>
//         ) : (
//           messages.map((msg) => (
//             <MessageComponent
//               key={msg.id}
//               role={msg.role}
//               content={msg.text}
//               isThinking={isThinking && msg.role === "assistant"}
//               isLastAssistant={msg.role === "assistant" && messages[messages.length - 1]?.id === msg.id}
//               onSend={handleSend}
//             />
//           ))
//         )}
//         <div ref={bottomRef} />
//       </div>

//       {/* Input Area - Modern & Clean */}
//       <div className="p-6 border-t border-gray-800 bg-gray-900">
//         <div className="flex gap-3 max-w-4xl mx-auto">
//           <input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//             placeholder="Type your message..."
//             className="flex-1 bg-gray-800 border border-gray-700 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none"
//           />
//           <button
//             onClick={handleSend}
//             disabled={!input.trim() || isThinking}
//             className="bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95"
//           >
//             <Send size={22} className="text-white" />
//           </button>
//         </div>
//         <p className="text-center text-[10px] text-gray-600 mt-3">AI can make mistakes. Consider checking important info.</p>
//       </div>
//     </div>
//   );
// }


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
      chat.title = text.slice(0, 35) + (text.length > 35 ? "..." : "");
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

  // FIXED: Enter = Send, Shift + Enter = New Line
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Professional Header */}
      <div className="border-b border-gray-800 p-4 flex items-center gap-4 bg-gray-900">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center">
          <Bot className="text-white" size={26} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">{chatTitle}</h2>
          <p className="text-xs text-emerald-400 flex items-center gap-1.5">
            ● Online
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#0f1117]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-violet-500/10 rounded-3xl flex items-center justify-center mb-6">
              <Bot size={48} className="text-violet-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">How can I help you today?</h3>
            <p className="text-gray-400 max-w-md">Ask anything about healthcare, policies, or patient care</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageComponent
              key={msg.id}
              role={msg.role}
              content={msg.text}
              isThinking={isThinking && msg.role === "assistant"}
              isLastAssistant={msg.role === "assistant" && messages[messages.length - 1]?.id === msg.id}
              onSend={handleSend}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-800 bg-gray-900">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none resize-none max-h-[160px]"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            className="bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95"
          >
            <Send size={22} className="text-white" />
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-600 mt-3">
          Press Enter to send • Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}