import { Coffee, Car, ShoppingBag, Ticket, FileText, Tag as TagIcon, TrendingDown, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface ExpenseItemProps {
  id: string;
  category: string;
  description: string;
  tag?: string | null;
  amount: number;
  date: string;
}

export default function ExpenseItem({ id, category, description, tag, amount, date }: ExpenseItemProps) {
  const getCategoryIcon = (cat: string) => {
    const iconClass = "w-5 h-5";
    switch (cat.toLowerCase()) {
      case 'food': return <Coffee className={iconClass} />;
      case 'transport': return <Car className={iconClass} />;
      case 'shopping': return <ShoppingBag className={iconClass} />;
      case 'entertainment': return <Ticket className={iconClass} />;
      case 'bills': return <FileText className={iconClass} />;
      case 'ick': return <TrendingDown className={iconClass} />;
      default: return <TagIcon className={iconClass} />;
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
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.03)" }}
      className="flex items-center gap-4 p-5 rounded-[24px] border border-white/5 transition-all group cursor-pointer relative overflow-hidden" 
      data-testid={`item-expense-${id}`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-500 ${getCategoryColor(category)} bg-black group-hover:scale-110 shadow-2xl`}>
        {getCategoryIcon(category)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-black text-sm text-white group-hover:text-primary transition-colors truncate uppercase tracking-tight" data-testid={`text-description-${id}`}>
            {description}
          </p>
          {tag && (
            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
              tag === 'Need' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
              tag === 'Want' ? 'bg-primary/10 text-primary border-primary/20' :
              'bg-destructive/10 text-destructive border-destructive/20'
            }`}>
              {tag}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
          <span>{date}</span>
          <span className="w-1 h-1 rounded-full bg-white/10" />
          <span className={getCategoryColor(category).split(' ')[1]}>{category}</span>
        </div>
      </div>
      
      <div className="text-right">
        <p className="font-black text-lg text-white tabular-nums tracking-tighter" data-testid={`text-amount-${id}`}>
          ₹{amount.toLocaleString('en-IN')}
        </p>
        <div className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          Verified Entry
        </div>
      </div>
    </motion.div>
  );
}
