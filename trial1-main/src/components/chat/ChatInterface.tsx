import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { LanguageSelector } from '../LanguageSelector';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  message_type: 'text' | 'image' | 'voice';
  file_url?: string;
  created_at: string;
}

interface ChatInterfaceProps {
  sessionId: string | null;
  language: string;
  onLanguageChange: (language: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  sessionId,
  language,
  onLanguageChange,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (sessionId) {
      loadMessages();
    }
  }, [sessionId]);

  const loadMessages = async () => {
    if (!sessionId) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data as Message[]) || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load chat messages",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async (content: string, messageType: 'text' | 'image' | 'voice' = 'text', fileUrl?: string) => {
    if (!sessionId) {
      console.error('No session ID available');
      return;
    }

    console.log('Sending message:', { content, messageType, fileUrl, sessionId });
    setIsLoading(true);

    try {
      // Add user message
      const { data: userMessage, error: userError } = await supabase
        .from('chat_messages')
        .insert([{
          session_id: sessionId,
          role: 'user',
          content,
          message_type: messageType,
          file_url: fileUrl,
        }])
        .select()
        .single();

      if (userError) {
        console.error('Error inserting user message:', userError);
        throw userError;
      }

      console.log('User message inserted:', userMessage);
      setMessages(prev => [...prev, userMessage as Message]);

      // Simulate AI response (replace with actual AI integration)
      setTimeout(async () => {
        const aiResponse = generateAIResponse(content, language);
        console.log('Generated AI response:', aiResponse);
        
        const { data: aiMessage, error: aiError } = await supabase
          .from('chat_messages')
          .insert([{
            session_id: sessionId,
            role: 'assistant',
            content: aiResponse,
            message_type: 'text',
          }])
          .select()
          .single();

        if (aiError) {
          console.error('Error inserting AI message:', aiError);
          throw aiError;
        }

        console.log('AI message inserted:', aiMessage);
        setMessages(prev => [...prev, aiMessage as Message]);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: `Failed to send message: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  const generateAIResponse = (userMessage: string, lang: string): string => {
    // Placeholder AI responses - replace with actual AI integration
    const responses = {
      en: [
        "I understand your farming concern. Let me help you with that.",
        "Based on agricultural best practices, I recommend...",
        "For soil health improvement, consider these steps...",
        "Regarding crop monitoring, here's what I suggest...",
      ],
      hi: [
        "मैं आपकी खेती की समस्या समझता हूं। मैं आपकी मदद करूंगा।",
        "कृषि की बेहतरीन पद्धतियों के आधार पर, मैं सुझाता हूं...",
        "मिट्टी के स्वास्थ्य में सुधार के लिए, इन चरणों पर विचार करें...",
      ],
      te: [
        "మీ వ్యవసాయ సమస్యను నేను అర్థం చేసుకున్నాను. నేను మీకు సహాయం చేస్తాను.",
        "వ్యవసాయ మంచి పద్ధతుల ఆధారంగా, నేను సిఫార్సు చేస్తాను...",
      ],
    };

    const langResponses = responses[lang as keyof typeof responses] || responses.en;
    return langResponses[Math.floor(Math.random() * langResponses.length)];
  };

  if (!sessionId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Starting new chat session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <h1 className="text-xl font-semibold text-primary">Krishi Mitra Chat</h1>
        <LanguageSelector 
          selectedLanguage={language}
          onLanguageChange={onLanguageChange}
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p className="text-lg font-medium mb-2">Welcome to Krishi Mitra!</p>
            <p>Ask me anything about farming, soil health, or crop management.</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-3 max-w-xs">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};