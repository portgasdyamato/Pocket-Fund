import { Badge } from "@/components/ui/badge";
import { Coffee, Car, ShoppingBag, Ticket, FileText, Tag } from "lucide-react";

interface ExpenseItemProps {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
}

export default function ExpenseItem({ id, category, description, amount, date }: ExpenseItemProps) {
  const getCategoryIcon = (cat: string) => {
    const iconClass = "w-5 h-5";
    switch (cat.toLowerCase()) {
      case 'food': return <Coffee className={iconClass} />;
      case 'transport': return <Car className={iconClass} />;
      case 'shopping': return <ShoppingBag className={iconClass} />;
      case 'entertainment': return <Ticket className={iconClass} />;
      case 'bills': return <FileText className={iconClass} />;
      default: return <Tag className={iconClass} />;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'food': return 'bg-chart-1/10 text-chart-1';
      case 'transport': return 'bg-chart-2/10 text-chart-2';
      case 'shopping': return 'bg-chart-3/10 text-chart-3';
      case 'entertainment': return 'bg-chart-4/10 text-chart-4';
      case 'bills': return 'bg-chart-5/10 text-chart-5';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 hover-elevate rounded-md" data-testid={`item-expense-${id}`}>
      <div className={`p-2 rounded-full ${getCategoryColor(category)}`}>
        {getCategoryIcon(category)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate" data-testid={`text-description-${id}`}>{description}</p>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs" data-testid={`badge-category-${id}`}>
            {category}
          </Badge>
          <span className="text-xs text-muted-foreground" data-testid={`text-date-${id}`}>{date}</span>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-base font-mono" data-testid={`text-amount-${id}`}>
          -${amount.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
