import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Send, 
  Mic, 
  Camera, 
  Image, 
  Leaf, 
  Eye, 
  AlertTriangle,
  Bot,
  User,
  MicOff
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  message_type: 'text' | 'image' | 'voice';
  file_url?: string;
  created_at: string;
}

interface ChatSession {
  id: string;
  title: string;
  language: string;
  created_at: string;
  updated_at: string;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
];

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize session when sidebar opens
  useEffect(() => {
    if (isOpen && !sessionId) {
      loadChatHistory();
      createNewSession();
    }
  }, [isOpen]);

  const createNewSession = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          title: 'Krishi Mitra Chat',
          language: selectedLanguage,
        })
        .select()
        .single();

      if (error) throw error;
      setSessionId(data.id);
      loadChatHistory();
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Error",
        description: "Failed to start chat session",
        variant: "destructive",
      });
    }
  };

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setChatSessions(data || []);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const loadMessages = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      const typedMessages: Message[] = (data || []).map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        message_type: msg.message_type as 'text' | 'image' | 'voice',
        file_url: msg.file_url || undefined,
        created_at: msg.created_at,
      }));
      
      setMessages(typedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async (content: string, messageType: 'text' | 'image' | 'voice' = 'text', fileUrl?: string) => {
    if (!content.trim() || !sessionId) return;

    setIsLoading(true);
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      message_type: messageType,
      file_url: fileUrl,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Save user message to database
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        role: 'user',
        content,
        message_type: messageType,
        file_url: fileUrl,
      });

      // Generate AI response based on language
      const aiResponse = generateAIResponse(content, selectedLanguage);
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: aiResponse,
        message_type: 'text',
        created_at: new Date().toISOString(),
      };

      setTimeout(() => {
        setMessages(prev => [...prev, assistantMessage]);
        
        // Save AI response to database
        supabase.from('chat_messages').insert({
          session_id: sessionId,
          role: 'assistant',
          content: aiResponse,
          message_type: 'text',
        });

        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const generateAIResponse = (userMessage: string, language: string): string => {
    const responses = {
      en: {
        greeting: "Hello! I'm Krishi Mitra, your farming assistant. How can I help you today?",
        soil: "Based on your location and crop type, I recommend testing soil pH and nutrient levels. Consider adding organic compost to improve soil health.",
        pest: "I've detected potential pest risks in your area. Check for aphids and caterpillars. Consider using neem oil as a natural pesticide.",
        crop: "Your crops are showing good growth patterns. Maintain current watering schedule and monitor for any nutrient deficiencies.",
        weather: "Weather forecast shows optimal conditions for farming this week. Perfect time for planting or harvesting.",
        default: "I understand your concern about farming. Let me help you with the best agricultural practices for your situation."
      },
      hi: {
        greeting: "नमस्ते! मैं एग्रिसेंस AI हूं, आपका कृषि सहायक। आज मैं आपकी कैसे मदद कर सकता हूं?",
        soil: "आपके स्थान और फसल के प्रकार के आधार पर, मैं मिट्टी की pH और पोषक तत्वों के स्तर की जांच की सिफारिश करता हूं।",
        pest: "आपके क्षेत्र में कीट के जोखिम का पता चला है। एफिड्स और कैटरपिलर की जांच करें।",
        crop: "आपकी फसलें अच्छी वृद्धि के पैटर्न दिखा रही हैं। वर्तमान पानी देने का कार्यक्रम बनाए रखें।",
        weather: "मौसम पूर्वानुमान इस सप्ताह कृषि के लिए अनुकूल परिस्थितियां दिखाता है।",
        default: "मैं कृषि के बारे में आपकी चिंता समझता हूं। मैं आपकी स्थिति के लिए सर्वोत्तम कृषि प्रथाओं में मदद करूंगा।"
      },
      te: {
        greeting: "నమస్కారం! నేను అగ్రిసెన్స్ AI, మీ వ్యవసాయ సహాయకుడిని. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?",
        soil: "మీ ప్రాంతం మరియు పంట రకం ఆధారంగా, నేను మట్టి pH మరియు పోషక స్థాయిలను పరీక్షించమని సిఫార్సు చేస్తున్నాను।",
        pest: "మీ ప్రాంతంలో కీటకాల ప్రమాదాలను గుర్తించాను. అఫిడ్స్ మరియు గొంగళి పురుగుల కోసం చూడండి।",
        crop: "మీ పంటలు మంచి పెరుగుదల నమూనాలను చూపిస్తున్నాయి. ప్రస్తుత నీటిపారుదల షెడ్యూల్‌ను కొనసాగించండి।",
        weather: "వాతావరణ సూచన ఈ వారం వ్యవసాయానికి అనుకూలమైన పరిస్థితులను చూపిస్తుంది।",
        default: "వ్యవసాయం గురించి మీ ఆందోళనను నేను అర్థం చేసుకున్నాను. మీ పరిస్థితికి ఉత్తమ వ్యవసాయ పద్ధతులతో నేను మీకు సహాయం చేస్తాను."
      }
    };

    const langResponses = responses[language] || responses.en;
    const message = userMessage.toLowerCase();

    if (message.includes('soil') || message.includes('मिट्टी') || message.includes('మట్టి')) {
      return langResponses.soil;
    } else if (message.includes('pest') || message.includes('कीट') || message.includes('కీటకాలు')) {
      return langResponses.pest;
    } else if (message.includes('crop') || message.includes('फसल') || message.includes('పంట')) {
      return langResponses.crop;
    } else if (message.includes('weather') || message.includes('मौसम') || message.includes('వాతావరణం')) {
      return langResponses.weather;
    } else if (message.includes('hello') || message.includes('hi') || message.includes('नमस्ते') || message.includes('నమస్కారం')) {
      return langResponses.greeting;
    } else {
      return langResponses.default;
    }
  };

  const handleSend = () => {
    if (currentMessage.trim()) {
      sendMessage(currentMessage);
      setCurrentMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (file: File, type: 'image' | 'voice') => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${sessionId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('chat-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('chat-files')
        .getPublicUrl(fileName);

      await sendMessage(
        type === 'image' ? 'Image uploaded' : 'Voice message',
        type,
        data.publicUrl
      );

      toast({
        title: "Success",
        description: `${type === 'image' ? 'Image' : 'Voice message'} uploaded successfully`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, 'image');
    }
  };

  const handleQuickAction = (action: string) => {
    const actionMessages = {
      'Check Soil Health': 'I want to check my soil health. Can you help me with soil testing and recommendations?',
      'View Crop Insights': 'Show me insights about my crops. I want to know about growth patterns and health.',
      'Pest Risk Alerts': 'Are there any pest risks in my area? I need to know about potential threats to my crops.'
    };
    
    sendMessage(actionMessages[action] || action);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording implementation would go here
    toast({
      title: isRecording ? "Recording stopped" : "Recording started",
      description: isRecording ? "Processing voice message..." : "Speak now...",
    });
  };

  const selectChatSession = (session: ChatSession) => {
    setSessionId(session.id);
    setSelectedLanguage(session.language);
    loadMessages(session.id);
    setShowHistory(false);
  };

  const startNewChat = () => {
    setSessionId(null);
    setMessages([]);
    setShowHistory(false);
    createNewSession();
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

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full bg-sidebar border-l border-sidebar-border z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        w-full lg:w-[400px] xl:w-[450px]
        flex flex-col
      `}>
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border bg-sidebar">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-sidebar-foreground">Krishi Mitra</h2>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="text-sidebar-foreground hover:bg-sidebar-accent"
              >
                {showHistory ? 'Chat' : 'History'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Language Selector */}
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-full bg-sidebar-accent border-sidebar-border">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <span className="flex items-center space-x-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Quick Actions */}
          <div className="mt-4 space-y-2">
            <p className="text-xs text-sidebar-foreground/70 font-medium">Quick Actions</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Check Soil Health', icon: Leaf },
                { label: 'View Crop Insights', icon: Eye },
                { label: 'Pest Risk Alerts', icon: AlertTriangle }
              ].map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action.label)}
                  className="text-xs border-sidebar-border hover:bg-sidebar-accent"
                >
                  <action.icon className="w-3 h-3 mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {showHistory ? (
          // Chat History View
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-sidebar-foreground">Recent Chats</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startNewChat}
                  className="border-sidebar-border"
                >
                  New Chat
                </Button>
              </div>
              
              {chatSessions.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-sidebar-foreground/50 mx-auto mb-4" />
                  <p className="text-sidebar-foreground/70 text-sm">No chat history yet</p>
                </div>
              ) : (
                chatSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => selectChatSession(session)}
                    className={`
                      p-3 rounded-lg cursor-pointer transition-colors border border-sidebar-border
                      hover:bg-sidebar-accent
                      ${sessionId === session.id ? 'bg-sidebar-accent' : 'bg-sidebar'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-sidebar-foreground truncate">
                          {session.title}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-sidebar-foreground/70">
                            {LANGUAGES.find(lang => lang.code === session.language)?.flag || '🇺🇸'}
                          </span>
                          <span className="text-xs text-sidebar-foreground/70">
                            {formatDate(session.updated_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        ) : (
          // Chat Messages View
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-sidebar-foreground/70">
                    Welcome to Krishi Mitra! Ask me anything about farming.
                  </p>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-[80%] rounded-lg p-3 space-y-2
                    ${message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-sidebar-accent text-sidebar-foreground'
                    }
                  `}>
                    <div className="flex items-center space-x-2">
                      {message.role === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                      <span className="text-xs opacity-70">
                        {new Date(message.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <p className="text-sm">{message.content}</p>
                    
                    {message.file_url && (
                      <div className="mt-2">
                        {message.message_type === 'image' ? (
                          <img 
                            src={message.file_url} 
                            alt="Uploaded" 
                            className="max-w-full h-32 object-cover rounded"
                          />
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Voice Message
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-sidebar-accent text-sidebar-foreground rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-75" />
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-150" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}

        {/* Input Area - Only show when not in history view */}
        {!showHistory && (
          <div className="p-4 border-t border-sidebar-border bg-sidebar space-y-3">
            {/* Input Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleRecording}
                className={`border-sidebar-border ${isRecording ? 'bg-destructive text-destructive-foreground' : ''}`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => cameraInputRef.current?.click()}
                className="border-sidebar-border"
              >
                <Camera className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="border-sidebar-border"
              >
                <Image className="w-4 h-4" />
              </Button>
            </div>

            {/* Text Input */}
            <div className="flex space-x-2">
              <Textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your farming question..."
                className="min-h-[40px] resize-none bg-sidebar-accent border-sidebar-border text-sidebar-foreground"
                rows={1}
              />
              <Button
                onClick={handleSend}
                disabled={!currentMessage.trim() || isLoading}
                className="self-end"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Hidden File Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        )}
      </div>
    </>
  );
};