import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceAssistantProps {
  onCommand?: (command: string) => void;
}

export function VoiceAssistant({ onCommand }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  const initSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Speech Recognition Not Available",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive"
      });
      return null;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast({
        title: "Voice Assistant Active",
        description: "Listening for your command...",
      });
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);
      
      if (event.results[current].isFinal) {
        handleVoiceCommand(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      toast({
        title: "Speech Recognition Error",
        description: "Please try again.",
        variant: "destructive"
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return recognition;
  };

  const handleVoiceCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Process common driver commands
    if (lowerCommand.includes('accept order') || lowerCommand.includes('accept delivery')) {
      onCommand?.('accept_order');
      speak("Order accepted. Navigate to pickup location.");
    } else if (lowerCommand.includes('decline order') || lowerCommand.includes('reject order')) {
      onCommand?.('decline_order');
      speak("Order declined.");
    } else if (lowerCommand.includes('picked up') || lowerCommand.includes('package collected')) {
      onCommand?.('mark_picked_up');
      speak("Order marked as picked up. Navigate to delivery location.");
    } else if (lowerCommand.includes('delivered') || lowerCommand.includes('delivery complete')) {
      onCommand?.('mark_delivered');
      speak("Order marked as delivered. Great job!");
    } else if (lowerCommand.includes('go online') || lowerCommand.includes('start working')) {
      onCommand?.('go_online');
      speak("You are now online and will receive delivery requests.");
    } else if (lowerCommand.includes('go offline') || lowerCommand.includes('stop working')) {
      onCommand?.('go_offline');
      speak("You are now offline and won't receive new requests.");
    } else if (lowerCommand.includes('show earnings') || lowerCommand.includes('my earnings')) {
      onCommand?.('show_earnings');
      speak("Showing your earnings dashboard.");
    } else if (lowerCommand.includes('show orders') || lowerCommand.includes('my orders')) {
      onCommand?.('show_orders');
      speak("Showing your active orders.");
    } else {
      speak("Sorry, I didn't understand that command. Try saying 'accept order', 'picked up', 'delivered', or 'go online'.");
    }

    setTranscript('');
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initSpeechRecognition();
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <Card className="fixed top-4 right-4 z-50 p-3 bg-background/95 backdrop-blur-sm border-primary/20 shadow-lg">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={isListening ? "destructive" : "default"}
          onClick={isListening ? stopListening : startListening}
          className="h-8 w-8 p-0"
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        
        <Button
          size="sm"
          variant={isPlaying ? "destructive" : "secondary"}
          onClick={stopSpeaking}
          disabled={!isPlaying}
          className="h-8 w-8 p-0"
        >
          {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        
        {(isListening || transcript) && (
          <div className="text-xs max-w-32 truncate">
            {isListening ? 'Listening...' : transcript}
          </div>
        )}
      </div>
    </Card>
  );
}