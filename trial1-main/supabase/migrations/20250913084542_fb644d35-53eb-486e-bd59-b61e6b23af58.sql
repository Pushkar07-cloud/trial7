-- Create chat sessions table
CREATE TABLE public.chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  title TEXT NOT NULL DEFAULT 'New Chat',
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'voice')),
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage buckets for chat files
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-files', 'chat-files', false);

-- Enable RLS on chat tables
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chat sessions (public access for now, can be restricted later)
CREATE POLICY "Anyone can view chat sessions" ON public.chat_sessions FOR SELECT USING (true);
CREATE POLICY "Anyone can create chat sessions" ON public.chat_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update chat sessions" ON public.chat_sessions FOR UPDATE USING (true);

-- Create policies for chat messages
CREATE POLICY "Anyone can view chat messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Anyone can create chat messages" ON public.chat_messages FOR INSERT WITH CHECK (true);

-- Create policies for chat file storage
CREATE POLICY "Anyone can view chat files" ON storage.objects FOR SELECT USING (bucket_id = 'chat-files');
CREATE POLICY "Anyone can upload chat files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'chat-files');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);
CREATE INDEX idx_chat_sessions_created_at ON public.chat_sessions(created_at);