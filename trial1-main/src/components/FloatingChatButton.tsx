import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { ChatSidebar } from './ChatSidebar';
import { useChatSidebar } from './GlobalChatSidebar';

export const FloatingChatButton: React.FC = () => {
  const { isOpen, openSidebar, closeSidebar } = useChatSidebar();

  return (
    <>
      <Button
        onClick={openSidebar}
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-agri-button hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 z-40 animate-bounce-gentle"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
      
      <ChatSidebar 
        isOpen={isOpen} 
        onClose={closeSidebar} 
      />
    </>
  );
};