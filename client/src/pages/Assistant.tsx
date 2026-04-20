import { useState, useEffect, useRef } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useMutation } from "@tanstack/react-query";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from "@/components/ui/button";
import {
  Send, Sparkles, User, Mic, MicOff, Volume2, VolumeX,
  TrendingUp, Zap, ShieldCheck, Brain, ArrowRight
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";

interface ChatMessage {
  role: 'user' | 'assistant';
  message: string;
}

const QUICK_PROMPTS = [
  {
    q: "How do I start investing?",
    label: "Investing",
    icon: TrendingUp,
    gradient: "from-emerald-600 to-teal-700",
  },
  {
    q: "Explain the 50/30/20 rule",
    label: "Budgeting",
    icon: Zap,
    gradient: "from-blue-600 to-[#64CEFB]",
  },
  {
    q: "Build an emergency fund",
    label: "Safety Net",
    icon: ShieldCheck,
    gradient: "from-blue-600 to-[#64CEFB]",
  },
  {
    q: "Help me fight Spending Icks",
    label: "Habits",
    icon: Brain,
    gradient: "from-rose-600 to-pink-700",
  },
];

export default function AskCoach() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      message: "Hey! I'm your **Financial Glow-Up Coach** 🚀\n\nI'm here to help you level up your money game — ask me anything from building your first investment portfolio to crushing your Spending Icks. What money move are we making today?"
    }
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    if (transcript) setChatMessage(transcript);
  }, [transcript]);

  useEffect(() => {
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis?.getVoices() ?? [];
    };
    loadVoices();
    window.speechSynthesis?.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', loadVoices);
  }, []);

  const toggleListening = () => {
    try {
      if (listening) {
        SpeechRecognition.stopListening();
      } else {
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
      }
    } catch {
      toast({ title: "Microphone Error", description: "Could not access microphone.", variant: "destructive" });
    }
  };

  const speak = (text: string, index?: number) => {
    if (isMuted || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#_`]/g, ''));

    const voices = voicesRef.current;
    const femaleVoice =
      voices.find(v => /female|zira|susan|hazel|samantha|victoria|karen|moira|fiona|tessa|veena|heera|ava|allison|sayaka/i.test(v.name) && /en[-_]IN/i.test(v.lang)) ||
      voices.find(v => /female|zira|susan|hazel|samantha|victoria|karen|moira|fiona|tessa|veena|heera|ava|allison|sayaka/i.test(v.name) && /^en/i.test(v.lang)) ||
      voices.find(v => /female|zira|susan|hazel|samantha|victoria|karen|moira|fiona|tessa|veena|heera|ava|allison|sayaka/i.test(v.name)) ||
      voices.find(v => v.name.toLowerCase().includes('female') && /^en/i.test(v.lang)) ||
      null;

    if (femaleVoice) utterance.voice = femaleVoice;
    utterance.pitch = 1.1;
    utterance.rate  = 1.0;

    utterance.onstart = () => { if (index !== undefined) setCurrentlyPlaying(index); };
    utterance.onend = () => setCurrentlyPlaying(null);
    utterance.onerror = () => setCurrentlyPlaying(null);
    window.speechSynthesis.speak(utterance);
  };

  const toggleMute = () => {
    window.speechSynthesis.cancel();
    setIsMuted(!isMuted);
    setCurrentlyPlaying(null);
  };

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest("/api/ai/chat", "POST", { message });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Communication error");
      return data;
    },
    onSuccess: (data: any) => {
      const idx = chatHistory.length;
      setChatHistory(p => [...p, { role: 'assistant', message: data.response }]);
      setChatMessage("");
      resetTranscript();
      setTimeout(() => speak(data.response, idx), 100);
    },
    onError: (err: any) => {
      toast({ title: "Coach Offline", description: err.message || "Failed to reach your Coach.", variant: "destructive" });
    },
  });

  const handleSend = () => {
    if (!chatMessage.trim() || chatMutation.isPending) return;
    setChatHistory(p => [...p, { role: 'user', message: chatMessage }]);
    chatMutation.mutate(chatMessage);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const isFirstMessage = chatHistory.length === 1;

  return (
    <div className="flex flex-col h-[calc(100vh-72px)] lg:h-[calc(100vh-80px)] bg-[#050505] text-white overflow-hidden">

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#64CEFB]/5 rounded-full blur-[120px]" />
      </div>


      {/* ══════════ MAIN CONTENT AREA ══════════ */}
      <div className="flex-1 flex overflow-hidden relative border-t border-white/5">
        
        {/* Left Sidebar (Desktop Only) */}
        <aside className="hidden xl:flex flex-col w-72 p-6 space-y-6 border-r border-white/5 bg-black/20 backdrop-blur-sm relative z-30">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20">Account Overview</p>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-black text-green-400 tracking-tighter italic">LIVE</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-white/30 uppercase tracking-widest">Wallet</span>
                <span className="text-sm font-black text-primary italic">₹{parseFloat(user?.walletBalance?.toString() || "0").toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-white/30 uppercase tracking-widest">Status</span>
                <span className="text-[11px] font-black text-white/60 italic uppercase tracking-[0.1em]">Online</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t border-white/5">
             <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20">Capabilities</p>
             <div className="space-y-3">
                {[
                  "Investment Strategy",
                  "Expense Auditing",
                  "Wealth Scaling",
                  "Habit Tracking"
                ].map((cap, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                    <span className="text-xs font-bold text-white/40 uppercase tracking-[0.15em] italic">{cap}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="mt-auto pt-4 border-t border-white/5">
            <button
               onClick={toggleMute}
               className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border transition-all duration-200 ${
                 isMuted
                   ? "bg-white/5 border-white/10 text-white/30"
                   : "bg-primary/5 border-primary/20 text-primary"
               }`}
             >
               <div className="flex items-center gap-2">
                 {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                 <span>{isMuted ? "Audio Off" : "Audio On"}</span>
               </div>
               <div className={`w-1.5 h-1.5 rounded-full ${isMuted ? "bg-white/10" : "bg-primary animate-pulse"}`} />
             </button>
          </div>
        </aside>

        {/* Central Chat Column */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className={`flex-1 ${isFirstMessage ? "overflow-hidden" : "overflow-y-auto"} scrollbar-hide px-6 pb-4 pt-4`}>
            <div className="max-w-5xl mx-auto space-y-8">

              {/* Quick prompt cards */}
              <AnimatePresence>
                {isFirstMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                  >
                    {QUICK_PROMPTS.map((p, i) => {
                      const Icon = p.icon;
                      return (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, y: 12, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: i * 0.07, type: "spring", stiffness: 260, damping: 20 }}
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => { setChatMessage(p.q); handleSend(); }}
                          className={`group relative p-6 rounded-3xl bg-gradient-to-br ${p.gradient} transition-all duration-300 text-left overflow-hidden border border-white/10 ice-frost`}
                        >
                          {/* Shine overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                          
                          <div className="relative">
                            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 shadow-inner">
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-white/70 italic">{p.label}</p>
                            <p className="text-sm font-bold text-white leading-snug">{p.q}</p>
                            <ArrowRight className="w-4 h-4 mt-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                          </div>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Messages */}
              <div className="space-y-8">
                <AnimatePresence mode="popLayout">
                  {chatHistory.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 14, scale: 0.99 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end`}
                    >
                      {/* Avatar */}
                      <div className={`shrink-0 mb-1 w-10 h-10 rounded-2xl flex items-center justify-center border shadow-xl ${
                        msg.role === 'user'
                          ? 'bg-white/5 border-white/10 text-white/40'
                          : 'bg-gradient-to-br from-primary/25 to-[#64CEFB]/10 border-primary/30 text-primary'
                      }`}>
                        {msg.role === 'user'
                          ? <User className="w-5 h-5" />
                          : <Sparkles className="w-5 h-5" />}
                      </div>

                      {/* Bubble */}
                      <div className={`group relative max-w-[85%] sm:max-w-[80%] ${
                        msg.role === 'user'
                          ? 'rounded-[32px] rounded-br-sm ice-frost border-white/5'
                          : 'rounded-[32px] rounded-bl-sm ice-frost border-primary/10 bg-primary/[0.02]'
                      } px-8 py-7 shadow-2xl`}>

                        {/* Inner content */}
                        <div className={`text-base leading-relaxed ${
                          msg.role === 'user'
                            ? 'text-white/80 font-medium italic'
                            : 'text-white/90'
                        }`}>
                          {msg.role === 'assistant' ? (
                            <div className="prose prose-invert prose-sm max-w-none
                              prose-headings:font-black prose-headings:tracking-tight prose-headings:text-white prose-headings:mb-4 prose-headings:mt-6 first:prose-headings:mt-0 italic
                              prose-h2:text-lg prose-h3:text-sm prose-h3:uppercase prose-h3:tracking-widest prose-h3:text-primary/80
                              prose-strong:text-primary prose-strong:font-black
                              prose-p:text-white/85 prose-p:leading-relaxed prose-p:mb-4 last:prose-p:mb-0
                              prose-li:text-white/80 prose-li:leading-relaxed
                              prose-ul:my-4 prose-ol:my-4 prose-li:mb-2
                              prose-code:text-primary prose-code:bg-primary/10 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:text-xs prose-code:font-mono
                              prose-hr:border-white/10 prose-hr:my-6
                              prose-blockquote:border-l-primary prose-blockquote:border-l-4 prose-blockquote:pl-6 prose-blockquote:text-white/40 prose-blockquote:italic
                            ">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.message}</ReactMarkdown>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap">{msg.message}</p>
                          )}
                        </div>

                        {/* Replay footer for AI messages */}
                        {msg.role === 'assistant' && (
                          <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/[0.08]">
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/15 italic inline-flex items-center gap-2">
                               <ShieldCheck className="w-3 h-3" /> Privacy Shield Active
                            </span>
                            <button
                              onClick={() => speak(msg.message, index)}
                              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                currentlyPlaying === index
                                  ? "bg-primary/20 border-primary/40 text-primary"
                                  : "bg-white/[0.03] border-white/5 text-white/20 hover:text-white/50 hover:border-white/20"
                              }`}
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>{currentlyPlaying === index ? "Playing..." : "Listen"}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Typing indicator */}
              <AnimatePresence>
                {chatMutation.isPending && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex gap-6 items-end pt-4"
                  >
                    <div className="w-10 h-10 mb-1 rounded-2xl bg-gradient-to-br from-primary/25 to-[#64CEFB]/10 border-primary/30 flex items-center justify-center ice-frost">
                      <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                    </div>
                    <div className="rounded-[32px] rounded-bl-sm px-8 py-7 ice-frost border-white/5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-primary/60 animate-bounce" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={scrollRef} className="h-20 sm:h-32" />
            </div>
          </div>

          {/* ══════════ INPUT DOCK ══════════ */}
          <div className="relative shrink-0 z-20 px-6 pb-8">
            <div className="max-w-5xl mx-auto">
              <div className="relative p-2 rounded-[32px] ice-frost border-white/20 focus-within:border-primary/50 transition-all duration-500 shadow-2xl">
                {/* Glow on focus */}
                <div className="absolute inset-0 rounded-[32px] bg-primary/5 opacity-0 focus-within:opacity-100 transition-opacity pointer-events-none blur-xl" />

                <div className="relative flex items-center gap-3">
                  {/* Mic */}
                  {browserSupportsSpeechRecognition && (
                    <button
                      onClick={toggleListening}
                      className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        listening
                          ? "bg-red-500/20 text-red-400 ring-2 ring-red-500/40 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                          : "bg-white/[0.03] text-white/25 hover:text-white/60 hover:bg-white/[0.08] hover:border-white/10 border border-transparent"
                      }`}
                    >
                      {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  )}

                  {/* Text input */}
                  <input
                    ref={inputRef}
                    value={chatMessage}
                    onChange={e => setChatMessage(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder={listening ? "I'm listening..." : "Ask me anything..."}
                    className="flex-1 bg-transparent border-none outline-none text-base text-white placeholder:text-white/15 font-black tracking-wide py-3 italic"
                  />

                  {/* Send button */}
                  <Button
                    onClick={handleSend}
                    disabled={!chatMessage.trim() || chatMutation.isPending}
                    className="shrink-0 w-14 h-14 rounded-2xl bg-white text-black hover:bg-white/90 disabled:opacity-30 transition-all shadow-2xl hover:scale-105 active:scale-95 group"
                  >
                    <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Sidebar (Desktop Only) */}
        <aside className="hidden 2xl:flex flex-col w-72 p-6 space-y-6 border-l border-white/5 bg-black/20 backdrop-blur-sm">
           <div className="space-y-4">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20">Metrics</p>
              <div className="grid grid-cols-1 gap-4">
                 {[
                   { label: "Wallet Stability", value: "98.4%", color: "text-emerald-400" },
                   { label: "Savings Velocity", value: "+12.4%", color: "text-primary" },
                   { label: "Risk Index", value: "Low", color: "text-white/60" }
                 ].map((stat, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">stat // {stat.label}</p>
                       <p className={`text-xl font-black italic ${stat.color} leading-none tracking-tighter`}>{stat.value}</p>
                    </div>
                 ))}
              </div>
           </div>
           
           <div className="mt-auto p-5 rounded-3xl bg-primary/5 border border-primary/20 space-y-3">
              <div className="flex items-center gap-2 text-primary">
                 <ShieldCheck className="w-4 h-4" />
                 <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">Advisor Privacy</span>
              </div>
              <p className="text-[11px] font-medium text-white/30 leading-relaxed italic">
                 Your data is private. Your financial footprint remains between you and your coach.
              </p>
           </div>
        </aside>
      </div>
    </div>
  );
}
