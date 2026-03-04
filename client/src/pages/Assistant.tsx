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
      {/* Technical Grid Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>
      
      {/* Header */}
      <div className="z-40 border-b border-white/5 bg-black/40 backdrop-blur-3xl px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border-2 border-primary/50 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                <Terminal className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic">
                The <span className="text-primary">Coach</span>
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Command Center Active</span>
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

      {/* Split Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Success Metrics Sidebar (Desktop Only) */}
        <div className="hidden lg:flex w-80 border-r border-white/5 bg-black/20 flex-col p-8 space-y-8 overflow-y-auto">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-4">Glow-Up Metrics</p>
            <div className="space-y-4">
              {[
                { label: 'Weekly Wins', val: '12', color: 'text-primary' },
                { label: 'Savings Streak', val: '08', color: 'text-green-500' },
                { label: 'Spending icks', val: '03', color: 'text-red-500' }
              ].map((stat) => (
                <div key={stat.label} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">{stat.label}</p>
                  <p className={`text-3xl font-black italic tracking-tighter tabular-nums ${stat.color}`}>{stat.val}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-white/5">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-4">Active Strategies</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs font-bold text-white/60">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>50/30/20 Budget Vibe</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-white/60">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span>Rainy Day Stash Growth</span>
              </div>
            </div>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 flex flex-col relative">
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="max-w-4xl mx-auto space-y-12">
              <AnimatePresence mode="popLayout">
                {chatHistory.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    layout
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}
                  >
                    <div className={`relative max-w-[85%] md:max-w-[80%] ${
                      msg.role === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-3">
                          <Terminal className="w-3.5 h-3.5 text-primary" />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">System Response</span>
                        </div>
                      )}
                      
                      <div className={`p-6 md:p-8 rounded-[24px] border-2 transition-all duration-300 ${
                        msg.role === 'user' 
                        ? 'bg-secondary/10 border-secondary/20 text-secondary' 
                        : 'bg-white/[0.03] border-white/10 group-hover:border-primary/40'
                      }`}>
                        <div className={`text-sm md:text-lg leading-relaxed ${msg.role === 'assistant' ? 'text-white font-medium' : 'text-white'}`}>
                          {msg.role === 'assistant' ? (
                            <div className="prose prose-invert prose-p:leading-relaxed prose-p:mb-4 last:prose-p:mb-0 max-w-none">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {msg.message}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap font-black tracking-tight">{msg.message}</p>
                          )}
                        </div>

                        {msg.role === 'assistant' && (
                          <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                             <div className="flex items-center gap-3">
                                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40">
                                   Status: Verified
                                </div>
                             </div>
                             <div className="flex items-center gap-4">
                                <button 
                                  onClick={() => speak(msg.message, index)}
                                  className="text-white/40 hover:text-primary transition-all p-2 rounded-lg hover:bg-primary/10 flex items-center gap-2"
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                             </div>
                          </div>
                        )}
                      </div>
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
                  <div className="flex gap-2 p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20 animate-pulse">Computing Strategy...</span>
                  </div>
                </motion.div>
              )}
              <div ref={scrollRef} />
            </div>
          </div>
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
                  className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] text-left hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group flex flex-col gap-4 relative overflow-hidden active:scale-[0.98]"
                >
                  <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-black text-white/40 group-hover:text-white transition-colors uppercase tracking-widest leading-relaxed">
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
                placeholder={listening ? "Awaiting input..." : "Input command or request strategy..."}
                className="h-16 bg-white/[0.03] border-2 border-white/5 rounded-2xl px-8 text-base font-bold focus:border-primary/50 focus:ring-0 text-white placeholder:font-black placeholder:uppercase placeholder:text-white/10 placeholder:tracking-[0.2em] transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Button
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim() || chatMutation.isPending}
                  size="icon"
                  className="w-12 h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 flex items-center justify-center transition-all group"
                >
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
