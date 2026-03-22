import { Button } from "@/components/ui/button";
import BudgetCategoryCard from "@/components/BudgetCategoryCard";
import { Coffee, Car, ShoppingBag, Ticket, FileText, ArrowLeft, Target, Shield, Gauge, Zap } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
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
    { id: '3', category: 'Shopping', icon: ShoppingBag, spent: 520, budget: 500, color: 'text-pink-400' },
    { id: '4', category: 'Entertainment', icon: Ticket, spent: 200, budget: 300, color: 'text-purple-400' },
    { id: '5', category: 'Bills', icon: FileText, spent: 206, budget: 600, color: 'text-green-400' },
  ];

  return (
    <div className="min-h-screen bg-[#020205] text-white selection:bg-blue-500/30">
      {/* Mesh Background */}
      <div className="fixed inset-0 z-0 bg-mesh opacity-20 pointer-events-none" />

      {/* Pro Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.03] bg-[#020205]/60 backdrop-blur-2xl px-6 h-20">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/">
              <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-colors click-scale">
                <ArrowLeft className="w-5 h-5 text-white/60" />
              </button>
            </Link>
            <div className="h-6 w-px bg-white/10" />
            <h1 className="text-sm font-black tracking-[0.3em] uppercase flex items-center gap-3">
              Budget <span className="text-blue-500">Allocation</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] font-black tracking-widest text-blue-400">SECURE TERMINAL</span>
             </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20 lg:py-24">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-24">
          
          {/* Expenditure Command Center */}
          <motion.div variants={item}>
            <div className="relative p-10 md:p-16 rounded-[48px] glass-card border-white/5 overflow-hidden group">
              <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
              <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
                <div className="lg:col-span-7 space-y-12">
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-6 font-mono">Real-time Data Stream</p>
                     <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-tight">Total Capital <br/>Outflow Analysis</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-12 pt-4">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Consumed Units</p>
                      <p className="text-4xl md:text-6xl font-black font-mono tracking-tighter text-white tabular-nums">₹{totalSpent.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Authorized Cap</p>
                      <p className="text-2xl md:text-3xl font-black font-mono text-white/10 mt-2">₹{totalBudget.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.3em] font-mono">
                      <span className="text-blue-400">Resource Intensity</span>
                      <span className="text-white/20">{percentageUsed.toFixed(1)}% Saturation</span>
                    </div>
                    <div className="h-2.5 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/5 p-[1px]">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentageUsed}%` }}
                        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col justify-center">
                  <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                       <Zap className="w-40 h-40 text-blue-500" />
                    </div>
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="w-16 h-16 rounded-[24px] bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                        <Target className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">Available Liquidity</p>
                        <p className="text-3xl font-black text-emerald-400 font-mono tracking-tighter">₹{(totalBudget - totalSpent).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="h-px bg-white/5" />
                    <p className="text-base font-medium text-white/30 leading-relaxed italic relative z-10">
                      "Systemic indicators signify optimal expenditure alignment. Strategic reserves are maintaining healthy operational margins."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sector Allocation Breakdown */}
          <motion.div variants={item}>
            <div className="flex items-center justify-between mb-12">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center">
                     <Gauge className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                     <h2 className="text-2xl font-black uppercase tracking-tight">Sector Segments</h2>
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-1">Granular resource distribution</p>
                  </div>
               </div>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat, idx) => (
                <motion.div key={cat.id} variants={item}>
                  <BudgetCategoryCard {...cat} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* AI Strategic Intelligence */}
          <motion.div variants={item}>
            <div className="p-10 rounded-[48px] glass-card border-blue-500/20 bg-blue-500/[0.02] flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-16 opacity-[0.03]">
                  <Shield className="w-64 h-64 text-blue-500" />
               </div>
               <div className="w-20 h-20 rounded-[28px] bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-2xl shadow-blue-500/40 relative">
                  <Shield className="w-10 h-10" />
                  <div className="absolute inset-0 rounded-[28px] border-4 border-white/20 animate-pulse" />
               </div>
               <div className="space-y-3 relative z-10">
                 <h3 className="text-xl font-black uppercase tracking-[0.2em] text-blue-400 font-mono">Strategic Intelligence Advisor</h3>
                 <p className="text-white/50 text-xl font-medium leading-relaxed max-w-4xl tracking-tight">
                   Expenditure in <span className="text-pink-400 font-black">Shopping</span> is nearing critical threshold limits. Recommend redirection of surplus from the <span className="text-emerald-400 font-black">Bills</span> sector to maintain long-term capital equilibrium.
                 </p>
               </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
