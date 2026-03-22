import { useState, useEffect, useRef } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useMutation } from "@tanstack/react-query";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from "@/components/ui/button";
import {
  Send, Sparkles, User, Mic, MicOff, Volume2, VolumeX,
  TrendingUp, Zap, ShieldCheck, Brain, ArrowRight, Shield
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

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
    gradient: "from-cyan-600 to-blue-700",
  },
  {
    q: "Build an emergency fund",
    label: "Risk Buffer",
    icon: ShieldCheck,
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    q: "Help me fight Spending Icks",
    label: "Efficiency",
    icon: Brain,
    gradient: "from-indigo-600 to-blue-800",
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
    <div className="flex flex-col h-[calc(100vh-80px)] bg-[#020205] text-white selection:bg-blue-500/30 overflow-hidden relative">
      <div className="fixed inset-0 z-0 bg-mesh opacity-20 pointer-events-none" />

      {/* Pro Header */}
      <header className="relative z-20 shrink-0 h-20 border-b border-white/[0.03] bg-[#020205]/40 backdrop-blur-2xl px-6">
        <div className="max-w-4xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-5">
             <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl animate-pulse rounded-full" />
                <div className="relative w-11 h-11 rounded-[14px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                   <Sparkles className="w-5 h-5 text-blue-400" />
                </div>
             </div>
             <div>
                <h1 className="text-xl font-black tracking-tighter flex items-center gap-3">
                   Cognitive Advisor
                   <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Operational Neural Link v4.0</p>
             </div>
          </div>
          <button
             onClick={toggleMute}
             className={`h-10 px-4 rounded-xl flex items-center gap-2 border transition-all text-[10px] font-black tracking-widest uppercase ${
                isMuted ? "bg-white/5 border-white/5 text-white/20" : "bg-blue-500/10 border-blue-500/20 text-blue-400"
             }`}
          >
             {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
             {isMuted ? "Audio Muted" : "Speaker Active"}
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 py-10 scrollbar-hide">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <AnimatePresence>
            {isFirstMessage && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
                {QUICK_PROMPTS.map((p, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => { setChatMessage(p.q); handleSend(); }}
                    className="p-6 rounded-[32px] glass-card border-white/5 text-left group hover:border-blue-500/30 transition-all active:scale-95"
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.gradient} flex items-center justify-center mb-6 shadow-xl`}>
                       <p.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-2">{p.label}</p>
                    <p className="text-xl font-black tracking-tighter leading-tight">{p.q}</p>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat History */}
          <div className="space-y-12 pb-24">
            {chatHistory.map((msg, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className={`flex items-start gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                 <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center border shadow-xl ${
                    msg.role === 'user' ? 'bg-white/5 border-white/5' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                 }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-white/40" /> : <Sparkles className="w-4 h-4" />}
                 </div>
                 <div className={`relative max-w-[85%] p-7 rounded-[40px] border glass-card ${
                    msg.role === 'user' ? 'border-white/5 rounded-tr-sm' : 'border-blue-500/10 rounded-tl-sm'
                 }`}>
                    <div className="prose prose-invert prose-sm max-w-none 
                       prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-white
                       prose-strong:text-blue-400 prose-code:text-cyan-400
                       prose-p:text-white/70 prose-p:leading-relaxed prose-p:text-base prose-p:font-medium
                       prose-li:text-white/60">
                       <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.message}</ReactMarkdown>
                    </div>
                    {msg.role === 'assistant' && (
                       <div className="mt-8 pt-4 border-t border-white/[0.03] flex justify-between items-center">
                          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/10 italic">Core Neural Output</p>
                          <button onClick={() => speak(msg.message, idx)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${
                             currentlyPlaying === idx ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : 'bg-white/5 border-white/10 text-white/20'
                          }`}>
                             <Volume2 className="w-3 h-3" />
                             {currentlyPlaying === idx ? 'Playing…' : 'Replay'}
                          </button>
                       </div>
                    )}
                 </div>
              </motion.div>
            ))}
            {chatMutation.isPending && (
               <div className="flex items-start gap-6">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                     <Sparkles className="w-4 h-4 animate-spin-slow" />
                  </div>
                  <div className="p-7 rounded-[40px] border border-blue-500/10 glass-card">
                     <div className="flex gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500/40 animate-pulse" />
                        <span className="w-2 h-2 rounded-full bg-blue-500/40 animate-pulse [animation-delay:0.2s]" />
                        <span className="w-2 h-2 rounded-full bg-blue-500/40 animate-pulse [animation-delay:0.4s]" />
                     </div>
                  </div>
               </div>
            )}
            <div ref={scrollRef} />
          </div>
        </div>
      </div>

      {/* Input Dock */}
      <div className="relative z-30 shrink-0 px-6 pb-10">
         <div className="max-w-4xl mx-auto">
            <div className="relative p-2 rounded-[32px] glass-card border-white/5 focus-within:border-blue-500/30 transition-all shadow-2xl">
               <div className="flex items-center gap-4">
                  <button onClick={toggleListening} className={`w-12 h-12 rounded-[22px] flex items-center justify-center transition-all ${
                     listening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-white/20 hover:text-white/60 hover:bg-white/5'
                  }`}>
                     {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <input
                     ref={inputRef}
                     value={chatMessage}
                     onChange={e => setChatMessage(e.target.value)}
                     onKeyDown={handleKey}
                     placeholder={listening ? "Operational analysis in progress..." : "Engage advisor with parameters..."}
                     className="flex-1 bg-transparent border-none outline-none text-white font-medium text-lg placeholder:text-white/10"
                  />
                  <Button
                     onClick={handleSend}
                     disabled={!chatMessage.trim() || chatMutation.isPending}
                     className="w-12 h-12 rounded-[22px] bg-blue-500 hover:bg-blue-600 shadow-xl shadow-blue-500/20 flex items-center justify-center"
                  >
                     <Send className="w-5 h-5" />
                  </Button>
               </div>
            </div>
            <div className="flex justify-center mt-6">
               <div className="px-5 py-1.5 rounded-full border border-white/[0.03] bg-white/[0.01] flex items-center gap-3">
                  <Shield className="w-3 h-3 text-white/20" />
                  <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/10">Neural Interface Secured</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

