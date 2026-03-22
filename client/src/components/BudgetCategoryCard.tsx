import { Card } from "@/components/ui/card";
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
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="h-full"
    >
      <Card className="h-full p-8 glass-card border-white/5 hover:border-blue-500/30 transition-all duration-500 overflow-hidden relative group" data-testid={`card-budget-${id}`}>
        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
          <ArrowUpRight className="w-5 h-5 text-blue-500" />
        </div>
        
        <div className="flex flex-col h-full">
          <div className="flex items-start gap-5 mb-10">
            <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center border border-white/5 bg-white/[0.03] transition-all group-hover:scale-110 group-hover:bg-blue-500/10 group-hover:text-blue-400 group-hover:border-blue-500/20 ${color}`}>
              <Icon className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-white/30 mb-2 truncate" data-testid={`text-category-${id}`}>
                {category} sector
              </h4>
              <div className="flex items-baseline gap-2">
                 <span className="text-3xl font-black tracking-tighter tabular-nums">
                   ₹{spent.toLocaleString()}
                 </span>
                 <span className="text-[10px] font-black text-white/10 uppercase tracking-widest">
                   / ₹{budget.toLocaleString()}
                 </span>
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-4">
             <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${isOverBudget ? 'bg-rose-500 animate-pulse' : 'bg-blue-500'}`} />
                   <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isOverBudget ? 'text-rose-500' : 'text-blue-500/60'}`}>
                     {isOverBudget ? 'LIMIT EXCEEDED' : 'RESERVE STATUS: STABLE'}
                   </span>
                </div>
                <span className="text-xs font-black font-mono tracking-tighter text-white/40">
                  {percentage.toFixed(0)}%
                </span>
             </div>
             
             <div className="relative h-2 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/5 p-[2px]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  className={`h-full relative rounded-full ${isOverBudget ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]'}`}
                />
             </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

