import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ChallengeCardProps {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  progress: number;
  timeRemaining?: string;
  isActive?: boolean;
  onAction?: () => void;
}

export default function ChallengeCard({
  id,
  title,
  difficulty,
  points,
  progress,
  timeRemaining,
  isActive = false,
  onAction
}: ChallengeCardProps) {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'bg-secondary text-secondary-foreground';
      case 'Medium': return 'bg-accent text-accent-foreground';
      case 'Hard': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="p-4" data-testid={`card-challenge-${id}`}>
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-base flex-1">{title}</h3>
          <Badge className={getDifficultyColor(difficulty)} data-testid={`badge-difficulty-${id}`}>
            {difficulty}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Progress value={progress} className="h-2" />
          </div>
          <span className="text-sm font-bold text-primary" data-testid={`text-progress-${id}`}>
            {progress}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold text-primary" data-testid={`text-points-${id}`}>
              {points}
            </span>
            <span className="text-xs text-muted-foreground font-semibold uppercase">pts</span>
          </div>
          
          {timeRemaining && (
            <span className="text-xs text-muted-foreground" data-testid={`text-time-${id}`}>
              {timeRemaining}
            </span>
          )}
        </div>

        <Button
          variant={isActive ? "default" : "outline"}
          size="sm"
          onClick={onAction}
          className="w-full"
          data-testid={`button-challenge-action-${id}`}
        >
          {isActive ? 'Continue' : 'Start Challenge'}
        </Button>
      </div>
    </Card>
  );
}
