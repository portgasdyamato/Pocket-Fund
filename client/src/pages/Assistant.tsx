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

  // Load available TTS voices (Chrome fires 'voiceschanged' asynchronously)
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

    // Pick a female voice — prefer en-IN, then any English, then any female
    const voices = voicesRef.current;
    const femaleVoice =
      voices.find(v => /female|zira|susan|hazel|samantha|victoria|karen|moira|fiona|tessa|veena|heera|ava|allison|sayaka/i.test(v.name) && /en[-_]IN/i.test(v.lang)) ||
      voices.find(v => /female|zira|susan|hazel|samantha|victoria|karen|moira|fiona|tessa|veena|heera|ava|allison|sayaka/i.test(v.name) && /^en/i.test(v.lang)) ||
      voices.find(v => /female|zira|susan|hazel|samantha|victoria|karen|moira|fiona|tessa|veena|heera|ava|allison|sayaka/i.test(v.name)) ||
      voices.find(v => v.name.toLowerCase().includes('female') && /^en/i.test(v.lang)) ||
      null;

    if (femaleVoice) utterance.voice = femaleVoice;
    utterance.pitch = 1.1;   // slightly higher pitch for femininity on voices without a label
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

      {/* ══════════ HEADER ══════════ */}
      <div className="relative shrink-0 z-20 px-6 pt-5 pb-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.07] backdrop-blur-xl">
            {/* Left: Identity */}
            <div className="flex items-center gap-3">
              {/* Animated icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-primary/40 rounded-xl blur-lg animate-pulse" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-[#64CEFB]/20 border border-primary/30 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-3">
                    Financial AI Coach
                    <div className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 backdrop-blur-sm h-fit self-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                      <span className="text-[9px] sm:text-[10px] font-black text-green-400 tracking-wider leading-none">LIVE</span>
                    </div>
                  </h1>
                </div>
                <p className="text-[10px] text-white/30 font-medium mt-0.5">Financial Glow-Up AI · Powered by OpenRouter</p>
              </div>
            </div>

            {/* Right: Mute toggle */}
            <button
              onClick={toggleMute}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all duration-200 ${
                isMuted
                  ? "bg-white/5 border-white/10 text-white/30 hover:border-white/20"
                  : "bg-primary/10 border-primary/25 text-primary hover:bg-primary/15"
              }`}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isMuted ? "Muted" : "Voice On"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ══════════ CHAT AREA ══════════ */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pb-4">
        <div className="max-w-3xl mx-auto space-y-4">

          {/* Quick prompt cards */}
          <AnimatePresence>
            {isFirstMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 pb-1"
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
                      className={`group relative p-4 rounded-2xl bg-gradient-to-br ${p.gradient} transition-all duration-300 text-left overflow-hidden border border-white/10`}
                    >
                      {/* Shine overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                      {/* Top-right glow orb */}
                      <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all" />

                      <div className="relative">
                        <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 shadow-inner">
                          <Icon className="w-4.5 h-4.5 text-white" />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] mb-1.5 text-white/70">{p.label}</p>
                        <p className="text-xs font-bold text-white leading-snug">{p.q}</p>
                        <ArrowRight className="w-3.5 h-3.5 mt-2 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <AnimatePresence mode="popLayout">
            {chatHistory.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end`}
              >
                {/* Avatar */}
                <div className={`shrink-0 mb-1 w-7 h-7 rounded-xl flex items-center justify-center border ${
                  msg.role === 'user'
                    ? 'bg-white/5 border-white/10 text-white/40'
                    : 'bg-gradient-to-br from-primary/25 to-[#64CEFB]/10 border-primary/30 text-primary'
                }`}>
                  {msg.role === 'user'
                    ? <User className="w-3.5 h-3.5" />
                    : <Sparkles className="w-3.5 h-3.5" />}
                </div>

                {/* Bubble */}
                <div className={`group relative max-w-[84%] md:max-w-[72%] ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/[0.09] rounded-2xl rounded-br-sm'
                    : 'bg-gradient-to-br from-primary/[0.07] to-blue-900/[0.05] border border-primary/[0.15] rounded-2xl rounded-bl-sm'
                } px-5 py-4 shadow-xl`}>

                  {/* Inner content */}
                  <div className={`text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'text-white/80 font-medium'
                      : 'text-white/90'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-invert prose-sm max-w-none
                        prose-headings:font-black prose-headings:tracking-tight prose-headings:text-white prose-headings:mb-2 prose-headings:mt-4 first:prose-headings:mt-0
                        prose-h2:text-sm prose-h3:text-xs prose-h3:uppercase prose-h3:tracking-widest prose-h3:text-primary/80
                        prose-strong:text-primary prose-strong:font-bold
                        prose-p:text-white/82 prose-p:leading-relaxed prose-p:mb-2.5 last:prose-p:mb-0
                        prose-li:text-white/78 prose-li:leading-relaxed
                        prose-ul:my-2 prose-ol:my-2 prose-li:mb-1
                        prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs prose-code:font-mono
                        prose-hr:border-white/10 prose-hr:my-3
                        prose-blockquote:border-l-primary prose-blockquote:border-l-2 prose-blockquote:pl-3 prose-blockquote:text-white/50 prose-blockquote:italic
                      ">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.message}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.message}</p>
                    )}
                  </div>

                  {/* Replay footer for AI messages */}
                  {msg.role === 'assistant' && (
                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.06]">
                      <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/15">Pocket Coach</span>
                      <button
                        onClick={() => speak(msg.message, index)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-wide transition-all ${
                          currentlyPlaying === index
                            ? "bg-primary/20 border-primary/40 text-primary"
                            : "bg-white/[0.03] border-white/[0.07] text-white/20 hover:text-white/50 hover:border-white/20"
                        }`}
                      >
                        <Volume2 className="w-3 h-3" />
                        <span className="hidden sm:inline">{currentlyPlaying === index ? "Playing…" : "Replay"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {chatMutation.isPending && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex gap-3 items-end"
              >
                <div className="w-7 h-7 mb-1 rounded-xl bg-gradient-to-br from-primary/25 to-[#64CEFB]/10 border border-primary/30 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                </div>
                <div className="bg-gradient-to-br from-primary/[0.07] to-blue-900/[0.05] border border-primary/[0.15] rounded-2xl rounded-bl-sm px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={scrollRef} className="h-1" />
        </div>
      </div>

      {/* ══════════ INPUT DOCK ══════════ */}
      <div className="relative shrink-0 z-20 px-6 pt-3 pb-5">
        <div className="max-w-3xl mx-auto">
          <div className="relative p-1.5 rounded-2xl bg-gradient-to-r from-white/[0.04] via-white/[0.03] to-white/[0.04] border border-white/[0.08] focus-within:border-primary/40 transition-all duration-300 backdrop-blur-xl shadow-2xl">
            {/* Glow on focus */}
            <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 focus-within:opacity-100 transition-opacity pointer-events-none blur-sm" />

            <div className="relative flex items-center gap-2">
              {/* Mic */}
              {browserSupportsSpeechRecognition && (
                <button
                  onClick={toggleListening}
                  title={listening ? "Stop listening" : "Voice input"}
                  className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    listening
                      ? "bg-red-500/15 text-red-400 ring-1 ring-red-500/30 animate-pulse"
                      : "text-white/25 hover:text-white/60 hover:bg-white/[0.06]"
                  }`}
                >
                  {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}

              {/* Text input */}
              <input
                ref={inputRef}
                value={chatMessage}
                onChange={e => setChatMessage(e.target.value)}
                onKeyDown={handleKey}
                placeholder={listening ? "🎙 Listening..." : "Ask your coach anything..."}
                className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/25 font-medium py-2.5"
              />

              {/* Character hint */}
              {chatMessage.length > 0 && (
                <span className="shrink-0 text-[10px] text-white/20 font-medium hidden sm:block">
                  ↵ Send
                </span>
              )}

              {/* Send button */}
              <Button
                onClick={handleSend}
                disabled={!chatMessage.trim() || chatMutation.isPending}
                size="icon"
                className="shrink-0 w-9 h-9 rounded-xl bg-primary hover:bg-primary/85 disabled:opacity-25 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Bottom tag */}
          <p className="text-center text-[9px] font-black uppercase tracking-[0.4em] text-white/10 mt-2.5 select-none">
            Pocket Fund · Financial Glow-Up Coach
          </p>
        </div>
      </div>
    </div>
  );
}
