import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideIcon, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

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
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Card className="h-full p-6 backdrop-blur-3xl bg-white/[0.03] border-white/5 hover:border-primary/20 transition-all duration-500 overflow-hidden relative group" data-testid={`card-budget-${id}`}>
        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight className="w-4 h-4 text-primary" />
        </div>
        
        <div className="flex flex-col h-full gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5 bg-white/5 transition-all group-hover:bg-primary/10 group-hover:text-primary ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-black text-sm uppercase tracking-widest text-white/50 mb-0.5" data-testid={`text-category-${id}`}>
                {category}
              </h4>
              <p className="text-xl font-black tracking-tight">
                ${spent.toLocaleString()} <span className="text-white/20 text-xs font-bold">/ ${budget.toLocaleString()}</span>
              </p>
            </div>
          </div>

          <div className="space-y-3">
             <div className="flex justify-between items-end">
                <span className={`text-[10px] font-black uppercase tracking-widest ${isOverBudget ? 'text-destructive' : 'text-primary'}`}>
                  {isOverBudget ? 'Critical Breach' : 'Target Buffer'}
                </span>
                <span className="text-sm font-black font-mono">
                  {percentage.toFixed(0)}%
                </span>
             </div>
             <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full relative ${isOverBudget ? 'bg-destructive' : 'bg-primary'} shadow-[0_0_10px_rgba(139,92,246,0.3)]`}
                />
             </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
