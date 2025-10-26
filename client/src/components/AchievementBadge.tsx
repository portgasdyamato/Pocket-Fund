import { Badge } from "@/components/ui/badge";
import { Trophy, Zap, Target, Award } from "lucide-react";

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
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10" data-testid={`badge-achievement-${id}`}>
      <div className="p-2 rounded-full bg-primary/10 text-primary">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm" data-testid={`text-achievement-title-${id}`}>{title}</h4>
        <p className="text-xs text-muted-foreground" data-testid={`text-achievement-desc-${id}`}>{description}</p>
      </div>
      <Badge variant="secondary" className="font-bold" data-testid={`text-achievement-points-${id}`}>
        +{points}
      </Badge>
    </div>
  );
}
