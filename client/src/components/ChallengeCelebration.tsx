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
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150]"
              onClick={onClose}
            />

            {/* Modal Container */}
            <div className="fixed inset-0 flex items-center justify-center z-[160] p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl pointer-events-auto relative"
              >
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 blur-[100px] -ml-32 -mb-32" />
                
                {/* Header Section */}
                <div className="relative pt-12 pb-8 px-8 text-center border-b border-white/5 bg-gradient-to-b from-primary/10 to-transparent">
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="mx-auto w-24 h-24 rounded-3xl bg-primary flex items-center justify-center mb-6 premium-shadow relative"
                  >
                    <Trophy className="w-12 h-12 text-white" />
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 rounded-3xl border-2 border-white/30"
                    />
                  </motion.div>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-2 italic"
                  >
                    Mission // Verified
                  </motion.p>
                  
                  <motion.h2 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-4xl sm:text-5xl font-black italic tracking-tighter uppercase leading-[0.85] text-white"
                  >
                    Target <br /> <span className="text-primary">Eliminated</span>
                  </motion.h2>
                </div>

                {/* Content Section */}
                <div className="p-8 space-y-8">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Intelligence Identified</p>
                    <h3 className="text-xl font-bold text-white/90">"{challengeName}"</h3>
                    <p className="text-sm text-white/40 leading-relaxed">
                      Strategic objectives met with 100% accuracy. Your financial architecture has been strengthened through consistent execution.
                    </p>
                  </div>

                  {/* Rewards Widget */}
                  <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="bg-white/[0.02] p-6">
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">XP Yield</p>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary fill-primary/20" />
                        <span className="text-2xl font-black italic text-white">+{points}</span>
                      </div>
                    </div>
                    <div className="bg-white/[0.02] p-6">
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Status</p>
                      <div className="flex items-center gap-2 text-emerald-400">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-xs font-black uppercase italic">Secured</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      onClick={onClose} 
                      className="w-full h-16 rounded-2xl bg-white text-black hover:bg-white/90 font-black text-sm uppercase tracking-widest group transition-all"
                    >
                      Collect Rewards
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>

                {/* Footer Technical Detail */}
                <div className="px-8 py-4 bg-white/[0.02] border-t border-white/5 flex justify-between items-center">
                  <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest">Protocol ID: XP-{Math.floor(Math.random() * 10000)}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-1 h-1 rounded-full bg-primary/20" />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
