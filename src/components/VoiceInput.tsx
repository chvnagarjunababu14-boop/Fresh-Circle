import { useState, useCallback, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceInputProps {
  onResult: (text: string) => void;
  className?: string;
}

export default function VoiceInput({ onResult, className = '' }: VoiceInputProps) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSupported(false);
    }
  }, []);

  const toggle = useCallback(() => {
    if (!supported) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    if (!listening) {
      recognition.start();
      setListening(true);

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        onResult(text);
        setListening(false);
      };
      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);
    }
  }, [listening, onResult, supported]);

  if (!supported) return null;

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      className={`touch-target rounded-2xl transition-colors duration-200 ${
        listening 
          ? 'bg-destructive text-destructive-foreground' 
          : 'bg-secondary text-secondary-foreground'
      } ${className}`}
      aria-label={listening ? 'Stop listening' : 'Start voice input'}
    >
      <AnimatePresence mode="wait">
        {listening ? (
          <motion.div key="off" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <MicOff size={32} />
          </motion.div>
        ) : (
          <motion.div key="on" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Mic size={32} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
