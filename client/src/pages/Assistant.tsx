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
    <div className="flex flex-col h-[calc(100vh-72px)] lg:h-[calc(100vh-80px)] bg-[#030303] text-white relative overflow-hidden font-sans selection:bg-primary/40">
      {/* World-Class Canvas */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-15%] w-[70%] h-[70%] bg-primary/10 rounded-full blur-[160px] opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[140px] opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.02),transparent)]" />
      </div>
      
      {/* Signature Header */}
      <div className="shrink-0 z-40 border-b border-white/[0.04] bg-black/30 backdrop-blur-3xl px-8 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/40 blur-2xl animate-pulse" />
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-xl group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-primary drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
              </div>
              <div className="absolute -bottom-1 -right-1 flex items-center">
                <div className="w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#030303] shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
              </div>
            </div>
            <div className="space-y-0.5">
              <h1 className="text-xl font-black tracking-tight flex items-center gap-1.5 uppercase">
                POCKET <span className="text-primary italic">COACH</span>
              </h1>
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <p className="text-[9px] font-black tracking-[0.4em] text-white/20 uppercase">Elite Glow-Up Strategist</p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className={`rounded-xl px-5 h-10 border transition-all duration-500 group ${isSpeaking ? "bg-primary/20 border-primary/40 text-primary shadow-[0_0_20px_rgba(139,92,246,0.2)]" : "bg-white/5 border-white/10 text-white/50 hover:text-white"}`}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 opacity-50" /> : <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? "animate-pulse" : ""}`} />}
            <span className="ml-2 text-[10px] font-black tracking-widest hidden sm:inline">{isMuted ? "MUTED" : (isSpeaking ? "COACH SPEAKING" : "VOICE ON")}</span>
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
                <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-500 group ${
                  msg.role === 'user' 
                  ? 'bg-secondary/5 border-secondary/20 text-secondary' 
                  : 'bg-primary/5 border-primary/20 text-primary shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                }`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                </div>

                <div className={`relative max-w-[85%] md:max-w-[70%] rounded-[28px] p-6 md:p-8 border transition-all duration-500 shadow-xl ${
                  msg.role === 'user' 
                  ? 'bg-white/[0.04] border-white/10 rounded-tr-lg' 
                  : 'bg-primary/[0.03] backdrop-blur-3xl border-primary/20 rounded-tl-lg'
                }`}>
                  <div className={`text-base md:text-lg leading-relaxed tracking-tight ${msg.role === 'assistant' ? 'text-white/95 font-medium' : 'text-white font-black italic'}`}>
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-invert prose-p:leading-relaxed prose-p:mb-5 last:prose-p:mb-0 max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-strong:text-primary">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.message}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.message}</p>
                    )}
                  </div>

                  {msg.role === 'assistant' && (
                    <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shadow-[0_0_8px_rgba(139,92,246,0.3)]" />
                          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Elite Glow-Up Intel</span>
                       </div>
                       <button 
                         onClick={() => speak(msg.message, index)}
                         className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/40 hover:bg-primary/5 text-white/20 hover:text-primary transition-all group"
                       >
                         <Volume2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                         <span className="text-[9px] font-black tracking-widest hidden sm:inline uppercase">Replay Audio</span>
                       </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
            
            {chatMutation.isPending && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-5 items-center">
                <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/20">
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                </div>
                <div className="flex gap-2 p-5 rounded-[28px] bg-white/[0.03] border border-white/5 backdrop-blur-xl">
                  <span className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2.5 h-2.5 bg-primary/60 rounded-full animate-bounce" />
                </div>
              </motion.div>
            )}
            <div ref={scrollRef} />
          </div>
        </div>
      </div>

      {/* Signature Interaction Dock */}
      <div className="shrink-0 border-t border-white/[0.04] bg-black/40 backdrop-blur-4xl px-8 py-8 lg:py-10">
        <div className="max-w-4xl mx-auto space-y-10">
          {chatHistory.length === 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {[
                { q: "Level up savings?", desc: "Growth", icon: <TrendingUp className="w-4 h-4" />, color: "text-green-400" },
                { q: "50/30/20 vibe?", desc: "Balance", icon: <Zap className="w-4 h-4" />, color: "text-blue-400" },
                { q: "Spending Icks?", desc: "Safety", icon: <Bot className="w-4 h-4" />, color: "text-red-400" },
                { q: "Rainy Day Stash?", desc: "Vault", icon: <ShieldCheck className="w-4 h-4" />, color: "text-purple-400" }
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => setChatMessage(item.q)}
                  className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all duration-500 group relative overflow-hidden active:scale-95"
                >
                  <div className="flex items-center gap-4">
                    <div className={`shrink-0 w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <div className="text-left">
                       <p className="text-[10px] font-black tracking-widest text-white/20 uppercase mb-0.5">{item.desc}</p>
                       <p className="text-sm font-bold text-white group-hover:text-primary transition-colors leading-tight">{item.q}</p>
                    </div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 blur-3xl opacity-0 hover:opacity-100 transition-opacity rounded-[32px]" />
            <div className="relative flex items-center gap-5 bg-white/[0.02] border border-white/[0.06] focus-within:border-primary/40 focus-within:bg-white/[0.05] p-3 rounded-[32px] backdrop-blur-3xl shadow-3xl transition-all duration-700">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleListening}
                className={`w-14 h-14 rounded-2xl transition-all duration-500 ${listening ? "bg-red-500/20 text-red-500 shadow-[0_0_25px_rgba(239,68,68,0.3)] animate-pulse" : "bg-white/5 text-white/30 hover:text-white"}`}
              >
                {listening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </Button>
              
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={listening ? "Ready for your next move..." : "Draft a new money move..."}
                className="flex-1 bg-transparent border-none focus-visible:ring-0 text-lg font-medium placeholder:text-white/10 placeholder:font-black placeholder:uppercase placeholder:tracking-[0.4em] px-2"
              />

              <Button
                onClick={handleSendMessage}
                disabled={!chatMessage.trim() || chatMutation.isPending}
                size="icon"
                className="shrink-0 w-14 h-14 rounded-2xl bg-primary hover:bg-primary/80 text-white transition-all shadow-2xl shadow-primary/40 group active:scale-95"
              >
                <Send className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-4">
             <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
             <p className="text-[9px] font-black uppercase tracking-[0.6em] text-white/5">Pocket Coach • Financial Glow-Up OS</p>
          </div>
        </div>
      </div>

    </div>
  );
}
