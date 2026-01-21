import { Coffee, Car, ShoppingBag, Ticket, FileText, Tag, TrendingDown, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

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
      case 'ick': return <TrendingDown className={iconClass} />;
      default: return <Tag className={iconClass} />;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'food': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'transport': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'shopping': return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      case 'entertainment': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'bills': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'ick': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-white/5 text-white/60 border-white/10';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.03)" }}
      className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 transition-all group cursor-pointer" 
      data-testid={`item-expense-${id}`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 ${getCategoryColor(category)} group-hover:scale-110`}>
        {getCategoryIcon(category)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-bold text-sm text-white group-hover:text-primary transition-colors truncate" data-testid={`text-description-${id}`}>
            {description}
          </p>
          {category.toLowerCase() === 'ick' && (
            <span className="bg-destructive/10 text-destructive text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-destructive/20">
              Ick Defeated
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
          <span>{date}</span>
          <span className="w-1 h-1 rounded-full bg-white/10" />
          <span>{category}</span>
        </div>
      </div>
      
      <div className="text-right flex flex-col items-end">
        <p className="font-black text-base text-white" data-testid={`text-amount-${id}`}>
          ₹{amount.toLocaleString('en-IN')}
        </p>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
           <button className="p-1 hover:text-destructive transition-colors">
             <Trash2 className="w-3.5 h-3.5" />
           </button>
        </div>
      </div>
    </motion.div>
  );
}
