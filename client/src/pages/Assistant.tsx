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
    <div className="flex flex-col h-[calc(100vh-72px)] lg:h-[calc(100vh-80px)] bg-[#050505] text-white relative overflow-hidden font-sans">
      {/* World-Class Atmospheric Depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-accent/15 rounded-full blur-[140px]" />
        <div className="absolute top-[30%] right-[10%] w-[25%] h-[25%] bg-secondary/10 rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505]" />
      </div>
      
      {/* Designer Header */}
      <div className="shrink-0 z-40 border-b border-white/[0.03] bg-black/40 backdrop-blur-3xl px-8 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/40 blur-2xl animate-pulse" />
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-md">
                <Sparkles className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[#050505] shadow-lg shadow-green-500/20" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight flex items-center gap-1.5">
                POCKET <span className="text-primary italic">COACH</span>
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Status: </span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500/80 animate-pulse">Online & Active</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className={`rounded-2xl px-5 h-10 font-black text-[10px] uppercase tracking-widest border transition-all duration-500 ${isSpeaking ? "bg-primary/20 border-primary text-primary shadow-[0_0_20px_rgba(139,92,246,0.3)]" : "bg-white/5 border-white/10 text-white/60"}`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className={`w-4 h-4 ${isSpeaking ? "animate-bounce" : ""}`} />}
              <span className="ml-2 hidden sm:inline">{isMuted ? "MUTED" : (isSpeaking ? "COACH SPEAKING" : "VOICE ACTIVE")}</span>
            </Button>
          </div>
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
                <div className={`shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                  msg.role === 'user' 
                  ? 'bg-secondary/20 border-secondary/30 text-secondary' 
                  : 'bg-primary/20 border-primary/30 text-primary shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                }`}>
                  {msg.role === 'user' ? <User className="w-6 h-6" /> : <Sparkles className="w-6 h-6 animate-pulse" />}
                </div>

                <div className={`relative max-w-[85%] md:max-w-[70%] rounded-[32px] p-6 md:p-8 border transition-all duration-500 shadow-2xl ${
                  msg.role === 'user' 
                  ? 'bg-white/[0.03] border-white/10 rounded-tr-lg' 
                  : 'bg-primary/[0.08] backdrop-blur-3xl border-primary/20 rounded-tl-lg'
                }`}>
                  <div className={`text-sm md:text-lg leading-relaxed tracking-tight ${msg.role === 'assistant' ? 'text-white font-medium' : 'text-white/80 font-bold italic'}`}>
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-invert prose-p:leading-relaxed prose-p:mb-4 last:prose-p:mb-0 max-w-none prose-headings:font-black prose-headings:tracking-tighter">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.message}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.message}</p>
                    )}
                  </div>

                  {msg.role === 'assistant' && (
                    <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Strategic Coach Insight</span>
                       </div>
                       <div className="flex items-center gap-4">
                          <button 
                            onClick={() => speak(msg.message, index)}
                            className="bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 text-white/30 hover:text-primary transition-all px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2.5 group"
                          >
                            <Volume2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Replay Voice
                          </button>
                       </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
            
            {chatMutation.isPending && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 animate-pulse shadow-lg shadow-primary/20">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="flex gap-2 p-5 rounded-[24px] bg-primary/[0.05] border border-primary/10 backdrop-blur-xl">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                </div>
              </motion.div>
            )}
            <div ref={scrollRef} />
          </div>
        </div>
      </div>

      {/* Premium Interaction Section */}
      <div className="shrink-0 bg-gradient-to-t from-black via-black/95 to-transparent pt-12 pb-10 px-8">
        <div className="max-w-5xl mx-auto space-y-10">
          {chatHistory.length === 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {[
                { q: "How do I level up my savings?", desc: "Strategic growth strategies", icon: <TrendingUp className="w-5 h-5" />, color: "text-green-400", bg: "bg-green-400/10" },
                { q: "What's the 50/30/20 budget vibe?", desc: "Master the balance moves", icon: <Zap className="w-5 h-5" />, color: "text-blue-400", bg: "bg-blue-400/10" },
                { q: "Help me avoid Spending Icks!", desc: "Eliminate the toxins", icon: <Bot className="w-5 h-5" />, color: "text-red-400", bg: "bg-red-400/10" },
                { q: "How to build a Rainy Day Stash?", desc: "Security & Peace of mind", icon: <ShieldCheck className="w-5 h-5" />, color: "text-purple-400", bg: "bg-purple-400/10" }
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => setChatMessage(item.q)}
                  className="p-6 rounded-[32px] bg-white/[0.03] border border-white/5 hover:border-primary/50 hover:bg-primary/10 transition-all duration-500 flex flex-col items-start gap-4 backdrop-blur-sm group relative overflow-hidden active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} group-hover:scale-110 transition-all duration-500 shadow-xl`}>
                    {item.icon}
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">{item.desc}</p>
                    <p className="text-sm font-bold text-white group-hover:text-primary transition-colors leading-tight">{item.q}</p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          <div className="relative group p-[2px] rounded-[30px] bg-gradient-to-r from-white/5 to-white/[0.02] focus-within:from-primary/50 focus-within:to-accent/50 transition-all duration-700">
            <div className="relative flex items-center gap-4 bg-[#080808] p-3 rounded-[28px] shadow-2xl backdrop-blur-4xl transition-all">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleListening}
                className={`w-14 h-14 rounded-2xl transition-all duration-500 ${listening ? "bg-red-500/20 text-red-500 scale-110 shadow-[0_0_25px_rgba(239,68,68,0.3)] animate-pulse" : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"}`}
              >
                {listening ? <MicOff className="w-6 h-6 " /> : <Mic className="w-6 h-6" />}
              </Button>
              
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={listening ? "I'm listening to your strategy..." : "Direct a money move to your Coach..."}
                className="flex-1 bg-transparent border-none focus-visible:ring-0 text-lg font-medium placeholder:text-white/10 placeholder:font-black placeholder:uppercase placeholder:tracking-[0.2em] px-2"
              />

              <Button
                onClick={handleSendMessage}
                disabled={!chatMessage.trim() || chatMutation.isPending}
                size="icon"
                className="shrink-0 w-14 h-14 rounded-2xl bg-primary hover:bg-primary/80 text-white transition-all duration-500 shadow-2xl shadow-primary/40 group active:scale-95"
              >
                <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center flex-col items-center gap-3">
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10">Pocket Coach • Financial Glow-Up OS</p>
             <div className="w-16 h-[2px] rounded-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          </div>
        </div>
      </div>

    </div>
  );
}
