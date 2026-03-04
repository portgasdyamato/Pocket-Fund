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
    <div className="h-[calc(100vh-64px)] bg-[#010101] text-white flex flex-col relative overflow-hidden">
      {/* Premium Glow Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[100%] h-[40%] bg-primary/10 rounded-full blur-[160px]" />
        <div className="absolute top-[-20%] -left-[10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-20%] -right-[10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[140px]" />
      </div>
      
      {/* Header */}
      <div className="z-40 border-b border-white/5 bg-black/40 backdrop-blur-3xl px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/40 blur-2xl group-hover:bg-primary/60 transition-all rounded-full animate-pulse" />
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-foreground/20 flex items-center justify-center border border-white/20 shadow-2xl">
                <Sparkles className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Pocket <span className="text-primary italic">Coach</span>
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-medium text-white/40 uppercase tracking-widest">Always Active • Level Up Ready</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMute}
              className={`rounded-xl px-4 h-9 font-semibold text-[11px] uppercase tracking-wider backdrop-blur-md transition-all duration-300 ${isSpeaking ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(139,92,246,0.3)]" : "bg-white/5 border-white/10 text-white/60"}`}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? "animate-pulse" : ""}`} />}
              <span className="ml-2 hidden sm:inline">{isMuted ? "Muted" : (isSpeaking ? "Speaking" : "Voice On")}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-10">
        <div className="max-w-3xl mx-auto space-y-10">
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
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 items-center"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center animate-pulse">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="flex gap-1.5 items-center px-4 py-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
                <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" />
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
                  className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group flex items-center gap-4 backdrop-blur-md active:scale-95"
                >
                  <div className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <span className="text-sm font-semibold text-white/60 group-hover:text-white transition-colors">
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
            
            <div className="flex-1 relative flex items-center">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={listening ? "Listening closely..." : "Ask your Coach about money moves..."}
                className="h-14 bg-white/[0.05] border-white/10 rounded-2xl pl-6 pr-14 text-base focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all placeholder:text-white/20"
              />
              <div className="absolute right-2 px-1">
                <Button
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim() || chatMutation.isPending}
                  size="icon"
                  className="w-10 h-10 rounded-xl bg-primary hover:bg-primary/80 transition-all"
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
