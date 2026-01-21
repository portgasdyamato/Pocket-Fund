import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import BudgetCategoryCard from "@/components/BudgetCategoryCard";
import ThemeToggle from "@/components/ThemeToggle";
import StreakCounter from "@/components/StreakCounter";
import { Coffee, Car, ShoppingBag, Ticket, FileText, ArrowLeft, Target, Shield, Gauge } from "lucide-react";
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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
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
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Premium Header */}
      <header className="sticky top-[64px] z-50 border-b border-white/5 bg-black/40 backdrop-blur-3xl px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hover:bg-white/5 rounded-xl border border-white/5">
                <ArrowLeft className="w-5 h-5 text-white/40" />
              </Button>
            </Link>
            <div className="h-8 w-px bg-white/10 hidden md:block" />
            <div>
               <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                 THE FIGHT <span className="text-primary italic">PLAN</span>
               </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:block">
                <StreakCounter days={12} />
             </div>
             <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-12"
        >
          {/* Main Console */}
          <motion.div variants={item}>
            <div className="relative p-10 rounded-[40px] glass-morphism border-white/5 overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse" />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
                <div className="lg:col-span-7 space-y-8">
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">Tactical Overview</p>
                     <h2 className="text-4xl font-black tracking-tighter mb-2">Total Resource Expenditure</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Consumed</p>
                      <p className="text-5xl font-black font-mono tracking-tighter">${totalSpent.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Allocation</p>
                      <p className="text-2xl font-black font-mono text-white/20 mt-3">${totalBudget.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                      <span className="text-primary group-hover:animate-pulse">Buffer Efficiency</span>
                      <span className="text-white/40">{percentageUsed.toFixed(1)}% Usage</span>
                    </div>
                    <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentageUsed}%` }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full shadow-[0_0_20px_rgba(139,92,246,0.5)]"
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col justify-center">
                  <div className="p-8 rounded-[32px] bg-white/[0.03] border border-white/5 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <Target className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Available Capital</p>
                        <p className="text-2xl font-black text-green-400 font-mono">${(totalBudget - totalSpent).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="h-px bg-white/5" />
                    <p className="text-sm font-medium text-white/40 leading-relaxed italic">
                      "Expenditure is within optimized parameters. Strategic reserves remain healthy."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Budget Subsystems */}
          <motion.div variants={item}>
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <Gauge className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-black italic tracking-tight">Sector Breakdown</h2>
               </div>
               <div className="flex gap-2">
                  <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest text-white/40 italic">Active Units: 05</div>
               </div>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat, idx) => (
                <motion.div key={cat.id} variants={item} transition={{ delay: idx * 0.05 }}>
                  <BudgetCategoryCard {...cat} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tactical Advice */}
          <motion.div variants={item}>
            <div className="p-8 rounded-[40px] glass-morphism border-primary/20 bg-primary/[0.03] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-5">
                  <Shield className="w-48 h-48 text-primary" />
               </div>
               <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-lg shadow-primary/30 relative">
                  <Shield className="w-8 h-8" />
               </div>
               <div className="space-y-2 relative z-10">
                 <h3 className="text-lg font-black uppercase tracking-widest text-primary italic">Strategist Analysis</h3>
                 <p className="text-white/60 font-medium leading-relaxed max-w-2xl">
                   Resources in <span className="text-pink-400 font-black">Shopping</span> are exceeding predicted thresholds. Redirect surplus from <span className="text-green-400 font-black">Bills</span> sector to maintain systemic equilibrium.
                 </p>
               </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
