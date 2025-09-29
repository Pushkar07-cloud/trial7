import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatSidebarContextType {
  isOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
}

const ChatSidebarContext = createContext<ChatSidebarContextType | undefined>(undefined);

export const useChatSidebar = () => {
  const context = useContext(ChatSidebarContext);
  if (!context) {
    throw new Error('useChatSidebar must be used within a ChatSidebarProvider');
  }
  return context;
};

interface ChatSidebarProviderProps {
  children: ReactNode;
}

export const ChatSidebarProvider: React.FC<ChatSidebarProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);

  return (
    <ChatSidebarContext.Provider value={{ isOpen, openSidebar, closeSidebar }}>
      {children}
    </ChatSidebarContext.Provider>
  );
};