import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar, 
  Tag as TagIcon, 
  Filter, 
  ChevronRight, 
  Zap, 
  CreditCard,
  Search,
  Download,
  MoreHorizontal
} from "lucide-react";
import type { Transaction } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import AddExpenseModal from "@/components/AddExpenseModal";
import { PlusCircle, TrendingDown, Clock, Activity, Target } from "lucide-react";

const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function History() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const spendingMetrics = useMemo(() => {
    const total = transactions.reduce((sum, t) => sum + parseFloat(t.amount || "0"), 0);
    const icks = transactions.filter(t => t.tag === 'Ick').length;
    const targets = transactions.filter(t => t.tag === 'Need').length;
    return { total, icks, targets };
  }, [transactions]);

  const filteredTransactions = transactions
    .filter(t => 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tag?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getTagColor = (tag: string | null) => {
    switch (tag) {
      case 'Need': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'Want': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      case 'Ick': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Goal Claim': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-white/40 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="section-container py-20">
      <div className="flex flex-col gap-12">
        
        {/* Cinematic Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em]">
                Audit Database
              </div>
              <div className="h-[1px] w-20 bg-white/5" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-[-0.05em] leading-[0.8] mb-4 text-white uppercase">
              REGISTRY <br />
              <span className="text-gradient-blue">ARCHIVE.</span>
            </h1>
            <p className="text-white/30 text-lg font-medium tracking-tight max-w-xl">
              Chronological deconstruction of all capital flow events in the system.
            </p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
             <Button onClick={() => setIsAddExpenseOpen(true)} className="h-16 rounded-[24px] px-10 bg-white text-black font-black hover:bg-white/90 flex items-center gap-4 text-xs uppercase tracking-widest click-scale">
               <PlusCircle className="w-5 h-5" /> Execute Entry
             </Button>
             <Button variant="outline" className="h-16 rounded-[24px] px-10 border-white/10 text-white font-black hover:bg-white/5 flex items-center gap-4 text-xs uppercase tracking-widest click-scale">
               <Download className="w-5 h-5" /> Export DB
             </Button>
          </div>
        </motion.div>

        {/* Tactical Search Console */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-frost p-6 rounded-[40px] border-white/5 shadow-2xl relative overflow-hidden group">
           <div className="absolute inset-0 bg-blue-500/[0.02] pointer-events-none" />
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className="relative flex-1 group">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                 <Input className="h-20 bg-white/[0.02] border-white/5 rounded-[28px] pl-16 pr-8 text-xl font-bold focus:border-blue-500/30 transition-all outline-none" placeholder="SEARCH SIGNALS (DESC, CAT, TAG)..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <Button className="h-20 w-full md:w-auto px-12 rounded-[28px] bg-white/[0.03] border border-white/10 text-white font-black hover:bg-white/[0.06] hover:border-white/20 flex items-center gap-4 text-xs uppercase tracking-[0.2em] click-scale">
                 <Filter className="w-5 h-5 text-blue-500" /> Filter Layers
              </Button>
           </div>
        </motion.div>

        {/* Tactical Metrics Review */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
           <Card className="glass-frost p-8 rounded-[40px] border-white/5 flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                 <Activity className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">CUMULATIVE FLUX</p>
                 <p className="text-2xl font-black text-white tabular-nums">₹{spendingMetrics.total.toLocaleString('en-IN')}</p>
              </div>
           </Card>
           <Card className="glass-frost p-8 rounded-[40px] border-white/5 flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                 <TrendingDown className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">ICK ANOMALIES</p>
                 <p className="text-2xl font-black text-white">{spendingMetrics.icks} Signals</p>
              </div>
           </Card>
           <Card className="glass-frost p-8 rounded-[40px] border-white/5 flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                 <Target className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">CORE NECESSITIES</p>
                 <p className="text-2xl font-black text-white">{spendingMetrics.targets} Targets</p>
              </div>
           </Card>
        </div>

        {/* Global Registry Feed */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-6 mb-8 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
              <p>Chronological Stream</p>
              <p>{filteredTransactions.length} Verified Entries</p>
           </div>

           <AnimatePresence mode="popLayout">
             <div className="grid grid-cols-1 gap-5">
               {filteredTransactions.map((t, idx) => (
                 <motion.div key={t.id} variants={item} initial="hidden" animate="show" exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: Math.min(idx * 0.05, 0.4) }} className="group">
                    <Card className="glass-frost p-8 rounded-[40px] border-white/5 hover:border-white/10 transition-all shadow-xl hover-lift relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                       <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                          <div className="flex items-center gap-8">
                             <div className="w-16 h-16 rounded-[24px] bg-white/[0.03] border border-white/5 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-700">
                                <Zap className="w-8 h-8 text-blue-500" />
                             </div>
                             <div>
                                <h4 className="text-2xl font-black text-white/90 group-hover:text-blue-500 transition-colors uppercase tracking-tight">{t.description}</h4>
                                <div className="flex items-center gap-4 mt-3">
                                   <div className="flex items-center gap-2 group-hover:text-white/60 transition-colors">
                                      <Calendar className="w-3.5 h-3.5 text-white/20" />
                                      <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{format(new Date(t.date), 'MMM dd, yyyy')}</span>
                                   </div>
                                   <div className="w-1 h-1 rounded-full bg-white/10" />
                                   <div className="flex items-center gap-2">
                                      <CreditCard className="w-3.5 h-3.5 text-white/20" />
                                      <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{t.category || 'GENERAL'}</span>
                                   </div>
                                </div>
                             </div>
                          </div>

                          <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-end">
                             <div className={`px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.3em] shadow-lg ${getTagColor(t.tag)}`}>
                                {t.tag || 'UNSPECIFIED'}
                             </div>
                             <div className="text-right">
                                <p className="text-4xl font-black text-white tabular-nums tracking-tighter">₹{parseFloat(t.amount).toLocaleString('en-IN')}</p>
                                <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.4em] mt-2">Verified Flux</p>
                             </div>
                          </div>
                       </div>
                    </Card>
                 </motion.div>
               ))}

               {filteredTransactions.length === 0 && !isLoading && (
                 <div className="p-40 text-center border-2 border-white/5 border-dashed rounded-[64px] opacity-20 hover:opacity-30 transition-opacity">
                    <p className="text-3xl font-black italic uppercase tracking-[0.2em] mb-4">Registry Nullified.</p>
                    <p className="text-lg font-bold">No capital signals detected in this temporal slice.</p>
                 </div>
               )}
               
               {isLoading && (
                 <div className="space-y-6">
                    {[1,2,3,4,5].map(i => <div key={i} className="h-32 rounded-[40px] bg-white/[0.02] border border-white/5 animate-pulse" />)}
                 </div>
               )}
             </div>
           </AnimatePresence>
        </section>
      </div>
      <AddExpenseModal open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen} />
    </div>
  );
}
