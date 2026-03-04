import { useState, useEffect, useRef } from "react";
import "regenerator-runtime/runtime";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useMutation } from "@tanstack/react-query";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from "@/components/ui/button";
import {
  Send, Sparkles, User, Mic, MicOff, Volume2, VolumeX,
  TrendingUp, Zap, ShieldCheck, Brain, ArrowUpRight
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  role: 'user' | 'assistant';
  message: string;
}

const QUICK_PROMPTS = [
  { q: "How do I start investing?", label: "Investing", icon: <TrendingUp className="w-4 h-4" />, color: "text-green-400", glow: "group-hover:shadow-green-500/20" },
  { q: "Explain the 50/30/20 rule", label: "Budgeting", icon: <Zap className="w-4 h-4" />, color: "text-blue-400", glow: "group-hover:shadow-blue-500/20" },
  { q: "How to build an emergency fund?", label: "Safety Net", icon: <ShieldCheck className="w-4 h-4" />, color: "text-purple-400", glow: "group-hover:shadow-purple-500/20" },
  { q: "Help me fight my Spending Icks", label: "Habits", icon: <Brain className="w-4 h-4" />, color: "text-rose-400", glow: "group-hover:shadow-rose-500/20" },
];

export default function AskCoach() {
  const { toast } = useToast();
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      message: "Hey! I'm your **Financial Glow-Up Coach** 🚀\n\nI'm here to help you level up your money game — ask me anything from building your first investment portfolio to fighting Spending Icks. What money move are we making today?"
    }
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    if (transcript) setChatMessage(transcript);
  }, [transcript]);

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

  const speak = (text: string, messageIndex?: number) => {
    if (isMuted || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onstart = () => { if (messageIndex !== undefined) setCurrentlyPlaying(messageIndex); };
    utterance.onend = () => setCurrentlyPlaying(null);
    utterance.onerror = () => setCurrentlyPlaying(null);
    window.speechSynthesis.speak(utterance);
  };

  const toggleMute = () => {
    window.speechSynthesis.cancel();
    setIsMuted(!isMuted);
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
      setTimeout(() => speak(data.response, newIndex), 100);
    },
    onError: (error: any) => {
      toast({ title: "Coach Offline", description: error.message || "Failed to reach your Coach.", variant: "destructive" });
    },
  });

  const handleSend = () => {
    if (!chatMessage.trim() || chatMutation.isPending) return;
    setChatHistory((prev) => [...prev, { role: 'user', message: chatMessage }]);
    chatMutation.mutate(chatMessage);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const isFirstMessage = chatHistory.length === 1;

  return (
    <div className="flex flex-col h-[calc(100vh-72px)] lg:h-[calc(100vh-80px)] bg-[#050505] text-white overflow-hidden relative">

      {/* Ambient background glows — matches rest of app */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-[20%] w-[40%] h-[35%] bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-[10%] w-[30%] h-[30%] bg-purple-600/6 rounded-full blur-[100px]" />
      </div>

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div className="shrink-0 relative z-10 border-b border-white/[0.05] bg-[#050505]/80 backdrop-blur-xl px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/25">Financial Glow-Up</p>
              <h1 className="text-sm font-black tracking-tight leading-none">Pocket Coach</h1>
            </div>
            <div className="flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[9px] font-black text-green-400 uppercase tracking-widest">Online</span>
            </div>
          </div>
          <button
            onClick={toggleMute}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-200 ${
              isMuted
                ? "bg-white/5 border-white/10 text-white/30"
                : "bg-primary/10 border-primary/20 text-primary"
            }`}
          >
            {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            <span className="hidden sm:inline">{isMuted ? "Muted" : "Voice"}</span>
          </button>
        </div>
      </div>

      {/* ── CHAT FEED ──────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
        <div className="max-w-3xl mx-auto space-y-5">

          {/* Quick prompts — only on first load */}
          <AnimatePresence>
            {isFirstMessage && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-2"
              >
                {QUICK_PROMPTS.map((p, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    onClick={() => { setChatMessage(p.q); inputRef.current?.focus(); }}
                    className={`group glass-morphism border border-white/5 hover:border-white/15 p-4 rounded-2xl text-left transition-all duration-300 hover:shadow-xl ${p.glow}`}
                  >
                    <div className={`${p.color} mb-2`}>{p.icon}</div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">{p.label}</p>
                    <p className="text-xs font-semibold text-white/70 leading-snug">{p.q}</p>
                    <ArrowUpRight className="w-3 h-3 text-white/20 group-hover:text-white/50 mt-2 transition-colors" />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <AnimatePresence mode="popLayout">
            {chatHistory.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start`}
              >
                {/* Avatar */}
                <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border ${
                  msg.role === 'user'
                    ? 'bg-white/5 border-white/10 text-white/50'
                    : 'bg-primary/10 border-primary/25 text-primary'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div className={`relative max-w-[86%] md:max-w-[75%] ${
                  msg.role === 'user'
                    ? 'bg-white/[0.05] border border-white/[0.08] rounded-2xl rounded-tr-sm'
                    : 'glass-morphism border border-white/[0.07] rounded-2xl rounded-tl-sm'
                } px-5 py-4`}>

                  <div className={`text-sm leading-relaxed ${
                    msg.role === 'user' ? 'text-white/85 font-medium italic' : 'text-white/90'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-invert prose-sm max-w-none
                        prose-headings:font-black prose-headings:tracking-tight prose-headings:text-white
                        prose-h2:text-base prose-h3:text-sm
                        prose-strong:text-primary prose-strong:font-bold
                        prose-p:text-white/85 prose-p:leading-relaxed prose-p:mb-3 last:prose-p:mb-0
                        prose-li:text-white/80 prose-li:mb-1
                        prose-ul:my-2 prose-ol:my-2
                        prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:rounded prose-code:text-xs
                        prose-blockquote:border-primary/40 prose-blockquote:text-white/60
                      ">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.message}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.message}</p>
                    )}
                  </div>

                  {/* Footer with replay */}
                  {msg.role === 'assistant' && (
                    <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/15">Coach</span>
                      <button
                        onClick={() => speak(msg.message, index)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all text-[9px] font-black uppercase tracking-widest ${
                          currentlyPlaying === index
                            ? "bg-primary/15 border-primary/30 text-primary"
                            : "bg-white/[0.03] border-white/[0.06] text-white/25 hover:text-white/50 hover:border-white/15"
                        }`}
                      >
                        <Volume2 className="w-3 h-3" />
                        <span className="hidden sm:inline">{currentlyPlaying === index ? "Playing" : "Replay"}</span>
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3 items-center"
              >
                <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                </div>
                <div className="glass-morphism border border-white/[0.07] rounded-2xl rounded-tl-sm px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={scrollRef} />
        </div>
      </div>

      {/* ── INPUT DOCK ─────────────────────────────────────── */}
      <div className="shrink-0 relative z-10 border-t border-white/[0.05] bg-[#050505]/90 backdrop-blur-xl px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] focus-within:border-primary/40 focus-within:bg-white/[0.05] rounded-2xl px-3 py-2 transition-all duration-300">
            {/* Mic button */}
            {browserSupportsSpeechRecognition && (
              <button
                onClick={toggleListening}
                className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  listening ? "bg-red-500/15 text-red-400 animate-pulse" : "text-white/25 hover:text-white/60 hover:bg-white/5"
                }`}
              >
                {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}

            {/* Input */}
            <input
              ref={inputRef}
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={handleKey}
              placeholder={listening ? "Listening..." : "Ask your coach anything..."}
              className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/20 font-medium py-1"
            />

            {/* Send button */}
            <Button
              onClick={handleSend}
              disabled={!chatMessage.trim() || chatMutation.isPending}
              size="icon"
              className="shrink-0 w-9 h-9 rounded-xl bg-primary hover:bg-primary/80 disabled:opacity-30 transition-all shadow-lg shadow-primary/20"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
          <p className="text-center text-[9px] font-black uppercase tracking-[0.4em] text-white/10 mt-2.5">
            Pocket Fund • Financial Glow-Up Coach
          </p>
        </div>
      </div>
    </div>
  );
}
