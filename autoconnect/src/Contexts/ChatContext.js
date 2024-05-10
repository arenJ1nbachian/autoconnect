import { createContext } from "react";

export const ChatContext = createContext({
  showChatHistory: false,
  toggleChatHistory: () => {},
  closeChatHistory: () => {},
  userConversation: [],
});
