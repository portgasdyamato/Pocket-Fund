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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const [filterTag, setFilterTag] = useState<string | null>(null);

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    retry: false,
  });

  const { data: untaggedTransactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions/untagged"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/transactions/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions/untagged"] });
      toast({
        title: "Success",
        description: "Transaction removed.",
      });
      setDeleteId(null);
    },
  });

  const tagMutation = useMutation({
    mutationFn: async ({ id, tag }: { id: string; tag: string }) => {
      await apiRequest(`/api/transactions/${id}/tag`, "PATCH", { tag });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions/untagged"] });
      queryClient.invalidateQueries({ queryKey: ["/api/streak"] });
      toast({
        title: "Categorized",
        description: "Transaction has been filed.",
      });
    },
  });

  const filteredTransactions = filterTag 
    ? transactions.filter(t => t.tag === filterTag)
    : transactions;

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
      <main className="container mx-auto px-6 py-12 max-w-5xl space-y-12">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-end md:items-center justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Finance Records</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter">Transaction History</h1>
            <p className="text-white/40 font-medium mt-2">A complete track of your spending patterns.</p>
          </div>
          
          <div className="flex gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className={`border-white/5 h-14 px-6 rounded-2xl font-bold transition-all ${filterTag ? 'bg-primary/10 text-primary border-primary/20' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                    <Filter className="w-5 h-5 mr-2" />
                    {filterTag ? `Only ${filterTag}` : 'Filter'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass-morphism border-white/10">
                  <DropdownMenuItem onClick={() => setFilterTag(null)} className="font-bold">All Transactions</DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem onClick={() => setFilterTag('Need')} className="text-blue-400 font-bold">Needs Only</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterTag('Want')} className="text-primary font-bold">Wants Only</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterTag('Ick')} className="text-destructive font-bold">Icks Only</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
             <Button 
                onClick={() => setIsAddExpenseOpen(true)}
                className="bg-primary hover:bg-primary/90 text-white h-14 px-8 rounded-2xl font-black premium-shadow click-scale"
             >
                <Plus className="w-6 h-6 mr-2" />
                New Entry
             </Button>
          </div>
        </motion.div>

        {/* Categorization Pending Section (Merged from Fight) */}
        <AnimatePresence>
          {untaggedTransactions.length > 0 && !filterTag && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                 <h2 className="text-xs font-black uppercase tracking-widest text-white/40">Action Required: Categorize Spending</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {untaggedTransactions.slice(0, 3).map((t) => (
                  <Card key={t.id} className="glass-morphism border-orange-500/20 p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0">
                        <p className="font-bold truncate">{t.description}</p>
                        <p className="text-[10px] text-white/30 uppercase tracking-tighter">₹{parseFloat(t.amount).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-[10px] h-8 font-black border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
                        onClick={() => tagMutation.mutate({ id: t.id, tag: 'Need' })}
                       >
                         NEED
                       </Button>
                       <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-[10px] h-8 font-black border-primary/20 text-primary hover:bg-primary/10"
                        onClick={() => tagMutation.mutate({ id: t.id, tag: 'Want' })}
                       >
                         WANT
                       </Button>
                       <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-[10px] h-8 font-black border-destructive/20 text-destructive hover:bg-destructive/10"
                        onClick={() => tagMutation.mutate({ id: t.id, tag: 'Ick' })}
                       >
                         ICK
                       </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transaction History List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
             <h2 className="text-sm font-black uppercase tracking-widest text-white/30">Recent Records</h2>
             {filterTag && (
               <Button variant="ghost" size="sm" onClick={() => setFilterTag(null)} className="text-primary h-auto p-0 text-xs font-bold hover:bg-transparent">
                 Clear Filter
               </Button>
             )}
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="h-24 bg-white/5 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-20 text-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.02]"
            >
              <Calendar className="w-16 h-16 mx-auto mb-6 text-white/10" />
              <h2 className="text-3xl font-black mb-2">No Records</h2>
              <p className="text-white/30 font-medium mb-8 max-w-xs mx-auto">
                No financial activity found. Start tracking your expenses today.
              </p>
              <Button
                onClick={() => setIsAddExpenseOpen(true)}
                className="bg-primary text-white px-8 h-12 rounded-xl font-bold"
              >
                Track First Expense
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-3"
            >
              {filteredTransactions.map((t) => (
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
          )}
        </div>
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
            <h2 className="text-2xl font-black">Delete Record?</h2>
            <p className="text-white/40 font-medium">
              This action will permanently delete this transaction from your history. This cannot be undone.
            </p>
          </div>
          <div className="flex gap-4 mt-8">
            <Button 
               variant="outline" 
               className="flex-1 h-14 border-white/10 bg-white/5 font-bold rounded-2xl" 
               onClick={() => setDeleteId(null)}
            >
              Cancel
            </Button>
            <Button 
               className="flex-1 h-14 bg-destructive hover:bg-destructive/90 text-white font-black rounded-2xl premium-shadow"
               onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            >
              Delete Permanently
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
