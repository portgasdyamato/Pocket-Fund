import { Trophy, Zap, Target, Award, Star } from "lucide-react";
import { motion } from "framer-motion";

interface AchievementBadgeProps {
  id: string;
  type: 'trophy' | 'zap' | 'target' | 'award';
  title: string;
  description: string;
  points: number;
}

export default function AchievementBadge({ id, type, title, description, points }: AchievementBadgeProps) {
  const getIcon = () => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'trophy': return <Trophy className={iconClass} />;
      case 'zap': return <Zap className={iconClass} />;
      case 'target': return <Target className={iconClass} />;
      case 'award': return <Award className={iconClass} />;
      default: return <Trophy className={iconClass} />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 5 }}
      className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-accent/30 transition-all group" 
      data-testid={`badge-achievement-${id}`}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30 group-hover:scale-110 transition-transform">
          <div className="text-accent">
            {getIcon()}
          </div>
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center border border-[#050505]">
          <Star className="w-2.5 h-2.5 text-white fill-white" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm text-white group-hover:text-accent transition-colors" data-testid={`text-achievement-title-${id}`}>{title}</h4>
        <p className="text-xs text-white/40 truncate" data-testid={`text-achievement-desc-${id}`}>{description}</p>
      </div>
      
      <div className="flex flex-col items-end">
        <span className="text-sm font-black text-accent" data-testid={`text-achievement-points-${id}`}>
          +{points}
        </span>
        <span className="text-[8px] font-black uppercase tracking-widest text-white/20">XP Points</span>
      </div>
    </motion.div>
  );
}
