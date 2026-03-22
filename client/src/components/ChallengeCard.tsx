import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coffee, Shield, Target, Zap, ShoppingBag, Car, Star, ChevronRight, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface ChallengeCardProps {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  progress: number;
  timeRemaining?: string;
  isActive?: boolean;
  isCompleted?: boolean;
  onAction?: () => void;
  icon?: string;
}

export default function ChallengeCard({
  id,
  title,
  difficulty,
  points,
  progress,
  isActive = false,
  isCompleted = false,
  onAction,
  icon
}: ChallengeCardProps) {
  const getIcon = () => {
    const iconClass = "w-5 h-5";
    switch (icon) {
      case 'coffee': return <Coffee className={iconClass} />;
      case 'shield': return <Shield className={iconClass} />;
      case 'target': return <Target className={iconClass} />;
      case 'zap': return <Zap className={iconClass} />;
      case 'shopping-bag': return <ShoppingBag className={iconClass} />;
      case 'car': return <Car className={iconClass} />;
      default: return <Activity className={iconClass} />;
    }
  };

  const getDifficultyStyles = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'bg-emerald-400/10 text-emerald-400 border-emerald-500/20';
      case 'Medium': return 'bg-blue-400/10 text-blue-400 border-blue-500/20';
      case 'Hard': return 'bg-rose-400/10 text-rose-400 border-rose-500/20';
      default: return 'bg-white/5 text-white/40 border-white/10';
    }
  };

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <Card className={`group relative overflow-hidden glass-card p-7 h-full border border-white/5 transition-all duration-500 ${isCompleted ? 'opacity-80 scale-[0.98]' : ''}`} data-testid={`card-challenge-${id}`}>
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center border transition-all duration-500 ${isCompleted ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-white/[0.03] border-white/10 text-white/60 group-hover:scale-110 group-hover:border-white/20'}`}>
              {getIcon()}
            </div>
            <div className={`px-3 py-1.5 rounded-full border text-[9px] font-black tracking-widest uppercase ${getDifficultyStyles(difficulty)}`}>
              {difficulty}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-black text-white leading-tight mb-2 tracking-tight group-hover:text-blue-400 transition-colors">{title}</h3>
            <div className="flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{points} Potential XP</span>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex justify-between items-end">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Operational Progress</span>
              <span className="text-xs font-black tabular-nums text-white">{progress}%</span>
            </div>
            <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden border border-white/[0.02]">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${progress}%` }}
                 transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                 className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-blue-600'}`}
                 style={{ boxShadow: isCompleted ? '0 0 15px rgba(16,185,129,0.3)' : '0 0 20px rgba(37,99,235,0.3)' }}
               />
            </div>
          </div>

          <Button
            onClick={isCompleted ? undefined : onAction}
            className={`w-full mt-auto h-14 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase transition-all duration-500 border-none ${
              isCompleted 
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
              : "bg-white text-black hover:bg-white/90 hover:scale-[1.02] active:scale-95 shadow-xl shadow-black/20"
            }`}
            disabled={isCompleted}
          >
            {isCompleted ? (
              <span className="tracking-[0.3em]">Completed</span>
            ) : (
              <div className="flex items-center gap-2">
                <span>{isActive ? 'Resume Ops' : 'Initiate'}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

