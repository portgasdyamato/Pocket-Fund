import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Coffee, Car, ShoppingBag, Ticket, FileText, Tag, 
  Trash2, Plus, Calendar, Activity, ArrowRight, Filter
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AddExpenseModal from "@/components/AddExpenseModal";
import { format } from "date-fns";
import type { Transaction } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 }
};

export default function ExpenseLog() {
  const { toast } = useToast();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: transactions = [], isLoading, isError } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/transactions/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions/untagged"] });
      toast({
        title: "Protocol Success",
        description: "Data point purged from the ledger.",
      });
      setDeleteId(null);
    },
    onError: () => {
      toast({
        title: "Datalink Failure",
        description: "Could not execute purge sequence.",
        variant: "destructive",
      });
    },
  });

  const getCategoryIcon = (cat: string | null) => {
    const iconClass = "w-4 h-4";
    if (!cat) return <Tag className={iconClass} />;
    switch (cat.toLowerCase()) {
      case 'food': return <Coffee className={iconClass} />;
      case 'transport': return <Car className={iconClass} />;
      case 'shopping': return <ShoppingBag className={iconClass} />;
      case 'entertainment': return <Ticket className={iconClass} />;
      case 'bills': return <FileText className={iconClass} />;
      default: return <Tag className={iconClass} />;
    }
  };

  const getCategoryColor = (cat: string | null) => {
    if (!cat) return 'text-white/40';
    switch (cat.toLowerCase()) {
      case 'food': return 'text-orange-400';
      case 'transport': return 'text-blue-400';
      case 'shopping': return 'text-pink-400';
      case 'entertainment': return 'text-purple-400';
      case 'bills': return 'text-green-400';
      default: return 'text-white/40';
    }
  };

  const getTagStyle = (tag: string | null) => {
    if (!tag) return 'bg-white/5 text-white/40 border-white/5';
    switch (tag) {
      case 'Need': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Want': return 'bg-primary/10 text-primary border-primary/20';
      case 'Ick': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-white/5 text-white/40 border-white/5';
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return format(d, 'MMM d, yyyy');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <main className="container mx-auto px-6 py-12 max-w-5xl">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-end md:items-center justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Protocol v1.02</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter">Activity Log</h1>
            <p className="text-white/40 font-medium mt-2">Every credit, every debit. Trace your financial footprint.</p>
          </div>
          
          <div className="flex gap-4">
             <Button variant="outline" className="border-white/5 bg-white/5 text-white h-14 px-6 rounded-2xl font-bold hover:bg-white/10">
               <Filter className="w-5 h-5 mr-2" />
               Filter Array
             </Button>
             <Button 
                onClick={() => setIsAddExpenseOpen(true)}
                className="bg-primary hover:bg-primary/90 text-white h-14 px-8 rounded-2xl font-black premium-shadow click-scale"
             >
                <Plus className="w-6 h-6 mr-2" />
                Add Entry
             </Button>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-24 bg-white/5 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-20 text-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.02]"
          >
            <Calendar className="w-16 h-16 mx-auto mb-6 text-white/10" />
            <h2 className="text-3xl font-black mb-2">Void Logs</h2>
            <p className="text-white/30 font-medium mb-8 max-w-xs mx-auto">
              No financial signatures detected in the sectors. Initialize your first entry.
            </p>
            <Button
              onClick={() => setIsAddExpenseOpen(true)}
              className="bg-primary text-white px-8 h-12 rounded-xl font-bold"
            >
              Initialize Log
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-3"
            >
              {transactions.map((t) => (
                <motion.div
                  key={t.id}
                  variants={item}
                  className="group flex items-center gap-4 p-5 rounded-3xl glass-morphism border-white/5 hover:border-primary/20 hover:bg-white/[0.03] transition-all cursor-pointer relative"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 transition-all group-hover:scale-110 ${getCategoryColor(t.category)} bg-white/5`}>
                    {getCategoryIcon(t.category)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                       <p className="font-bold text-lg text-white group-hover:text-primary transition-colors truncate">
                         {t.description}
                       </p>
                       <ArrowRight className="w-3 h-3 text-white/0 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                        {formatDate(t.date)}
                      </span>
                      {t.category && (
                        <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${getCategoryColor(t.category)}`}>
                          <span className="w-1 h-1 rounded-full bg-current" />
                          {t.category}
                        </div>
                      )}
                      {t.tag && (
                        <Badge variant="outline" className={`text-[9px] font-black uppercase px-2 py-0 border-0 rounded-md ${getTagStyle(t.tag)}`}>
                          {t.tag}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-black text-2xl text-white">
                        ₹{parseFloat(t.amount).toLocaleString('en-IN')}
                      </p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/10 hover:text-destructive w-10 h-10 rounded-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(t.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </main>

      <AddExpenseModal
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
      />

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="glass-morphism border-white/10 text-white p-8 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-destructive/50" />
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-destructive/10 flex items-center justify-center border border-destructive/20 mb-2">
              <Trash2 className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-black">Purge Entry?</h2>
            <p className="text-white/40 font-medium">
              This action will permanently delete this data fragment from the master ledger. This cannot be undone.
            </p>
          </div>
          <div className="flex gap-4 mt-8">
            <Button 
               variant="outline" 
               className="flex-1 h-14 border-white/10 bg-white/5 font-bold rounded-2xl" 
               onClick={() => setDeleteId(null)}
            >
              Abort
            </Button>
            <Button 
               className="flex-1 h-14 bg-destructive hover:bg-destructive/90 text-white font-black rounded-2xl premium-shadow"
               onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            >
              Confirm Purge
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
