import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { MessageCircle, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ChatSession {
  id: string;
  title: string;
  language: string;
  created_at: string;
  updated_at: string;
}

interface ChatHistoryProps {
  onSelectSession: (sessionId: string) => void;
  currentSessionId: string | null;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  onSelectSession,
  currentSessionId,
}) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getLanguageFlag = (language: string) => {
    const flags: Record<string, string> = {
      en: '🇺🇸',
      hi: '🇮🇳',
      te: '🇮🇳',
      ta: '🇮🇳',
      bn: '🇮🇳',
      mr: '🇮🇳',
      gu: '🇮🇳',
      pa: '🇮🇳',
    };
    return flags[language] || '🌐';
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Loading chat history...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <h3 className="font-medium text-sm text-muted-foreground mb-3">Chat History</h3>
        
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No chat history yet</p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-20rem)]">
            <div className="space-y-2">
              {sessions.map((session) => (
                <Button
                  key={session.id}
                  variant={currentSessionId === session.id ? "secondary" : "ghost"}
                  onClick={() => onSelectSession(session.id)}
                  className="w-full justify-start h-auto p-3 text-left"
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <MessageCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{session.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{getLanguageFlag(session.language)}</span>
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(session.updated_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};