import { useState, useEffect, useRef } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useMutation } from "@tanstack/react-query";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles, User, Mic, MicOff, Volume2, VolumeX, Bot, Terminal, ChevronRight, TrendingUp, Zap, ShieldCheck } from "lucide-react";
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
      message: "Hey there! I'm your Financial Glow-Up Coach. 🚀 I'm here to help you crush your goals and level up your money game. How can we make some winning money moves today?"
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
        title: "Microphone Error",
        description: "Could not access microphone. Please check your permissions.",
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
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Communication error");
      return data;
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
    onError: (error: any) => {
      toast({
        title: "Coach Error",
        description: error.message || "Failed to connect with your Coach.",
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
    "How do I level up my savings?",
    "What's the 50/30/20 budget vibe?",
    "Help me avoid Spending Icks!",
    "How to build a Rainy Day Stash?"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-72px)] lg:h-[calc(100vh-80px)] bg-[#010101] text-white relative overflow-hidden">
      {/* Premium Glow Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(139,92,246,0.15),transparent_70%)]" />
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[140px]" />
      </div>
      
      {/* Header */}
      <div className="shrink-0 z-40 border-b border-white/5 bg-black/60 backdrop-blur-xl px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/40 blur-xl group-hover:bg-primary/60 transition-all rounded-full animate-pulse" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-foreground/20 flex items-center justify-center border border-white/20 shadow-2xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Pocket <span className="text-primary italic">Coach</span>
              </h1>
              <span className="text-[10px] font-medium text-green-500/80 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Coach Active
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className={`rounded-xl px-3 h-8 bg-white/5 border border-white/10 text-xs font-semibold ${isSpeaking ? "text-primary border-primary/50" : "text-white/40"}`}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide py-10 px-4">
        <div className="max-w-3xl mx-auto flex flex-col justify-end min-h-full">
          <div className="space-y-8 pb-4">
            <AnimatePresence mode="popLayout">
            {chatHistory.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                layout
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                  msg.role === 'user' 
                  ? 'bg-secondary text-secondary-foreground' 
                  : 'bg-primary text-white'
                }`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                </div>

                <div className={`relative max-w-[85%] md:max-w-[80%] rounded-2xl p-5 md:p-6 transition-all duration-300 ${
                  msg.role === 'user' 
                  ? 'bg-white/[0.08] text-white border border-white/10 rounded-tr-none shadow-xl' 
                  : 'bg-primary/[0.05] border border-primary/20 text-white rounded-tl-none backdrop-blur-3xl shadow-2xl'
                }`}>
                  <div className={`text-[15px] md:text-base leading-relaxed ${msg.role === 'assistant' ? 'font-medium' : 'font-normal'}`}>
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-invert prose-p:leading-relaxed prose-p:mb-4 last:prose-p:mb-0 max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.message}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.message}</p>
                    )}
                  </div>

                  {msg.role === 'assistant' && (
                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                       <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">Pocket Coach Insight</span>
                       <button 
                         onClick={() => speak(msg.message, index)}
                         className="p-1.5 rounded-lg text-white/20 hover:text-primary hover:bg-primary/10 transition-all"
                       >
                         <Volume2 className="w-4 h-4" />
                       </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
            
            {chatMutation.isPending && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 items-center">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                </div>
                <div className="h-4 w-12 bg-white/5 rounded-full animate-pulse" />
              </motion.div>
            )}
            <div ref={scrollRef} />
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="shrink-0 bg-gradient-to-t from-black via-black/95 to-transparent pt-10 pb-8 px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {chatHistory.length === 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {[
                { q: "How do I level up my savings?", icon: <TrendingUp className="w-4 h-4" />, color: "text-green-400" },
                { q: "What's the 50/30/20 budget vibe?", icon: <Zap className="w-4 h-4" />, color: "text-blue-400" },
                { q: "Help me avoid Spending Icks!", icon: <Bot className="w-4 h-4" />, color: "text-red-400" },
                { q: "How to build a Rainy Day Stash?", icon: <ShieldCheck className="w-4 h-4" />, color: "text-purple-400" }
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => setChatMessage(item.q)}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center gap-3 text-left group"
                >
                  <div className={`shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-medium text-white/50 group-hover:text-white transition-colors line-clamp-1">
                    {item.q}
                  </span>
                </button>
              ))}
            </motion.div>
          )}

          <div className="relative group">
            <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-2xl" />
            <div className="relative flex items-center gap-3 bg-white/[0.03] border border-white/10 focus-within:border-primary/50 p-2 rounded-2xl backdrop-blur-xl transition-all">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleListening}
                className={`w-10 h-10 rounded-xl transition-all ${listening ? "bg-red-500/20 text-red-500" : "text-white/40 hover:text-white"}`}
              >
                {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={listening ? "Listening closely..." : "Ask your Coach..."}
                className="flex-1 bg-transparent border-none focus-visible:ring-0 text-base placeholder:text-white/20 px-0 h-10"
              />

              <Button
                onClick={handleSendMessage}
                disabled={!chatMessage.trim() || chatMutation.isPending}
                size="icon"
                className="shrink-0 w-10 h-10 rounded-xl bg-primary hover:bg-primary/80 text-white transition-all shadow-lg shadow-primary/20"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-4 flex justify-center">
             <div className="w-24 h-1 rounded-full bg-white/5" />
          </div>
        </div>
      </div>

    </div>
  );
}
