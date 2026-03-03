import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Zap, ShieldCheck, TrendingUp, TrendingDown, Star, Sparkles, ShoppingBag, Car, Coffee, Ticket, FileText, Tag, Trash2, Plus, Calendar, Activity, ArrowRight, Filter, ChevronRight, Info } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AddExpenseModal from "@/components/AddExpenseModal";
import { format, isToday, isYesterday } from "date-fns";
import type { Transaction } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
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
        title: "Success",
        description: "Transaction categorized successfully.",
      });
    },
  });

  const filteredTransactions = filterTag 
    ? transactions.filter(t => t.tag === filterTag)
    : transactions;

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: Transaction[] } = {};
    filteredTransactions.forEach(t => {
      const dateKey = format(new Date(t.date), 'yyyy-MM-dd');
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(t);
    });
    return groups;
  }, [filteredTransactions]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedTransactions).sort((a, b) => b.localeCompare(a));
  }, [groupedTransactions]);

  const stats = useMemo(() => {
    const total = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const untagged = untaggedTransactions.length;
    const efficiency = transactions.length > 0 
      ? Math.round((transactions.filter(t => t.tag === 'Need' || t.tag === 'Want').length / transactions.length) * 100)
      : 0;
    return { total, untagged, efficiency };
  }, [transactions, untaggedTransactions]);

  const getCategoryIcon = (cat: string | null) => {
    const iconClass = "w-5 h-5";
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

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM do, yyyy');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <main className="container mx-auto px-6 py-12 max-w-5xl space-y-12">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Enhanced Header Section */}
          <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="w-3.5 h-3.5 text-primary fill-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Intelligence Hub</span>
              </div>
              <h1 className="text-6xl font-black tracking-tighter">History</h1>
              <p className="text-white/40 font-medium max-w-md">Precision tracking and AI-powered categorization for your global financial footprint.</p>
            </div>
            
            <div className="flex gap-4">
               <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                   <Button variant="outline" className={`h-16 px-8 rounded-[24px] font-black border-white/5 transition-all text-sm tracking-tight ${filterTag ? 'bg-primary border-primary text-white' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                     <Filter className="w-5 h-5 mr-3" />
                     {filterTag ? `Only ${filterTag}` : 'All Types'}
                   </Button>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent className="w-56 p-2 rounded-2xl bg-black border-white/10 shadow-2xl backdrop-blur-3xl">
                   <DropdownMenuItem onClick={() => setFilterTag(null)} className="rounded-xl h-12 font-bold focus:bg-white/10">All Transactions</DropdownMenuItem>
                   <DropdownMenuSeparator className="bg-white/5" />
                   <DropdownMenuItem onClick={() => setFilterTag('Need')} className="rounded-xl h-12 font-bold text-blue-400 focus:bg-blue-400/10">Needs Only</DropdownMenuItem>
                   <DropdownMenuItem onClick={() => setFilterTag('Want')} className="rounded-xl h-12 font-bold text-primary focus:bg-primary/10">Wants Only</DropdownMenuItem>
                   <DropdownMenuItem onClick={() => setFilterTag('Ick')} className="rounded-xl h-12 font-bold text-destructive focus:bg-destructive/10">Icks Only</DropdownMenuItem>
                 </DropdownMenuContent>
               </DropdownMenu>

               <Button 
                  onClick={() => setIsAddExpenseOpen(true)}
                  className="bg-white text-black hover:bg-white/90 h-16 px-10 rounded-[24px] font-black text-sm premium-shadow click-scale tracking-tight"
               >
                  <Plus className="w-6 h-6 mr-3 border-2 border-black/10 rounded-lg p-0.5" />
                  New Record
               </Button>
            </div>
          </div>

          {/* High-Level Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-morphism border-white/5 p-8 space-y-2 group overflow-hidden relative rounded-[32px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700" />
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Monthly Volume</p>
              <h3 className="text-4xl font-black tabular-nums tracking-tighter">₹{stats.total.toLocaleString('en-IN')}</h3>
              <div className="flex items-center gap-1.5 text-xs font-bold text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span>Global Spending Active</span>
              </div>
            </Card>
            <Card className="glass-morphism border-white/5 p-8 space-y-2 group overflow-hidden relative rounded-[32px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700" />
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Pending Review</p>
              <h3 className="text-4xl font-black tabular-nums tracking-tighter">{stats.untagged} Items</h3>
              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400">
                <Zap className="w-4 h-4 fill-orange-400" />
                <span>Deep Analysis Required</span>
              </div>
            </Card>
            <Card className="glass-morphism border-white/5 p-8 space-y-2 group overflow-hidden relative rounded-[32px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700" />
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Financial IQ</p>
              <h3 className="text-4xl font-black tabular-nums tracking-tighter">{stats.efficiency}%</h3>
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Optimal Efficiency Meta</span>
              </div>
            </Card>
          </div>
        </motion.div>

        <AnimatePresence>
          {untaggedTransactions.length > 0 && !filterTag && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-1 bg-orange-400 rounded-full animate-pulse" />
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Review Workspace</h2>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-orange-400/60 transition-colors cursor-help group">
                  <Info className="w-3.5 h-3.5" />
                  <span>Assign spending metadata to activate advanced metrics</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {untaggedTransactions.slice(0, 3).map((t) => (
                  <motion.div
                    key={t.id}
                    layoutId={t.id}
                    className="relative rounded-[56px] overflow-hidden group/card shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
                  >
                    <Card className="h-full bg-zinc-900 border-2 border-white/[0.05] rounded-[55px] p-8 flex flex-col gap-8 relative overflow-hidden">
                      {/* Premium Top Reflection */}
                      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />
                      
                      {/* Header Area */}
                      <div className="flex items-center justify-between relative z-10">
                         <div className={`w-14 h-14 rounded-3xl bg-white/[0.07] border border-white/[0.1] flex items-center justify-center shadow-xl ${getCategoryColor(t.category)} scale-105`}>
                           {/* Enlarged and Brightened Icon */}
                           <div className="scale-125 opacity-100 brightness-125">
                            {getCategoryIcon(t.category)}
                           </div>
                         </div>
                         <div className="px-4 py-2 rounded-full bg-white/[0.07] border border-white/[0.1] shadow-inner">
                            <span className="text-[11px] font-black text-white/50 uppercase tracking-[0.2em]">SEQ {t.id.slice(-4)}</span>
                         </div>
                      </div>

                      {/* Content Area */}
                      <div className="space-y-4 relative z-10 text-center flex-1 py-2">
                         <div className="inline-flex flex-col items-center">
                           <span className={`text-[11px] font-black uppercase tracking-[0.5em] ${getCategoryColor(t.category)} brightness-125 block mb-1`}>{t.category}</span>
                           <div className="h-[2px] w-12 bg-white/20 rounded-full" />
                         </div>
                         
                         <h4 className="text-2xl font-black tracking-tight leading-tight text-white line-clamp-2 uppercase drop-shadow-lg">
                           {t.description}
                         </h4>

                         <div className="flex flex-col items-center pt-2">
                           <div className="flex items-baseline gap-3">
                             <span className="text-xl font-black text-orange-400 drop-shadow-sm">INR</span>
                             <span className="text-6xl font-black tabular-nums tracking-tighter text-white [text-shadow:_0_4px_12px_rgb(0_0_0_/_50%)]">
                               {parseFloat(t.amount).toLocaleString('en-IN')}
                             </span>
                           </div>
                         </div>
                      </div>

                      {/* Actions Area - Compact Content-Fit Tokens */}
                      <div className="flex flex-row flex-wrap items-center justify-center gap-3 relative z-10">
                        {[
                          { label: 'NEED', id: 'Need', color: 'blue', icon: ShieldCheck, accent: 'text-blue-400', glow: 'group-hover/btn:bg-blue-400/10' },
                          { label: 'WANT', id: 'Want', color: 'primary', icon: Star, accent: 'text-primary', glow: 'group-hover/btn:bg-primary/10' },
                          { label: 'ICK', id: 'Ick', color: 'destructive', icon: TrendingDown, accent: 'text-destructive', glow: 'group-hover/btn:bg-destructive/10' }
                        ].map((btn) => (
                          <motion.button
                            key={btn.id}
                            whileHover={{ scale: 1.05, y: -4 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => tagMutation.mutate({ id: t.id, tag: btn.id })}
                            className={`flex flex-row items-center gap-3 px-5 py-3.5 rounded-full border transition-all duration-300 group/btn w-fit
                               bg-[#0C0C0C] border-white/[0.05] hover:border-white/10 hover:shadow-xl
                               ${btn.accent} ${btn.glow}`}
                          >
                            <div className="flex-shrink-0 transition-transform duration-500 group-hover/btn:scale-110">
                               <btn.icon className="w-4 h-4 opacity-90" />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/70 group-hover/btn:text-white transition-colors">{btn.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-10">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-white/20 rounded-full" />
               <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 italic">Global Transaction Ledger</h2>
             </div>
             {filterTag && (
               <Button variant="ghost" size="sm" onClick={() => setFilterTag(null)} className="text-primary h-auto p-0 text-xs font-bold hover:bg-transparent">
                 Reset Metadata Filter
               </Button>
             )}
          </div>
          
          {isLoading ? (
            <div className="space-y-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-28 bg-white/[0.02] rounded-[32px] animate-pulse border border-white/5" />
              ))}
            </div>
          ) : sortedDates.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-32 text-center border-2 border-dashed border-white/5 rounded-[48px] bg-white/[0.01] relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-primary/5 blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative space-y-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Calendar className="w-10 h-10 text-white/10 group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h2 className="text-4xl font-black tracking-tighter mb-3">Void Detected</h2>
                  <p className="text-white/30 font-medium max-w-sm mx-auto leading-relaxed italic uppercase tracking-widest text-[10px]">
                    The global ledger is currently empty. Initiate your first transaction sequence to populate the matrix.
                  </p>
                </div>
                <Button
                  onClick={() => setIsAddExpenseOpen(true)}
                  className="bg-primary text-white px-12 h-16 rounded-2xl font-black premium-shadow click-scale"
                >
                  Initiate First Entry
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-16">
              {sortedDates.map((dateStr) => (
                <div key={dateStr} className="space-y-6">
                  <div className="flex items-baseline gap-4 px-2">
                    <span className="text-xl font-black tracking-tight text-white/90">{formatDateLabel(dateStr)}</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
                      {groupedTransactions[dateStr].length} Events
                    </span>
                  </div>

                  <motion.div 
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-3"
                  >
                    {groupedTransactions[dateStr].map((t) => (
                      <motion.div
                        key={t.id}
                        variants={item}
                        className="group flex items-center gap-6 p-6 rounded-[32px] glass-morphism border-white/5 hover:border-white/20 hover:bg-white/[0.03] transition-all cursor-pointer relative overflow-hidden"
                      >
                        {/* Hover Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center border transition-all duration-500 group-hover:scale-110 shadow-2xl bg-black border-white/10 ${getCategoryColor(t.category)}`}>
                          {getCategoryIcon(t.category)}
                        </div>
                        
                        <div className="flex-1 min-w-0 relative">
                          <div className="flex items-center gap-3 mb-1">
                             <h4 className="font-black text-xl text-white group-hover:text-primary transition-colors truncate tracking-tight uppercase tracking-[0.02em]">
                               {t.description}
                             </h4>
                             <ChevronRight className="w-4 h-4 text-white/0 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>
                          <div className="flex items-center gap-4 flex-wrap">
                            <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] ${getCategoryColor(t.category)}`}>
                              <div className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
                              {t.category}
                            </div>
                            {t.tag && (
                              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black border transition-colors ${
                                t.tag === 'Need' ? 'border-blue-500/20 text-blue-400 bg-blue-500/5' :
                                t.tag === 'Want' ? 'border-primary/20 text-primary bg-primary/5' :
                                'border-destructive/20 text-destructive bg-destructive/5'
                              }`}>
                                {t.tag === 'Need' ? <ShieldCheck className="w-3 h-3" /> : 
                                 t.tag === 'Want' ? <Star className="w-3 h-3" /> : 
                                 <TrendingDown className="w-3 h-3" />}
                                {t.tag}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-8 relative">
                          <div className="text-right">
                            <p className="font-black text-3xl text-white tracking-tighter tabular-nums drop-shadow-2xl">
                              ₹{parseFloat(t.amount).toLocaleString('en-IN')}
                            </p>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive hover:text-white w-12 h-12 rounded-2xl border border-transparent hover:border-destructive/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteId(t.id);
                            }}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              ))}
            </div>
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
