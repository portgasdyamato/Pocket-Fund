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
    <div className="flex flex-col h-[calc(100vh-72px)] lg:h-[calc(100vh-80px)] bg-[#050505] text-white relative overflow-hidden font-sans selection:bg-primary/30">
      {/* Designer Atmospheric Depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
      </div>
      
      {/* Refined Header */}
      <div className="shrink-0 z-40 border-b border-white/[0.05] bg-black/40 backdrop-blur-3xl px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-xl animate-pulse" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-white/[0.08] to-transparent flex items-center justify-center border border-white/10 backdrop-blur-md">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-[#050505]" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight flex items-center gap-1.5 uppercase">
                Pocket <span className="text-primary italic">Coach</span>
              </h1>
              <p className="text-[9px] font-bold tracking-[0.2em] text-white/30 uppercase">Intelligent Financial OS</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className={`rounded-xl px-4 h-9 font-bold text-[10px] tracking-widest border transition-all duration-300 ${isSpeaking ? "bg-primary/10 border-primary/50 text-primary shadow-[0_0_15px_rgba(139,92,246,0.2)]" : "bg-white/5 border-white/10 text-white/50"}`}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? "animate-pulse" : ""}`} />}
            <span className="ml-2 hidden sm:inline">{isMuted ? "MUTED" : (isSpeaking ? "SPEAKING" : "VOICE")}</span>
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
                <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                  msg.role === 'user' 
                  ? 'bg-secondary/10 border-secondary/20 text-secondary' 
                  : 'bg-primary/10 border-primary/20 text-primary'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>

                <div className={`relative max-w-[85%] md:max-w-[75%] rounded-2xl p-5 md:p-7 border transition-all duration-300 ${
                  msg.role === 'user' 
                  ? 'bg-white/[0.03] border-white/10 rounded-tr-none' 
                  : 'bg-primary/[0.06] backdrop-blur-2xl border-primary/10 rounded-tl-none'
                }`}>
                  <div className={`text-sm md:text-base leading-relaxed tracking-tight ${msg.role === 'assistant' ? 'text-white/90 font-medium' : 'text-white font-bold'}`}>
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
                    <div className="mt-6 pt-4 border-t border-white/[0.05] flex items-center justify-between">
                       <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20">Coach Insights v1.0</span>
                       <button 
                         onClick={() => speak(msg.message, index)}
                         className="p-2 rounded-lg text-white/20 hover:text-primary hover:bg-primary/10 transition-all flex items-center gap-2 group"
                       >
                         <Volume2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                         <span className="text-[8px] font-black uppercase tracking-widest hidden sm:inline">Replay</span>
                       </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
            
            {chatMutation.isPending && (
              <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4 items-center">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                </div>
                <div className="flex gap-1.5 p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" />
                </div>
              </motion.div>
            )}
            <div ref={scrollRef} />
          </div>
        </div>
      </div>

      {/* Sticky Interaction Area */}
      <div className="shrink-0 border-t border-white/[0.05] bg-black/40 backdrop-blur-3xl px-6 py-6 lg:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {chatHistory.length === 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4"
            >
              {[
                { q: "Level up savings?", icon: <TrendingUp className="w-4 h-4" />, color: "text-green-400" },
                { q: "50/30/20 vibe?", icon: <Zap className="w-4 h-4" />, color: "text-blue-400" },
                { q: "Spending Icks?", icon: <Bot className="w-4 h-4" />, color: "text-red-400" },
                { q: "Rainy Day Stash?", icon: <ShieldCheck className="w-4 h-4" />, color: "text-purple-400" }
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => setChatMessage(item.q)}
                  className="p-3 lg:p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center gap-3 backdrop-blur-sm group active:scale-95"
                >
                  <div className={`shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                    {item.q}
                  </span>
                </button>
              ))}
            </motion.div>
          )}

          <div className="relative group">
            <div className="absolute inset-0 bg-primary/10 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-[24px]" />
            <div className="relative flex items-center gap-3 bg-white/[0.02] border border-white/[0.08] focus-within:border-primary/40 focus-within:bg-white/[0.04] p-2 rounded-[22px] backdrop-blur-4xl transition-all duration-500">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleListening}
                className={`w-12 h-12 rounded-xl transition-all duration-300 ${listening ? "bg-red-500/10 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-pulse" : "text-white/20 hover:text-white hover:bg-white/5"}`}
              >
                {listening ? <MicOff className="w-5 h-5 " /> : <Mic className="w-5 h-5" />}
              </Button>
              
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={listening ? "Coach is listening..." : "Direct a money move..."}
                className="flex-1 bg-transparent border-none focus-visible:ring-0 text-base md:text-lg placeholder:text-white/10 placeholder:font-black placeholder:uppercase placeholder:tracking-[0.2em]"
              />

              <Button
                onClick={handleSendMessage}
                disabled={!chatMessage.trim() || chatMutation.isPending}
                size="icon"
                className="shrink-0 w-12 h-12 rounded-xl bg-primary hover:bg-primary/80 text-white transition-all shadow-xl shadow-primary/20 group active:scale-95"
              >
                <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center pb-2">
             <div className="w-12 h-1 rounded-full bg-white/[0.05]" />
          </div>
        </div>
      </div>

    </div>
  );
}
