import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import { Sparkles, Trophy, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { useWindowSize } from "react-use";
import { motion, AnimatePresence } from "framer-motion";

interface ChallengeCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  challengeName?: string;
  points?: number;
}

export default function ChallengeCelebration({ isOpen, onClose, challengeName = "Challenge", points = 0 }: ChallengeCelebrationProps) {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 6000); 
      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
    }
  }, [isOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {showConfetti && (
              <div className="fixed inset-0 z-[200] pointer-events-none">
                <Confetti 
                  width={width} 
                  height={height} 
                  numberOfPieces={200} 
                  recycle={false} 
                  colors={["#64CEFB", "#4FB7E5", "#FFF", "#2DD4BF"]}
                  gravity={0.15}
                />
              </div>
            )}
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#050505] z-[150] flex flex-col items-center justify-center overflow-hidden"
              onClick={onClose}
            >
              {/* Cinematic Background Elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] opacity-40" />
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative z-10 w-full max-w-4xl px-8 flex flex-col items-center text-center pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Trophy Section */}
                <motion.div
                  initial={{ rotate: -15, scale: 0.5 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", damping: 15 }}
                  className="mb-12 relative"
                >
                  <div className="w-48 h-48 rounded-[56px] bg-gradient-to-tr from-primary to-accent flex items-center justify-center relative overflow-hidden premium-shadow group">
                    <Trophy className="w-24 h-24 text-white relative z-10 drop-shadow-2xl" />
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-2 rounded-[48px] border border-white/20" />
                  </div>
                  {/* Outer Rings */}
                  <motion.div 
                    animate={{ rotate: 360, scale: [1, 1.05, 1] }} 
                    transition={{ rotate: { duration: 15, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity } }}
                    className="absolute inset-0 w-[240px] h-[240px] -top-[24px] -left-[24px] border border-primary/20 rounded-full blur-[2px]" 
                  />
                </motion.div>

                {/* Text Content */}
                <div className="space-y-6 mb-12">
                  <motion.p 
                    initial={{ tracking: "0.8em", opacity: 0 }} 
                    animate={{ tracking: "0.4em", opacity: 1 }} 
                    className="text-[11px] font-black uppercase text-primary italic"
                  >
                    OBJECTIVE // RECONCILED
                  </motion.p>
                  <motion.h2 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ delay: 0.3 }}
                    className="text-7xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.8] text-white"
                  >
                    MISSION <br /><span className="text-primary italic">COMPLETE</span>
                  </motion.h2>
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 0.4 }}
                    className="space-y-2 mt-8"
                  >
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest italic">Intelligence Sector</p>
                    <p className="text-2xl font-bold text-white/90 italic tracking-tight">"{challengeName}"</p>
                  </motion.div>
                </div>

                {/* Stats Grid */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 gap-px bg-white/5 border border-white/10 rounded-[32px] overflow-hidden w-full max-w-xl mb-12"
                >
                  <div className="bg-white/[0.02] p-8 text-center backdrop-blur-xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">XP Allocated</p>
                    <div className="flex items-center justify-center gap-3">
                      <Zap className="w-5 h-5 text-primary fill-primary/20" />
                      <span className="text-4xl font-black italic text-white leading-none">+{points}</span>
                    </div>
                  </div>
                  <div className="bg-white/[0.02] p-8 text-center backdrop-blur-xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2">Status</p>
                    <div className="flex items-center justify-center gap-3 text-emerald-400">
                      <ShieldCheck className="w-5 h-5" />
                      <span className="text-xl font-black uppercase italic leading-none">Secured</span>
                    </div>
                  </div>
                </motion.div>

                {/* Final Action */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ delay: 0.6 }}
                  className="space-y-6"
                >
                  <Button 
                    onClick={onClose} 
                    className="h-24 px-16 rounded-[32px] bg-white text-black hover:bg-white/90 font-black text-2xl uppercase tracking-tighter group transition-all shadow-[0_20px_80px_rgba(255,255,255,0.15)] active:scale-95"
                  >
                    Claim Rewards & Return
                    <ArrowRight className="w-8 h-8 ml-4 group-hover:translate-x-3 transition-transform" />
                  </Button>
                  <div className="flex items-center justify-center gap-3">
                     <ShieldCheck className="w-5 h-5 text-white/10" />
                     <span className="text-white/10 text-[9px] font-black uppercase tracking-[0.4em] italic">Protocol Verification ID: {Math.floor(Math.random() * 100000)}</span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
