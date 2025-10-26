import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";

interface StreakCounterProps {
  days: number;
}

export default function StreakCounter({ days }: StreakCounterProps) {
  return (
    <Badge 
      variant="secondary" 
      className="gap-1 px-3 py-1.5 bg-primary/10 text-primary border-primary/20"
      data-testid="badge-streak"
    >
      <Flame className="w-4 h-4 fill-current" />
      <span className="font-bold text-sm" data-testid="text-streak-days">{days} day streak</span>
    </Badge>
  );
}
