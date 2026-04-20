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
      className="flex items-center gap-4 p-5 rounded-[24px] bg-white/[0.03] border border-white/5 hover:border-primary/30 transition-all group" 
      data-testid={`badge-achievement-${id}`}
    >
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-300">
          <div className="transition-transform group-hover:scale-110">
            {getIcon()}
          </div>
        </div>
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-lg bg-primary flex items-center justify-center border-2 border-[#050505]">
          <Star className="w-3 h-3 text-white fill-white" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-0.5">Credential Unlocked</p>
        <h4 className="font-black text-base text-white tracking-tight leading-none italic group-hover:text-primary transition-colors" data-testid={`text-achievement-title-${id}`}>{title}</h4>
        <p className="text-[10px] font-medium text-white/40 truncate italic mt-1" data-testid={`text-achievement-desc-${id}`}>{description}</p>
      </div>
      
      <div className="flex flex-col items-end gap-1">
        <div className="px-2 py-0.5 rounded-md bg-yellow-500/10 border border-yellow-500/20">
          <span className="text-xs font-black text-yellow-500 tabular-nums" data-testid={`text-achievement-points-${id}`}>
            +{points}
          </span>
        </div>
        <span className="text-[8px] font-black uppercase tracking-widest text-white/20 italic">XP Assets</span>
      </div>
    </motion.div>
  );
}
