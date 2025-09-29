import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mic, Image as ImageIcon, Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ChatInputProps {
  onSendMessage: (content: string, messageType?: 'text' | 'image' | 'voice', fileUrl?: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (file: File, messageType: 'image' | 'voice') => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('chat-files')
        .getPublicUrl(filePath);

      const content = messageType === 'image' ? 'Shared an image' : 'Shared a voice message';
      onSendMessage(content, messageType, data.publicUrl);

      toast({
        title: "File uploaded",
        description: `${messageType === 'image' ? 'Image' : 'Voice message'} uploaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file, 'image');
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const file = new File([blob], 'voice-message.wav', { type: 'audio/wav' });
        handleFileUpload(file, 'voice');
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Stop recording after 30 seconds max
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          setIsRecording(false);
        }
      }, 30000);

      // Store recorder reference for manual stop
      (window as any).currentRecorder = mediaRecorder;
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopVoiceRecording = () => {
    const recorder = (window as any).currentRecorder;
    if (recorder && recorder.state === 'recording') {
      recorder.stop();
      setIsRecording(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <Textarea
            placeholder="Ask about farming, soil health, crops..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="min-h-[60px] resize-none"
            rows={2}
          />
        </div>
        <Button
          onClick={handleSend}
          disabled={!message.trim()}
          className="h-[60px] px-4"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2 justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleVoiceToggle}
          className={isRecording ? 'bg-destructive text-destructive-foreground' : ''}
        >
          <Mic className="h-4 w-4 mr-2" />
          {isRecording ? 'Stop Recording' : 'Voice'}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Upload
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => cameraInputRef.current?.click()}
        >
          <Camera className="h-4 w-4 mr-2" />
          Camera
        </Button>
      </div>

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
  );
};