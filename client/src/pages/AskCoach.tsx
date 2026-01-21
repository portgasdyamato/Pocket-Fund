import { useState, useEffect, useRef } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useMutation } from "@tanstack/react-query";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles, User, Mic, MicOff, Volume2, VolumeX, Bot, Terminal, ChevronRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  role: 'user' | 'assistant';
  message: string;
}

export default function AskCoach() {
  const { toast } = useToast();
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      message: "Initialization complete. I am your Digital Wealth Strategist. Ready to optimize your financial protocols. What is our objective today?"
    }
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Voice Interaction State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [mutedMessages, setMutedMessages] = useState<Set<number>>(new Set());
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  // Handle Voice Input
  useEffect(() => {
    if (transcript) {
      setChatMessage(transcript);
    }
  }, [transcript]);

  const toggleListening = () => {
    try {
      if (listening) {
        SpeechRecognition.stopListening();
      } else {
        resetTranscript();
        SpeechRecognition.startListening({ 
          continuous: true,
          language: 'en-IN'
        });
      }
    } catch (error) {
      console.error("Speech recognition error:", error);
      toast({
        title: "Datalink Error",
        description: "Sensor array malfunctioning. Check microphone permissions.",
        variant: "destructive"
      });
    }
  };

  // Handle Output (Text-to-Speech)
  const speak = (text: string, messageIndex?: number) => {
    if (isMuted || !window.speechSynthesis) return;
    if (messageIndex !== undefined && mutedMessages.has(messageIndex)) return;
    
    window.speechSynthesis.cancel();
    setCurrentlyPlaying(null);

    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      if (messageIndex !== undefined) setCurrentlyPlaying(messageIndex);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentlyPlaying(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentlyPlaying(null);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const toggleMute = () => {
    window.speechSynthesis.cancel();
    setIsMuted(!isMuted);
    setIsSpeaking(false);
  };

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("/api/ai/chat", "POST", { message });
      return response.json();
    },
    onSuccess: (data: any) => {
      const newIndex = chatHistory.length;
      setChatHistory((prev) => [...prev, { role: 'assistant', message: data.response }]);
      setChatMessage("");
      resetTranscript();
      setTimeout(() => {
        speak(data.response, newIndex);
      }, 100);
    },
    onError: () => {
      toast({
        title: "Uplink Error",
        description: "Failed to establish neural link with the coach.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!chatMessage.trim() || chatMutation.isPending) return;
    setChatHistory((prev) => [...prev, { role: 'user', message: chatMessage }]);
    chatMutation.mutate(chatMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "How can I start saving money?",
    "What's the 50/30/20 rule?",
    "How do I reduce impulse buying?",
    "Tips for emergency fund?"
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* High-Tech Header */}
      <div className="sticky top-[64px] z-40 border-b border-white/5 bg-black/40 backdrop-blur-3xl px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all rounded-full" />
              <div className="relative w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-all">
                <Bot className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                Neural <span className="text-primary italic">Strategist</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">System Online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMute}
              className={`border-white/10 bg-white/5 rounded-xl px-4 font-bold transition-all ${isSpeaking ? "border-primary text-primary" : "text-white/60"}`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="ml-2 hidden md:inline">{isMuted ? "Muted" : (isSpeaking ? "Analyzing..." : "Voice Ready")}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <AnimatePresence mode="popLayout">
            {chatHistory.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                layout
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                  msg.role === 'user' 
                  ? 'bg-secondary/10 border-secondary/20 text-secondary' 
                  : 'bg-primary/10 border-primary/20 text-primary shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                }`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Terminal className="w-5 h-5" />}
                </div>

                <div className={`max-w-[85%] md:max-w-[75%] p-6 rounded-2xl glass-morphism border-white/5 relative group ${
                  msg.role === 'user' ? 'bg-white/5' : 'bg-primary/5 border-primary/10'
                }`}>
                  {msg.role === 'assistant' && (
                    <div className="absolute -top-3 left-4 bg-primary/20 text-primary text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md border border-primary/30">
                      Response Matrix
                    </div>
                  )}
                  
                  <div className={`text-sm md:text-base leading-relaxed ${msg.role === 'assistant' ? 'text-white' : 'text-white/80'}`}>
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.message}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.message}</p>
                    )}
                  </div>

                  {msg.role === 'assistant' && (
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-white/20 uppercase tracking-widest">
                       <span>Processed via GPT-4o-mini</span>
                       <div className="flex items-center gap-3">
                          <button 
                            onClick={() => speak(msg.message, index)}
                            className="hover:text-primary transition-colors flex items-center gap-1"
                          >
                            <Volume2 className="w-3 h-3" /> Replay Voice
                          </button>
                       </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {chatMutation.isPending && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 items-center"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 animate-pulse">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div className="flex gap-1.5 p-4 rounded-2xl bg-primary/10 border border-primary/10">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
              </div>
            </motion.div>
          )}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Footer Input Section */}
      <div className="border-t border-white/5 bg-black/40 backdrop-blur-3xl p-6">
        <div className="max-w-4xl mx-auto">
          {chatHistory.length === 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setChatMessage(q)}
                  className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:border-primary/50 hover:text-primary transition-all"
                >
                  {q}
                </button>
              ))}
            </motion.div>
          )}

          <div className="flex gap-4 items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleListening}
              className={`w-14 h-14 rounded-2xl border-white/10 bg-white/5 transition-all ${listening ? "border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse" : "hover:border-primary hover:text-primary"}`}
            >
              {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
            
            <div className="flex-1 relative">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={listening ? "Listening for vocal commands..." : "Enter protocol or ask for advice..."}
                className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 font-bold focus:border-primary/50 text-white placeholder:text-white/20"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Button
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim() || chatMutation.isPending}
                  size="icon"
                  className="w-10 h-10 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
