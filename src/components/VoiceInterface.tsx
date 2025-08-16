import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, Volume2, VolumeX, Headphones } from 'lucide-react';

interface VoiceInterfaceProps {
  onCommand: (command: string) => void;
  isListening?: boolean;
  className?: string;
}

export const VoiceInterface = ({ onCommand, isListening = false, className = '' }: VoiceInterfaceProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);
  const speechSynthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            setConfidence(confidence);
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(finalTranscript || interimTranscript);
        
        if (finalTranscript) {
          onCommand(finalTranscript);
          setTranscript('');
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        toast({
          title: "Voice Recognition Error",
          description: `Failed to process speech: ${event.error}`,
          variant: "destructive"
        });
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    // Initialize Speech Synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onCommand, toast]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Recognition Not Available",
        description: "Your browser doesn't support speech recognition",
        variant: "destructive"
      });
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
      toast({
        title: "Voice Recognition Started",
        description: "Listening for commands..."
      });
    }
  };

  const speak = (text: string) => {
    if (!speechSynthRef.current || isMuted) return;
    
    speechSynthRef.current.cancel(); // Cancel any ongoing speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    speechSynthRef.current.speak(utterance);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted && speechSynthRef.current) {
      speechSynthRef.current.cancel();
    }
  };

  // Auto-speak responses when listening
  useEffect(() => {
    if (isListening && !isMuted) {
      speak("I'm ready to help you with LexOS. What would you like me to do?");
    }
  }, [isListening, isMuted]);

  return (
    <Card className={`glass neural-glow p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Headphones className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Voice Interface</span>
          {isRecording && (
            <Badge className="bg-red-500 text-white animate-pulse">
              Recording
            </Badge>
          )}
        </div>
        
        <div className="flex gap-1">
          <Button
            onClick={toggleMute}
            size="sm"
            variant="ghost"
            className="w-8 h-8 p-0 hover:bg-secondary/50"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={toggleRecording}
          size="sm"
          className={`flex items-center gap-2 ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-gradient-neural hover:opacity-80'
          } text-white`}
        >
          {isRecording ? (
            <MicOff className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
          {isRecording ? 'Stop' : 'Listen'}
        </Button>

        {transcript && (
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground mb-1">
              Confidence: {Math.round(confidence * 100)}%
            </div>
            <div className="text-sm bg-muted/50 p-2 rounded truncate">
              "{transcript}"
            </div>
          </div>
        )}
      </div>

      {isListening && !isRecording && (
        <div className="mt-3 text-xs text-muted-foreground">
          Click "Listen" to give voice commands to LexOS
        </div>
      )}
    </Card>
  );
};