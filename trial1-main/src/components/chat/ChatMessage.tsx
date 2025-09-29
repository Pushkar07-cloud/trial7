import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Bot, Image as ImageIcon, Mic } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  message_type: 'text' | 'image' | 'voice';
  file_url?: string;
  created_at: string;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const timestamp = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <Avatar className="h-8 w-8 bg-primary">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-xs lg:max-w-md ${isUser ? 'order-first' : ''}`}>
        <div
          className={`rounded-lg p-3 ${
            isUser
              ? 'bg-primary text-primary-foreground ml-auto'
              : 'bg-muted'
          }`}
        >
          {message.message_type === 'image' && message.file_url && (
            <div className="mb-2">
              <img
                src={message.file_url}
                alt="Uploaded"
                className="rounded-md max-w-full h-auto"
              />
            </div>
          )}
          
          {message.message_type === 'voice' && (
            <div className="flex items-center gap-2 mb-2">
              <Mic className="h-4 w-4" />
              <span className="text-sm opacity-75">Voice message</span>
            </div>
          )}
          
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        
        <p className={`text-xs text-muted-foreground mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {timestamp}
        </p>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 bg-muted">
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};