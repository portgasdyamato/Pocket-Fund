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
    <div className="h-[calc(100vh-64px)] bg-[#050505] text-white flex flex-col relative overflow-hidden">
      {/* Dynamic Mesh Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-accent/15 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] right-[10%] w-[20%] h-[20%] bg-secondary/10 rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>
      
      {/* Header */}
      <div className="z-40 border-b border-white/5 bg-black/40 backdrop-blur-3xl px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/30 blur-2xl group-hover:bg-primary/50 transition-all rounded-full animate-pulse" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-all shadow-2xl backdrop-blur-md">
                <Sparkles className="w-7 h-7 text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-black" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight flex items-center gap-2 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Pocket <span className="text-primary italic">Coach</span>
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">Premium AI Guide</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className={`rounded-2xl px-5 h-10 font-black text-[10px] uppercase tracking-widest border transition-all duration-500 ${isSpeaking ? "bg-primary/20 border-primary text-primary shadow-[0_0_20px_rgba(139,92,246,0.3)]" : "bg-white/5 border-white/10 text-white/60 hover:text-white"}`}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? "animate-bounce" : ""}`} />}
              <span className="ml-2 hidden sm:inline">{isMuted ? "Muted" : (isSpeaking ? "COACH IS SPEAKING" : "Voice Active")}</span>
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
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all shrink-0 ${
                  msg.role === 'user' 
                  ? 'bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/30 text-secondary shadow-lg' 
                  : 'bg-gradient-to-br from-primary/30 to-primary/5 border-primary/40 text-primary shadow-[0_0_25px_rgba(139,92,246,0.25)]'
                }`}>
                  {msg.role === 'user' ? <User className="w-6 h-6" /> : <Sparkles className="w-6 h-6 animate-pulse" />}
                </div>

                <div className={`max-w-[85%] md:max-w-[70%] p-6 md:p-8 rounded-[32px] border relative transition-all duration-500 ${
                  msg.role === 'user' 
                  ? 'bg-white/[0.03] border-white/10 hover:border-white/20 rounded-tr-lg' 
                  : 'bg-primary/[0.08] backdrop-blur-2xl border-primary/20 hover:border-primary/40 rounded-tl-lg shadow-2xl'
                }`}>
                  {msg.role === 'assistant' && (
                    <div className="absolute -top-3 left-6 bg-primary text-white text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full border-2 border-primary shadow-xl shadow-primary/40">
                      ⚡ Coach Move
                    </div>
                  )}
                  
                  <div className={`text-sm md:text-lg leading-relaxed ${msg.role === 'assistant' ? 'text-white font-medium' : 'text-white/80'}`}>
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-invert prose-p:leading-relaxed prose-p:mb-4 last:prose-p:mb-0 max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.message}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap font-bold italic tracking-tight">{msg.message}</p>
                    )}
                  </div>

                  {msg.role === 'assistant' && (
                    <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Strategic Guidance</span>
                       </div>
                       <div className="flex items-center gap-4">
                          <button 
                            onClick={() => speak(msg.message, index)}
                            className="bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 text-white/40 hover:text-primary transition-all px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group"
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
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-4 items-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 animate-pulse shadow-lg shadow-primary/20">
                <Sparkles className="w-6 h-6 text-primary" />
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

      {/* Footer Input Section */}
      <div className="border-t border-white/5 bg-black/40 backdrop-blur-3xl p-6">
        <div className="max-w-4xl mx-auto">
          {chatHistory.length === 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
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
                  className="p-6 rounded-[32px] border border-white/5 bg-white/[0.02] text-left hover:border-primary/50 hover:bg-primary/10 transition-all duration-500 group flex flex-col gap-4 backdrop-blur-md relative overflow-hidden active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className={`w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center ${item.color} group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-500`}>
                    {item.icon}
                  </div>
                  <span className="text-sm font-black text-white/40 group-hover:text-white transition-colors uppercase tracking-tight leading-tight">
                    {item.q}
                  </span>
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
                placeholder={listening ? "I'm listening..." : "Drop a money move or ask for a Glow-Up strategy..."}
                className="h-16 bg-white/[0.05] border-white/10 rounded-2xl px-8 text-base font-bold focus:border-primary/50 focus:ring-primary/20 text-white placeholder:text-white/20 transition-all duration-300"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Button
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim() || chatMutation.isPending}
                  size="icon"
                  className="w-12 h-12 rounded-2xl bg-primary hover:bg-primary/80 text-white shadow-2xl shadow-primary/40 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group"
                >
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
