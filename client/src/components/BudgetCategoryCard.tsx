import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";

interface BudgetCategoryCardProps {
  id: string;
  category: string;
  icon: LucideIcon;
  spent: number;
  budget: number;
  color: string;
}

export default function BudgetCategoryCard({
  id,
  category,
  icon: Icon,
  spent,
  budget,
  color
}: BudgetCategoryCardProps) {
  const percentage = Math.min((spent / budget) * 100, 100);
  const isOverBudget = spent > budget;

  return (
    <Card className="p-4" data-testid={`card-budget-${id}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm mb-1" data-testid={`text-category-${id}`}>{category}</h4>
          <Progress 
            value={percentage} 
            className="h-2 mb-2"
          />
          <div className="flex items-baseline justify-between">
            <div>
              <span className={`font-bold text-lg font-mono ${isOverBudget ? 'text-destructive' : ''}`} data-testid={`text-spent-${id}`}>
                ${spent}
              </span>
              <span className="text-xs text-muted-foreground"> / ${budget}</span>
            </div>
            <span className={`text-xs font-semibold ${isOverBudget ? 'text-destructive' : 'text-muted-foreground'}`} data-testid={`text-percentage-${id}`}>
              {percentage.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
