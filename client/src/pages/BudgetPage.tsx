import { Button } from "@/components/ui/button";
import BudgetCategoryCard from "@/components/BudgetCategoryCard";
import { Coffee, Car, ShoppingBag, Ticket, FileText, ArrowLeft, Target, Shield, Gauge, Zap, BarChart3, Fingerprint, Activity, ShieldCheck, ZapIcon, Globe, Brain, TargetIcon, MousePointer2 } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function BudgetPage() {
  const totalBudget = 2000;
  const totalSpent = 1456;
  const percentageUsed = (totalSpent / totalBudget) * 100;

  const categories = [
    { id: '1', category: 'Food & Dining', icon: Coffee, spent: 380, budget: 400, color: 'text-orange-400' },
    { id: '2', category: 'Transport', icon: Car, spent: 150, budget: 200, color: 'text-blue-400' },
    { id: '3', category: 'Shopping', icon: ShoppingBag, spent: 520, budget: 500, color: 'text-rose-400' },
    { id: '4', category: 'Entertainment', icon: Ticket, spent: 200, budget: 300, color: 'text-blue-500' },
    { id: '5', category: 'Bills', icon: FileText, spent: 206, budget: 600, color: 'text-emerald-400' },
  ];

  return (
    <div className="section-container py-20">
      <div className="flex flex-col gap-12">
        
        {/* Cinematic Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
                Capital Allocation
              </div>
              <div className="h-[1px] w-20 bg-white/5" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-[-0.05em] leading-[0.8] mb-4 text-white uppercase italic">
              BUDGET <br />
              <span className="text-gradient-blue">STRATEGY.</span>
            </h1>
            <p className="text-white/30 text-lg font-medium tracking-tight max-w-xl">
              Precision de-serialization of expenditure sectors for optimal resource flow.
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
             <div className="px-8 py-4 rounded-[28px] glass-frost border-blue-500/20 flex items-center gap-4 shadow-xl">
                <Shield className="w-6 h-6 text-blue-500" />
                <span className="text-[10px] font-black tracking-[0.4em] text-blue-400 uppercase">Secure Allocation Node</span>
             </div>
          </div>
        </motion.div>

        {/* Expenditure Command Center */}
        <motion.div variants={item} initial="hidden" animate="show">
          <Card className="glass-frost p-12 md:p-20 border-white/5 rounded-[64px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 blur-[100px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
            <div className="absolute inset-0 spectral-glow opacity-20 pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
              <div className="lg:col-span-7 space-y-12">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 mb-8 italic">Real-time Data Stream</p>
                   <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.85] uppercase italic text-white drop-shadow-2xl">Total Capital <br/> <span className="text-blue-500">Outflow.</span></h2>
                </div>

                <div className="grid grid-cols-2 gap-12 pt-4">
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">Consumed Units</p>
                    <p className="text-6xl md:text-8xl font-black italic tracking-tighter text-white tabular-nums drop-shadow-2xl">₹{totalSpent.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="space-y-3 pt-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/5">Authorized Cap</p>
                    <p className="text-3xl md:text-4xl font-black italic text-white/10 tabular-nums">₹{totalBudget.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="space-y-5 pt-8">
                  <div className="flex justify-between items-baseline px-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Resource Intensity</span>
                    <span className="text-xl font-black italic tabular-nums text-white/30">{percentageUsed.toFixed(1)}% <span className="text-[10px] uppercase tracking-widest ml-2">Saturation</span></span>
                  </div>
                  <div className="h-4 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/5 p-[2px] shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentageUsed}%` }}
                      transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full bg-gradient-to-r from-blue-700 to-blue-500 rounded-full shadow-[0_0_25px_rgba(37,99,235,0.6)] relative overflow-hidden"
                    >
                       <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-shimmer" />
                    </motion.div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="p-12 rounded-[48px] bg-white/[0.01] border border-white/5 space-y-12 relative overflow-hidden shadow-2xl backdrop-blur-xl">
                  <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
                     <Zap className="w-64 h-64 text-blue-500" />
                  </div>
                  <div className="flex items-center gap-8 relative z-10">
                    <div className="w-20 h-20 rounded-[32px] bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-2xl group-hover:rotate-12 transition-all">
                      <Target className="w-10 h-10" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-3">Liquid Variance</p>
                      <p className="text-4xl font-black text-emerald-400 italic tracking-tighter tabular-nums drop-shadow-2xl">₹{(totalBudget - totalSpent).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="h-px bg-white/5" />
                  <p className="text-xl font-medium text-white/30 leading-relaxed italic relative z-10 tracking-tight">
                    "Systemic indicators signify optimal expenditure alignment. Strategic reserves are maintaining healthy operational margins across all monitored sectors."
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Sector Allocation Breakdown */}
        <section className="space-y-16 mt-12">
           <div className="flex items-center justify-between px-6 border-b border-white/5 pb-10">
              <div className="flex items-center gap-6">
                 <div className="w-3 h-10 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.6)]" />
                 <h2 className="text-4xl font-black tracking-[-0.04em] uppercase italic text-white flex gap-4">Sector <span className="text-gradient-blue italic">Segments.</span></h2>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10">AUTHENTICATED GRANULAR DISTRIBUTION</p>
           </div>
           
           <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
             {categories.map((cat, idx) => (
               <motion.div key={cat.id} variants={item} initial="hidden" animate="show" transition={{ delay: idx * 0.05 }}>
                 <BudgetCategoryCard {...cat} />
               </motion.div>
             ))}
           </div>
        </section>

        {/* AI Strategic Intelligence */}
        <motion.div variants={item} initial="hidden" animate="show" transition={{ delay: 0.4 }} className="pb-24">
          <Card className="glass-frost p-12 md:p-16 border-blue-500/20 rounded-[56px] shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-16 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-1000">
                <ShieldCheck className="w-80 h-80 text-blue-500" />
             </div>
             <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                <div className="w-24 h-24 rounded-[36px] bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-[0_30px_60px_-15px_rgba(37,99,235,0.6)] relative overflow-hidden group-hover:scale-110 transition-transform">
                   <Shield className="w-12 h-12" />
                   <div className="absolute inset-0 rounded-[36px] border-4 border-white/20 animate-pulse" />
                </div>
                <div className="space-y-6 flex-1 text-center lg:text-left">
                  <div className="flex items-center gap-4 justify-center lg:justify-start">
                    <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                    <h3 className="text-xl font-black uppercase tracking-[0.4em] text-blue-500 italic">Strategic Intelligence Node</h3>
                  </div>
                  <p className="text-white/40 text-2xl font-medium leading-[1.6] tracking-tight max-w-5xl">
                    Expenditure in <span className="text-rose-500 font-black italic">Shopping</span> is exceeding critical thresholds. System recommends immediate redirection of surplus from <span className="text-emerald-400 font-black italic">Bills</span> sector to maintain long-term capital equilibrium.
                  </p>
                </div>
             </div>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
