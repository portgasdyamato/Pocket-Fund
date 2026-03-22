import { useState, useEffect, useRef } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useMutation } from "@tanstack/react-query";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from "@/components/ui/button";
import {
  Send, Sparkles, User, Mic, MicOff, Volume2, VolumeX,
  TrendingUp, Zap, ShieldCheck, Brain, ArrowRight, Shield, BarChart3, Fingerprint, Activity, ShieldCheck as ShieldCheckIcon, ZapIcon, Globe, TargetIcon, MousePointer2
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";

interface ChatMessage {
  role: 'user' | 'assistant';
  message: string;
}

const QUICK_PROMPTS = [
  {
    q: "How do I start investing?",
    label: "Capital Growth",
    icon: TrendingUp,
    gradient: "from-blue-600 to-indigo-700",
  },
  {
    q: "Explain the 50/30/20 rule",
    label: "Allocation",
    icon: Zap,
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    q: "Build an emergency fund",
    label: "Risk Buffer",
    icon: ShieldCheck,
    gradient: "from-indigo-600 to-blue-700",
  },
  {
    q: "Help me fight Spending Icks",
    label: "Efficiency",
    icon: Brain,
    gradient: "from-blue-700 to-blue-900",
  },
];

export default function AskCoach() {
  const { toast } = useToast();
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      message: "Operational system check complete. I am your **Cognitive Financial Advisor** 🛰️\n\nI'm deployed to optimize your capital trajectory and eliminate fiscal inefficiencies. How shall we refine your financial architecture today?"
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
      toast({ title: "COMMS INTERFERENCE", description: "Microphone access denied.", variant: "destructive" });
    }
  };

  const speak = (text: string, index?: number) => {
    if (isMuted || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#_`]/g, ''));

    const voices = voicesRef.current;
    const femaleVoice =
      voices.find(v => /female|zira|susan|hazel|samantha|victoria|karen|moira|fiona|tessa|alex/i.test(v.name) && /en[-_]IN/i.test(v.lang)) ||
      voices.find(v => /female|zira|susan|hazel|samantha|victoria|karen|moira|fiona|tessa/i.test(v.name) && /^en/i.test(v.lang)) ||
      null;

    if (femaleVoice) utterance.voice = femaleVoice;
    utterance.pitch = 1.05;
    utterance.rate  = 0.95;

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
      if (!res.ok) throw new Error(data.message || "System error");
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
      toast({ title: "LINK DISCONNECTED", description: err.message || "Failed to reach Core AI.", variant: "destructive" });
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
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden relative">
      <div className="fixed inset-0 z-0 bg-stellar opacity-20 pointer-events-none" />

      {/* Cinematic Header */}
      <header className="relative z-30 shrink-0 h-24 border-b border-white/5 bg-white/[0.01] backdrop-blur-3xl px-12">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
             <div className="relative group">
                <div className="absolute inset-0 bg-blue-600/20 blur-2xl group-hover:blur-3xl transition-all rounded-full animate-pulse" />
                <div className="relative w-16 h-16 rounded-[24px] bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-all">
                   <Sparkles className="w-8 h-8 text-blue-500" />
                </div>
             </div>
             <div>
                <h1 className="text-2xl font-black tracking-tighter flex items-center gap-4 text-white italic">
                   Cognitive Advisor
                   <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mt-1">Operational Neural Link v4.0</p>
             </div>
          </div>
          <button
             onClick={toggleMute}
             className={`h-12 px-8 rounded-2xl flex items-center gap-4 border transition-all text-[10px] font-black tracking-widest uppercase shadow-xl ${
                isMuted ? "bg-white/5 border-white/5 text-white/20" : "bg-blue-600/10 border-blue-500/20 text-blue-500"
             }`}
          >
             {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
             {isMuted ? "Audio Muted" : "Speaker Active"}
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-12 py-16 scrollbar-hide">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <AnimatePresence>
            {isFirstMessage && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-16">
                {QUICK_PROMPTS.map((p, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => { setChatMessage(p.q); handleSend(); }}
                    className="p-10 rounded-[48px] glass-frost border-white/5 text-left group hover:border-blue-500/30 transition-all active:scale-95 shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[60px] rounded-full -mr-16 -mt-16 pointer-events-none" />
                    <div className={`w-16 h-16 rounded-[24px] bg-gradient-to-br ${p.gradient} flex items-center justify-center mb-10 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                       <p.icon className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-3">{p.label}</p>
                    <p className="text-2xl font-black tracking-tighter leading-none italic text-white">{p.q}</p>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat History */}
          <div className="space-y-16 pb-32">
            {chatHistory.map((msg, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className={`flex items-start gap-10 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                 <div className={`w-16 h-16 rounded-[28px] shrink-0 flex items-center justify-center border shadow-2xl transition-all ${
                    msg.role === 'user' ? 'bg-white/5 border-white/5' : 'bg-blue-600/10 border-blue-500/20 text-blue-500'
                 }`}>
                    {msg.role === 'user' ? <User className="w-7 h-7 text-white/40" /> : <Sparkles className="w-7 h-7" />}
                 </div>
                 <div className={`relative max-w-[85%] p-10 rounded-[56px] border glass-frost shadow-2xl ${
                    msg.role === 'user' ? 'border-white/5 rounded-tr-xl' : 'border-blue-500/10 rounded-tl-xl'
                 }`}>
                    <div className="prose prose-invert prose-lg max-w-none 
                       prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-white prose-headings:italic
                       prose-strong:text-blue-500 prose-code:text-blue-400
                       prose-p:text-white/40 prose-p:leading-relaxed prose-p:text-xl prose-p:font-medium prose-p:tracking-tight
                       prose-li:text-white/30">
                       <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.message}</ReactMarkdown>
                    </div>
                    {msg.role === 'assistant' && (
                       <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center">
                          <div className="flex items-center gap-4">
                             <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                             <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/10 italic">Core Neural Output</p>
                          </div>
                          <button onClick={() => speak(msg.message, idx)} className={`flex items-center gap-4 px-6 py-2.5 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all shadow-xl ${
                             currentlyPlaying === idx ? 'bg-blue-600/20 border-blue-500/40 text-blue-500' : 'bg-white/5 border-white/10 text-white/20'
                          }`}>
                             <Volume2 className="w-4 h-4" />
                             {currentlyPlaying === idx ? 'Playing…' : 'Replay Agent'}
                          </button>
                       </div>
                    )}
                 </div>
              </motion.div>
            ))}
            {chatMutation.isPending && (
               <div className="flex items-start gap-10">
                  <div className="w-16 h-16 rounded-[28px] bg-blue-600/10 border border-blue-500/20 text-blue-500 flex items-center justify-center shadow-2xl">
                     <Sparkles className="w-7 h-7 animate-spin" />
                  </div>
                  <div className="p-10 rounded-[56px] border border-blue-500/10 glass-frost shadow-2xl">
                     <div className="flex gap-4">
                        <span className="w-3 h-3 rounded-full bg-blue-500/40 animate-pulse" />
                        <span className="w-3 h-3 rounded-full bg-blue-500/40 animate-pulse [animation-delay:0.2s]" />
                        <span className="w-3 h-3 rounded-full bg-blue-500/40 animate-pulse [animation-delay:0.4s]" />
                     </div>
                  </div>
               </div>
            )}
            <div ref={scrollRef} />
          </div>
        </div>
      </div>

      {/* Input Dock */}
      <div className="relative z-40 shrink-0 px-12 pb-16">
         <div className="max-w-5xl mx-auto">
            <div className="relative p-4 rounded-[48px] glass-frost border-white/5 focus-within:border-blue-500/30 transition-all shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] bg-white/[0.02]">
               <div className="flex items-center gap-6">
                  <button onClick={toggleListening} className={`w-16 h-16 rounded-[32px] flex items-center justify-center transition-all shadow-2xl ${
                     listening ? 'bg-rose-500/20 text-rose-500 animate-pulse border border-rose-500/30' : 'text-white/20 hover:text-white/60 hover:bg-white/5 border border-white/5'
                  }`}>
                     {listening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                  </button>
                  <input
                     ref={inputRef}
                     value={chatMessage}
                     onChange={e => setChatMessage(e.target.value)}
                     onKeyDown={handleKey}
                     placeholder={listening ? "Operational analysis in progress..." : "Engage advisor with parameters..."}
                     className="flex-1 bg-transparent border-none outline-none text-white font-medium text-2xl placeholder:text-white/5 tracking-tight"
                  />
                  <Button
                     onClick={handleSend}
                     disabled={!chatMessage.trim() || chatMutation.isPending}
                     className="w-16 h-16 rounded-[32px] bg-blue-600 hover:bg-blue-500 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] flex items-center justify-center border-none"
                  >
                     <Send className="w-7 h-7" />
                  </Button>
               </div>
            </div>
            <div className="flex justify-center mt-10">
               <div className="px-8 py-3 rounded-full border border-white/5 bg-white/[0.01] flex items-center gap-4 shadow-xl">
                  <ShieldCheckIcon className="w-4 h-4 text-blue-500" />
                  <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/10">Neural Interface Secured</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
