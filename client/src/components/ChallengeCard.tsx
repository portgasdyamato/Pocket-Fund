import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coffee, Shield, Target, Zap, ShoppingBag, Car, Star, ChevronRight } from "lucide-react";
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
  timeRemaining,
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
      default: return <Star className={iconClass} />;
    }
  };

  const getDifficultyStyles = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Medium': return 'bg-primary/10 text-primary border-primary/20';
      case 'Hard': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-white/5';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Card className={`group relative overflow-hidden glass-morphism border-white/5 p-6 h-full transition-all duration-300 ${isCompleted ? 'opacity-80' : ''}`} data-testid={`card-challenge-${id}`}>
        {/* Glow Effect on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10 flex flex-col h-full gap-5">
          <div className="flex items-start justify-between">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 ${isCompleted ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-primary/10 border-primary/20 text-primary group-hover:scale-110'}`}>
              {getIcon()}
            </div>
            <Badge variant="outline" className={`rounded-full px-3 py-1 font-bold tracking-tight text-[10px] uppercase border ${getDifficultyStyles(difficulty)}`}>
              {difficulty}
            </Badge>
          </div>

          <div>
            <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-primary transition-colors">{title}</h3>
            <div className="flex items-center gap-1.5 text-white/40 text-xs font-bold uppercase tracking-widest">
              <Star className="w-3 h-3 fill-accent text-accent" />
              <span>{points} Potential XP</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Mission Progress</span>
              <span className="text-sm font-black text-white">{progress}%</span>
            </div>
            <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${progress}%` }}
                 transition={{ duration: 1, ease: "easeOut" }}
                 className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]'}`}
               />
            </div>
          </div>

          <div className="mt-auto">
            <Button
              onClick={!!isCompleted ? undefined : onAction}
              className={`w-full rounded-xl h-12 font-bold transition-all duration-300 ${
                isCompleted 
                ? "bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/15" 
                : isActive 
                ? "bg-primary text-white premium-shadow hover:scale-[1.03]" 
                : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
              }`}
              disabled={!!isCompleted}
            >
              {isCompleted ? (
                <span className="flex items-center gap-2">Mission Accomplished</span>
              ) : (
                <span className="flex items-center gap-2">
                  {isActive ? 'Resume Mission' : 'Commence Attack'}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
