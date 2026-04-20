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
          <>
            {showConfetti && (
              <div className="fixed inset-0 z-[200] pointer-events-none">
                <Confetti 
                  width={width} 
                  height={height} 
                  numberOfPieces={300} 
                  recycle={false} 
                  colors={["#FFD700", "#F59E0B", "#FFF", "#64CEFB"]}
                  gravity={0.12}
                />
              </div>
            )}
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/85 backdrop-blur-xl z-[150]"
              onClick={onClose}
            />

            {/* Modal Container */}
            <div className="fixed inset-0 flex items-center justify-center z-[160] p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateX: -10 }}
                transition={{ type: "spring", damping: 20, stiffness: 200 }}
                className="w-full max-w-xl bg-[#080808] border border-white/10 rounded-[48px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] pointer-events-auto relative"
              >
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 0)", backgroundSize: "30px 30px" }} />
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-yellow-500/10 blur-[120px] rounded-full" />
                
                {/* Main Content */}
                <div className="relative p-10 sm:p-14 text-center space-y-10">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em] italic mb-4">
                      <Star className="w-3 h-3 fill-current" />
                      Legacy Defined
                    </div>
                    
                    <h2 className="text-5xl sm:text-7xl font-black italic tracking-tighter uppercase leading-[0.8] text-white">
                      Objective<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600">Reached</span>
                    </h2>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="p-8 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-sm relative group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-4 flex items-center justify-center gap-2">
                      <Activity className="w-3 h-3" />
                      Realized Asset
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-black text-white italic">"{goalName}"</h3>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-white/40 text-sm font-medium leading-relaxed max-w-sm mx-auto italic"
                  >
                    This milestone marks a permanent shift in your financial power. Your execution has been logged in the permanent record.
                  </motion.p>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="pt-6"
                  >
                    <Button 
                      onClick={onClose} 
                      className="w-full h-20 rounded-3xl bg-yellow-500 text-black hover:bg-yellow-400 font-black text-lg uppercase tracking-tighter italic group transition-all shadow-[0_20px_40px_rgba(245,158,11,0.2)]"
                    >
                      Continue Ascending
                      <TrendingUp className="w-5 h-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                  </motion.div>
                </div>

                {/* Technical Sidebar/Details */}
                <div className="px-10 py-6 bg-yellow-500/[0.02] border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-4 overflow-hidden">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="h-10 w-[1px] bg-white/5" />
                    ))}
                    <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.5em] whitespace-nowrap">Institutional Integrity: Verified // Level 04</span>
                  </div>
                  <Trophy className="w-5 h-5 text-yellow-500/20" />
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
