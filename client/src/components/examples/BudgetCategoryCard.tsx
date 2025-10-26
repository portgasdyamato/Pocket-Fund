import BudgetCategoryCard from '../BudgetCategoryCard';
import { Coffee } from 'lucide-react';

export default function BudgetCategoryCardExample() {
  return (
    <BudgetCategoryCard
      id="1"
      category="Food & Dining"
      icon={Coffee}
      spent={280}
      budget={400}
      color="bg-chart-1/10 text-chart-1"
    />
  );
}
