import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import { Trophy, Star, ArrowRight, Activity, TrendingUp } from "lucide-react";
import { useWindowSize } from "react-use";
import { motion, AnimatePresence } from "framer-motion";

interface GoalCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  goalName?: string;
}

export default function GoalCelebration({ isOpen, onClose, goalName = "Goal" }: GoalCelebrationProps) {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 7000); // Slightly longer for goals
      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
    }
  }, [isOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            key="goal-done" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Cinematic Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-yellow-500/10 rounded-full blur-[180px] opacity-40" />
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
              <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px]" />
            </div>

            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none z-[210]">
                <Confetti 
                  width={width} 
                  height={height} 
                  numberOfPieces={400} 
                  recycle={false} 
                  colors={["#FFD700", "#F59E0B", "#FFF", "#64CEFB"]}
                  gravity={0.08}
                />
              </div>
            )}

            <div className="relative z-10 w-full max-w-5xl px-8 flex flex-col items-center text-center">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0, rotate: -15 }} 
                animate={{ scale: 1, opacity: 1, rotate: 0 }} 
                transition={{ type: "spring", damping: 15, stiffness: 100, delay: 0.2 }}
                className="relative mb-12"
              >
                <div className="w-56 h-56 rounded-[64px] bg-gradient-to-tr from-yellow-500 via-orange-400 to-yellow-600 flex items-center justify-center relative overflow-hidden group premium-shadow">
                  <Trophy className="w-28 h-28 text-black relative z-10 drop-shadow-2xl" />
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-2 rounded-[56px] border border-white/20" />
                </div>
                
                {/* Outer Glowing Rings */}
                <motion.div 
                  animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
                  transition={{ rotate: { duration: 25, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity } }}
                  className="absolute inset-0 w-[320px] h-[320px] -top-[52px] -left-[52px] border border-yellow-500/20 rounded-full blur-sm" 
                />
              </motion.div>

              <div className="space-y-6">
                <motion.p 
                  initial={{ tracking: "1em", opacity: 0 }} 
                  animate={{ tracking: "0.5em", opacity: 1 }} 
                  transition={{ duration: 1, delay: 0.4 }}
                  className="text-[11px] font-black uppercase text-yellow-500 italic"
                >
                  LEGACY // DEFINED
                </motion.p>
                
                <motion.h2 
                  initial={{ y: 40, opacity: 0 }} 
                  animate={{ y: 0, opacity: 1 }} 
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] text-white"
                >
                  OBJECTIVE <br /><span className="text-yellow-500 italic">REACHED</span>
                </motion.h2>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ delay: 0.7 }}
                  className="mt-8 mb-12 p-8 rounded-[40px] bg-white/[0.03] border border-white/10 backdrop-blur-2xl inline-block"
                >
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2 italic">Realized Asset</p>
                   <h3 className="text-3xl font-black text-white italic tracking-tighter">"{goalName}"</h3>
                </motion.div>

                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 0.8 }}
                  className="text-white/40 text-xl font-medium max-w-2xl mx-auto italic leading-relaxed"
                >
                  This milestone marks a permanent shift in your financial power. 
                  Your execution has been logged in the permanent record.
                </motion.p>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.9 }}
                className="mt-16"
              >
                <Button 
                  onClick={onClose} 
                  className="h-24 px-16 rounded-[32px] bg-yellow-500 text-black font-black text-2xl uppercase tracking-tighter hover:bg-yellow-400 active:scale-95 transition-all shadow-[0_20px_80px_rgba(245,158,11,0.25)] group"
                >
                  Continue Ascending
                  <TrendingUp className="w-8 h-8 ml-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
                
                <div className="flex items-center justify-center gap-3 mt-8">
                   <ShieldCheck className="w-5 h-5 text-white/10" />
                   <span className="text-white/10 text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">Institutional Integrity Verified // Level 04</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
