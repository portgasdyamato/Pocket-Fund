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
            className="fixed inset-0 z-[200] bg-[#020202] flex flex-col items-center justify-center overflow-hidden grain-texture"
          >
            {/* Ultra-High Fidelity Mesh Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[20%] left-[10%] w-[800px] h-[800px] bg-yellow-500/10 rounded-full blur-[140px] animate-blob" />
              <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[140px] animate-blob animation-delay-2000" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-yellow-600/5 rounded-full blur-[200px]" />
              
              {/* Architectural Layout Lines */}
              <div className="absolute inset-0 architectural-grid opacity-20" />
            </div>

            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none z-[210]">
                <Confetti 
                  width={width} 
                  height={height} 
                  numberOfPieces={450} 
                  recycle={false} 
                  colors={["#FFD700", "#F59E0B", "#FFF", "#64CEFB", "#FFA500"]}
                  gravity={0.07}
                />
              </div>
            )}

            <div className="relative z-10 w-full max-w-6xl px-12 flex flex-col items-center text-center">
              <motion.div 
                initial={{ scale: 0.4, opacity: 0, rotateY: 90 }} 
                animate={{ scale: 1, opacity: 1, rotateY: 0 }} 
                transition={{ type: "spring", damping: 18, stiffness: 80, delay: 0.2 }}
                className="relative mb-16"
              >
                <div className="w-64 h-64 rounded-[80px] bg-gradient-to-tr from-yellow-500 via-orange-400 to-yellow-200 flex items-center justify-center relative overflow-hidden premium-shadow group border border-white/20">
                  <Trophy className="w-32 h-32 text-black relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]" />
                  <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-3 rounded-[68px] border border-black/10" />
                </div>
                
                <motion.div 
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 w-[400px] h-[400px] -top-[68px] -left-[68px] border-[0.5px] border-yellow-500/30 rounded-full border-dashed" 
                />
              </motion.div>

              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-yellow-500/20 bg-yellow-500/5 backdrop-blur-md"
                >
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-[12px] font-black uppercase tracking-[0.6em] text-yellow-500 italic">Protocol // Legacy Defined</span>
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                </motion.div>
                
                <motion.h2 
                  initial={{ y: 60, opacity: 0, scale: 0.9 }} 
                  animate={{ y: 0, opacity: 1, scale: 1 }} 
                  transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-8xl md:text-[11rem] font-black italic uppercase tracking-tighter leading-[0.75] text-white pointer-events-none"
                >
                  ASSET <br /><span className="text-yellow-500 italic">SECURED</span>
                </motion.h2>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ delay: 0.7 }}
                  className="mt-10 mb-14 p-10 rounded-[48px] bg-stone-900/60 border border-white/10 backdrop-blur-3xl inline-block relative overflow-hidden group shadow-3xl"
                >
                   <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   <p className="text-[12px] font-black uppercase tracking-[0.3em] text-white/30 mb-3 italic">Verified Objective</p>
                   <h3 className="text-4xl font-black text-white italic tracking-tighter">"{goalName}"</h3>
                </motion.div>

                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 0.8 }}
                  className="text-white/40 text-2xl font-medium max-w-3xl mx-auto italic leading-tight text-balance"
                >
                  This milestone represents a profound elevation in your capital hierarchy. 
                  Transaction integrity has been finalized in the decentralized ledger.
                </motion.p>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.9 }}
                className="mt-20"
              >
                <Button 
                  onClick={onClose} 
                  className="h-28 px-20 rounded-[40px] bg-yellow-500 text-black font-black text-3xl uppercase tracking-tighter hover:bg-yellow-400 active:scale-95 transition-all shadow-[0_30px_100px_rgba(245,158,11,0.3)] group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Initiate Next Ascent
                    <Activity className="w-10 h-10 ml-6 group-hover:scale-125 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Button>
                
                <div className="flex items-center justify-center gap-6 mt-12 opacity-20">
                   <ShieldCheck className="w-6 h-6 text-white" />
                   <span className="text-white text-[11px] font-black uppercase tracking-[0.5em] italic leading-none whitespace-nowrap">Institutional Clearance Alpha-09 // Verified Integrity</span>
                   <ShieldCheck className="w-6 h-6 text-white" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
