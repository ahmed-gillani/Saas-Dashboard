// src/pages/chatbot/Message.tsx
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ReactTyped } from 'react-typed';
import { Copy, Check } from 'lucide-react';

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  isThinking?: boolean;
  isLastAssistant?: boolean;
  onSend?: (text: string) => void;
}

export default function Message({ 
  role, 
  content = "", 
  isThinking = false, 
  isLastAssistant = false,
  onSend 
}: MessageProps) {

  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (isLastAssistant && isThinking) {
      setDisplayText("");
    } else {
      setDisplayText(content);
    }
  }, [content, isThinking, isLastAssistant]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} group relative`}>
      <div className={`max-w-[80%] px-5 py-4 rounded-2xl text-[15px] leading-relaxed ${
        isUser 
          ? 'bg-violet-600 text-white' 
          : 'bg-gray-800 text-gray-100'
      }`}>
        {isLastAssistant && isThinking ? (
          <ReactTyped
            strings={[content]}
            typeSpeed={12}
            showCursor
            cursorChar="▋"
          />
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        )}

        {!isUser && !isThinking && (
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-gray-700 rounded-lg transition"
          >
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-gray-400" />}
          </button>
        )}
      </div>
    </div>
  );
}