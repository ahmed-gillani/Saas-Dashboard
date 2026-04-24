// src/utils/chatStorage.ts
export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

export interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
}

const KEY = "nexus_chat_conversations";

export const getChats = (): Record<string, Chat> => {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : {};
};

export const saveChats = (chats: Record<string, Chat>) => {
  localStorage.setItem(KEY, JSON.stringify(chats));
};

export const createChat = (): string => {
  const chats = getChats();
  const id = Date.now().toString();
  chats[id] = {
    id,
    title: "New Chat",
    messages: [],
    createdAt: Date.now(),
  };
  saveChats(chats);
  return id;
};

export const updateChat = (id: string, data: Chat) => {
  const chats = getChats();
  if (chats[id]) {
    chats[id] = data;
    saveChats(chats);
  }
};

export const deleteChat = (id: string) => {
  const chats = getChats();
  delete chats[id];
  saveChats(chats);
};