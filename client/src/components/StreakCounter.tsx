import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";

interface StreakCounterProps {
  days: number;
}

export default function StreakCounter({ days }: StreakCounterProps) {
  return (
    <Badge 
      variant="secondary" 
      className="gap-1 px-3 py-1.5 bg-primary/20 text-primary border-primary/40 backdrop-blur-sm shadow-[0_0_15px_rgba(139,92,246,0.3)]"
      data-testid="badge-streak"
    >
      <Flame className="w-4 h-4 fill-current drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
      <span className="font-bold text-sm" data-testid="text-streak-days">{days} day streak</span>
    </Badge>
  );
}
