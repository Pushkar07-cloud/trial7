import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatHistory } from '@/components/chat/ChatHistory';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export default function Chatbot() {
  const [activeTab, setActiveTab] = useState<'chat' | 'history'>('chat');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [language, setLanguage] = useState('en');
  const { toast } = useToast();

  const createNewSession = async () => {
    try {
      console.log('Creating new chat session with language:', language);
      
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([{ language }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating session:', error);
        throw error;
      }
      
      console.log('New session created:', data);
      setCurrentSessionId(data.id);
      setActiveTab('chat');
      
      toast({
        title: "New chat started",
        description: "You can now start chatting with Krishi Mitra",
      });
    } catch (error) {
      console.error('Error creating chat session:', error);
      toast({
        title: "Error",
        description: `Failed to create new chat session: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    createNewSession();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)]">
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-card rounded-lg shadow-sm border h-full">
              <div className="p-4 border-b">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'chat'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'history'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    History
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-hidden">
                {activeTab === 'chat' ? (
                  <ChatSidebar onNewSession={createNewSession} />
                ) : (
                  <ChatHistory 
                    onSelectSession={setCurrentSessionId}
                    currentSessionId={currentSessionId}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1">
            <ChatInterface 
              sessionId={currentSessionId}
              language={language}
              onLanguageChange={setLanguage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}