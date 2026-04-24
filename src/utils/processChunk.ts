// src/utils/processChunk.ts
export const processChunk = (rawChunk: unknown, onChunk: (token: string) => void): void => {
  if (!rawChunk || typeof rawChunk !== "string") return;

  let text = rawChunk;

  if (text.startsWith("data: ")) {
    text = text.substring(6);
  }

  if (!text || text === "[DONE]") return;

  onChunk(text);
};