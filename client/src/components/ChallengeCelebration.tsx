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
              className="fixed inset-0 bg-[#020202] z-[150] flex flex-col items-center justify-center overflow-hidden grain-texture"
              onClick={onClose}
            >
              {/* Ultra-High Fidelity Mesh Background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] right-[10%] w-[700px] h-[700px] bg-primary/10 rounded-full blur-[140px] animate-blob" />
                <div className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[140px] animate-blob animation-delay-2000" />
                
                {/* Architectural Layout Lines */}
                <div className="absolute inset-0 architectural-grid opacity-20" />
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="relative z-10 w-full max-w-5xl px-8 flex flex-col items-center text-center pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Trophy Section */}
                <motion.div
                  initial={{ rotateY: 90, scale: 0.5 }}
                  animate={{ rotateY: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", damping: 15 }}
                  className="mb-16 relative"
                >
                  <div className="w-56 h-56 rounded-[64px] bg-gradient-to-tr from-primary via-primary to-accent flex items-center justify-center relative overflow-hidden premium-shadow group border border-white/20">
                    <Trophy className="w-28 h-28 text-white relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]" />
                    <div className="absolute inset-0 bg-white/25 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-2 rounded-[56px] border border-white/20" />
                  </div>
                  
                  <motion.div 
                    animate={{ rotate: -360 }} 
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 w-[350px] h-[350px] -top-[47px] -left-[47px] border-[0.5px] border-primary/40 rounded-full border-dashed" 
                  />
                </motion.div>

                {/* Text Content */}
                <div className="space-y-8 mb-16">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md"
                  >
                    <Zap className="w-4 h-4 text-primary fill-primary" />
                    <span className="text-[12px] font-black uppercase tracking-[0.6em] text-primary italic">Intelligence Sector // Reconciled</span>
                    <Zap className="w-4 h-4 text-primary fill-primary" />
                  </motion.div>

                  <motion.h2 
                    initial={{ y: 40, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ delay: 0.3 }}
                    className="text-8xl md:text-[9rem] font-black italic uppercase tracking-tighter leading-[0.75] text-white"
                  >
                    MISSION <br /><span className="text-primary italic">COMPLETE</span>
                  </motion.h2>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ delay: 0.4 }}
                    className="mt-10 p-10 rounded-[48px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl inline-block"
                  >
                    <p className="text-[12px] font-black uppercase tracking-[0.3em] text-white/30 mb-3 italic">Verified Objective</p>
                    <p className="text-4xl font-black text-white italic tracking-tighter">"{challengeName}"</p>
                  </motion.div>
                </div>

                {/* Stats Grid */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 gap-px bg-white/10 border border-white/15 rounded-[48px] overflow-hidden w-full max-w-2xl mb-16 shadow-3xl"
                >
                  <div className="bg-white/[0.04] p-10 text-center backdrop-blur-3xl">
                    <p className="text-[11px] font-black uppercase tracking-widest text-primary mb-3">XP Allocated</p>
                    <div className="flex items-center justify-center gap-4">
                      <Zap className="w-6 h-6 text-primary fill-primary/20" />
                      <span className="text-6xl font-black italic text-white leading-none tabular-nums">+{points}</span>
                    </div>
                  </div>
                  <div className="bg-white/[0.04] p-10 text-center backdrop-blur-3xl">
                    <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400 mb-3">Status</p>
                    <div className="flex items-center justify-center gap-4 text-emerald-400">
                      <ShieldCheck className="w-7 h-7" />
                      <span className="text-3xl font-black uppercase italic leading-none">Secured</span>
                    </div>
                  </div>
                </motion.div>

                {/* Final Action */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ delay: 0.6 }}
                  className="space-y-8"
                >
                  <Button 
                    onClick={onClose} 
                    className="h-28 px-20 rounded-[40px] bg-white text-black hover:bg-white/90 font-black text-3xl uppercase tracking-tighter group transition-all shadow-[0_30px_100px_rgba(255,255,255,0.1)] active:scale-95"
                  >
                    Claim Rewards & Return
                    <ArrowRight className="w-10 h-10 ml-6 group-hover:translate-x-4 transition-transform duration-500" />
                  </Button>
                  
                  <div className="flex items-center justify-center gap-6 opacity-20">
                     <ShieldCheck className="w-6 h-6 text-white" />
                     <span className="text-white text-[11px] font-black uppercase tracking-[0.5em] italic">Protocol Verification ID: {Math.floor(Date.now() / 1000000)} // Sector Zero</span>
                     <ShieldCheck className="w-6 h-6 text-white" />
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
