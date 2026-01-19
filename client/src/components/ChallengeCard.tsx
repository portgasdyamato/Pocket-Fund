import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coffee, Shield, Target, Zap, ShoppingBag, Car, Star } from "lucide-react";

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
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'bg-secondary text-secondary-foreground';
      case 'Medium': return 'bg-accent text-accent-foreground';
      case 'Hard': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className={`p-4 backdrop-blur-xl bg-card/40 border-primary/20 hover:border-primary/40 transition-all hover:shadow-[0_0_25px_rgba(139,92,246,0.2)] ${isCompleted ? 'grayscale-[0.5] opacity-90' : ''}`} data-testid={`card-challenge-${id}`}>
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
             <div className={`p-2 rounded-lg ${isCompleted ? 'bg-muted' : 'bg-primary/10 text-primary'}`}>
                {getIcon()}
             </div>
             <h3 className="font-bold text-base leading-tight">{title}</h3>
          </div>
          <Badge className={getDifficultyColor(difficulty)} data-testid={`badge-difficulty-${id}`}>
            {difficulty}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Progress 
              value={progress} 
              className="h-2 bg-muted/30" 
              indicatorClassName={isCompleted ? "bg-green-500" : (isActive ? "bg-primary" : "bg-muted-foreground/30")}
            />
          </div>
          <span className={`text-sm font-bold ${isCompleted ? "text-green-500" : (isActive ? "text-primary" : "text-muted-foreground")}`} data-testid={`text-progress-${id}`}>
            {progress}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className={`text-2xl font-bold ${isCompleted ? "text-green-500" : (isActive ? "text-primary" : "text-muted-foreground/60")}`} data-testid={`text-points-${id}`}>
              {points}
            </span>
            <span className="text-xs text-muted-foreground font-semibold uppercase">pts</span>
          </div>
          
          {isActive && !isCompleted && timeRemaining && (
            <span className="text-xs text-primary font-medium animate-pulse" data-testid={`text-time-${id}`}>
              {timeRemaining}
            </span>
          )}

          {isCompleted && (
            <span className="text-xs text-green-500 font-bold flex items-center gap-1">
              Done!
            </span>
          )}
        </div>

        <Button
          variant={!!isCompleted ? "secondary" : (isActive ? "default" : "outline")}
          size="sm"
          onClick={!!isCompleted ? undefined : onAction}
          className={`w-full ${!!isCompleted ? "bg-green-500/20 text-green-500 border-green-500/50 hover:bg-green-500/20" : ""}`}
          disabled={!!isCompleted}
          data-testid={`button-challenge-action-${id}`}
        >
          {!!isCompleted ? 'Completed ✅' : (isActive ? 'Continue' : 'Start Challenge')}
        </Button>
      </div>
    </Card>
  );
}
