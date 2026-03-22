import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Trophy, Flame, Calendar, Star, Shield, Zap, Target, Award, Sparkles, TrendingUp, Heart, CheckCircle2, Search, ArrowUpRight, BarChart3, Fingerprint, Activity, ShieldCheck, ZapIcon, Globe, Brain, TargetIcon, MousePointer2 } from "lucide-react";
import type { Streak, UserQuest, Quest, StashTransaction, Goal, Transaction, Badge, UserBadge } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

const transition = { type: "spring", damping: 30, stiffness: 200, mass: 1 };

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition }
};

export default function AchievementsPage() {
  const { data: streak } = useQuery<Streak>({ queryKey: ["/api/streak"] });
  const { data: userQuests = [] } = useQuery<UserQuest[]>({ queryKey: ["/api/user/quests"] });
  const { data: allQuests = [] } = useQuery<Quest[]>({ queryKey: ["/api/quests"] });
  const { data: stashTransactions = [] } = useQuery<StashTransaction[]>({ queryKey: ["/api/stash"] });
  const { data: goals = [] } = useQuery<Goal[]>({ queryKey: ["/api/goals"] });
  const { data: transactions = [] } = useQuery<Transaction[]>({ queryKey: ["/api/transactions"] });
  const { data: allBadges = [] } = useQuery<Badge[]>({ queryKey: ["/api/badges"] });
  const { data: userBadges = [] } = useQuery<UserBadge[]>({ queryKey: ["/api/user/badges"] });

  const totalStashed = useMemo(() => stashTransactions
    .filter(t => t.type === 'stash')
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0), [stashTransactions]);

  const milestones = useMemo(() => [
    {
      id: "first-stash",
      icon: <Target className="w-8 h-8" />,
      title: "Capital Formation",
      label: "Phase 01",
      description: "Successfully secured your first ₹1,000. This is the seed of your future institutional-grade portfolio.",
      points: 250,
      unlocked: totalStashed >= 1000,
      color: "border-blue-500/30",
      accent: "text-blue-500"
    },
    {
      id: "week-streak",
      icon: <Flame className="w-8 h-8" />,
      title: "Discipline Engine",
      label: "Phase 02",
      description: "7 days of absolute consistency. You are now operating with mechanical precision in your wealth creation.",
      points: 500,
      unlocked: (streak?.saveStreak || 0) >= 7,
      color: "border-blue-400/30",
      accent: "text-blue-400"
    },
    {
      id: "fight-master",
      icon: <Search className="w-8 h-8" />,
      title: "Network Mapping",
      label: "Phase 03",
      description: "10 transactions categorized. Total visibility established across your financial architecture.",
      points: 400,
      unlocked: transactions.filter(t => !!t.tag).length >= 10,
      color: "border-indigo-500/30",
      accent: "text-indigo-500"
    },
    {
      id: "smart-decisions",
      icon: <Shield className="w-8 h-8" />,
      title: "Waste Perimeter",
      label: "Security",
      description: "5 wasteful habits eliminated. Protecting your capital from low-value extraction leaks.",
      points: 350,
      unlocked: transactions.filter(t => t.tag === 'Ick').length >= 5,
      color: "border-emerald-500/30",
      accent: "text-emerald-500"
    },
    {
      id: "goal-crusher",
      icon: <Trophy className="w-8 h-8" />,
      title: "Impact Milestone",
      label: "Elite",
      description: "Primary objective realizes. Your execution capabilities have moved into the top 1% tier.",
      points: 1000,
      unlocked: goals.some(g => parseFloat(g.currentAmount.toString()) >= parseFloat(g.targetAmount.toString())),
      color: "border-blue-600/30",
      accent: "text-blue-600"
    },
    {
      id: "smart-learner",
      icon: <Zap className="w-8 h-8" />,
      title: "Knowledge Asset",
      label: "Growth",
      description: "First wisdom sequence complete. Converting information into actionable financial power.",
      points: 300,
      unlocked: userQuests.some(uq => {
          const q = allQuests.find(quest => quest.id === uq.questId);
          return uq.completed && q?.category === 'literacy';
      }),
      color: "border-sky-500/30",
      accent: "text-sky-500"
    },
  ], [totalStashed, streak, transactions, goals, userQuests, allQuests]);

  const activityData = Array.from({ length: 30 }, (_, i) => {
    const dayNumber = i + 1;
    const hasActivity = dayNumber <= (streak?.saveStreak || 0);
    return { day: dayNumber, hasActivity };
  });

  return (
    <div className="section-container py-20">
      <div className="flex flex-col gap-12">
        
        {/* Cinematic Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
                Track Registry
              </div>
              <div className="h-[1px] w-20 bg-white/5" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-[-0.05em] leading-[0.8] mb-4 text-white uppercase">
              BEHAVIORAL <br />
              <span className="text-gradient-blue">RECORD.</span>
            </h1>
            <p className="text-white/30 text-lg font-medium tracking-tight max-w-xl">
              Consolidating raw consistency into institutional capital legacy with precision.
            </p>
          </div>
          <div className="flex gap-6">
            <div className="glass-frost px-8 py-6 rounded-[32px] border-white/10 shadow-2xl">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">Efficiency Rating</p>
              <p className="text-3xl font-black text-white tabular-nums">{Math.round(((streak?.saveStreak || 0) / 30) * 100)}%</p>
            </div>
          </div>
        </motion.div>

        {/* Global Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Visualizer */}
          <div className="lg:col-span-8 flex flex-col gap-10">
             <motion.div variants={item} initial="hidden" animate="show">
               <Card className="glass-frost p-12 border-white/5 rounded-[56px] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full -mr-32 -mt-32" />
                  <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-10 mb-16">
                     <div className="space-y-3">
                        <div className="flex items-center gap-4">
                           <div className="w-3 h-10 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.6)]" />
                           <h3 className="text-3xl font-black uppercase tracking-tight italic">Consistency Matrix</h3>
                        </div>
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] ml-7">30-CYCLE SATELLITE MONITORING</p>
                     </div>
                     <div className="flex items-center gap-6 px-8 py-4 bg-white/[0.02] border border-white/10 rounded-[28px] shadow-xl">
                        <div className="flex items-center gap-3">
                           <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                           <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Verified</span>
                        </div>
                        <div className="h-4 w-px bg-white/10" />
                        <div className="flex items-center gap-3">
                           <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
                           <span className="text-[10px] font-black uppercase text-white/20 tracking-widest">Awaiting</span>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-4 relative z-10">
                    {activityData.map((day) => (
                      <motion.div key={day.day} whileHover={{ scale: 1.1, y: -4 }} whileTap={{ scale: 0.9 }} className={`aspect-[1/1.2] flex items-center justify-center rounded-2xl transition-all duration-500 relative border ${
                        day.hasActivity ? "bg-blue-600 border-transparent text-white shadow-[0_15px_30px_rgba(37,99,235,0.4)]" : "bg-white/[0.02] border-white/5 text-white/10"
                      }`}>
                        <span className="text-[11px] font-black tabular-nums">{day.day.toString().padStart(2, '0')}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-16 pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-10 relative z-10">
                     <div className="flex items-center gap-8">
                        <div className="w-16 h-16 rounded-[24px] bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-xl"><BarChart3 className="w-8 h-8 text-white/20" /></div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10 mb-2">Efficiency Rating</p>
                           <p className="text-4xl font-black italic tracking-tighter tabular-nums drop-shadow-2xl">{Math.round(((streak?.saveStreak || 0) / 30) * 100)}% <span className="text-[10px] text-blue-500 uppercase tracking-[0.5em] ml-4 font-black">Elite</span></p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/10 mb-2">Protocol Status</p>
                        <p className="text-sm font-black uppercase italic tracking-[0.2em] text-blue-500 animate-pulse">Operational Excellence</p>
                     </div>
                  </div>
               </Card>
             </motion.div>
          </div>

          {/* Quick Metrics Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-10">
             <motion.div variants={item} initial="hidden" animate="show">
               <Card className="glass-frost p-12 border-white/5 rounded-[56px] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full -mr-24 -mt-24 pointer-events-none transition-transform duration-1000 group-hover:scale-150" />
                  <div className="relative z-10 flex flex-col gap-16">
                     <div className="flex justify-between items-start">
                        <div className="w-16 h-16 rounded-[24px] bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-2xl group-hover:rotate-12 transition-all">
                           <Flame className="w-9 h-9" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10">STREAK-A1</span>
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-5">Discipline Engine</p>
                        <div className="flex items-baseline gap-6">
                           <span className="text-9xl font-black italic tracking-tighter leading-none tabular-nums text-white">{streak?.saveStreak || 0}</span>
                           <span className="text-[10px] uppercase font-black text-blue-500 tracking-[0.5em]">Cycles</span>
                        </div>
                     </div>
                  </div>
               </Card>
             </motion.div>

             <motion.div variants={item} initial="hidden" animate="show" transition={{ delay: 0.1 }}>
               <Card className="glass-frost p-12 border-white/5 rounded-[56px] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 blur-[80px] rounded-full -mr-24 -mt-24 pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
                  <div className="relative z-10 flex flex-col gap-16">
                     <div className="flex justify-between items-start">
                        <div className="w-16 h-16 rounded-[24px] bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-2xl group-hover:rotate-12 transition-all">
                           <Fingerprint className="w-9 h-9" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10">META-ID04</span>
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-5">Identity Resonance</p>
                        <div className="flex items-baseline gap-6">
                           <span className="text-9xl font-black italic tracking-tighter leading-none tabular-nums text-white">{streak?.fightStreak || 0}</span>
                           <span className="text-[10px] uppercase font-black text-indigo-400 tracking-[0.5em]">Score</span>
                        </div>
                     </div>
                  </div>
               </Card>
             </motion.div>
          </div>
        </div>

        {/* Cinematic Millstone Gallery */}
        <section className="space-y-16 mt-12 pb-24">
           <div className="flex items-end justify-between px-6 border-b border-white/5 pb-10">
              <div className="flex items-center gap-6">
                 <div className="w-3 h-10 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
                 <h2 className="text-4xl font-black tracking-[-0.04em] uppercase italic">Evidence Repository</h2>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">FOUNDATIONS RECOVERED: {milestones.filter(m => m.unlocked).length} / {milestones.length}</p>
           </div>

           <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
             {milestones.map((m) => (
               <motion.div key={m.id} variants={item}>
                 <Card className={`glass-frost p-12 h-full rounded-[48px] border-white/5 hover-lift relative overflow-hidden group transition-all duration-700 ${!m.unlocked ? 'opacity-20 grayscale hover:opacity-40' : 'hover:border-blue-500/30'}`}>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 blur-[80px] rounded-full -mr-24 -mt-24 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex flex-col gap-12 relative z-10">
                       <div className="flex justify-between items-start">
                          <div className={`w-20 h-20 rounded-[32px] border flex items-center justify-center transition-all duration-700 group-hover:rotate-12 shadow-2xl ${m.unlocked ? 'bg-blue-600/10 border-blue-500/20 text-blue-500' : 'bg-white/5 border-white/10 text-white/20'}`}>
                             {m.icon}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 group-hover:text-white/30 transition-colors">{m.label}</span>
                       </div>

                       <div className="space-y-4">
                          <h3 className="text-3xl font-black uppercase tracking-tight italic leading-none">{m.title}</h3>
                          <p className="text-lg font-medium text-white/30 leading-relaxed tracking-tight group-hover:text-white/50 transition-colors">{m.description}</p>
                       </div>

                       <div className="pt-10 border-t border-white/5 flex justify-between items-center mt-auto">
                          <div className="space-y-2">
                             <p className="text-[9px] font-black uppercase text-white/10 tracking-[0.4em]">Yield Valuation</p>
                             <p className={`text-4xl font-black italic tabular-nums ${m.unlocked ? 'text-white' : 'text-white/5'}`}>+{m.points}<span className="text-sm ml-2">XP</span></p>
                          </div>
                          {m.unlocked ? (
                             <div className="w-14 h-14 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all shadow-2xl">
                                <ArrowUpRight className="w-7 h-7" />
                             </div>
                          ) : (
                             <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center opacity-40">
                                <Lock className="w-5 h-5 text-white/10" />
                             </div>
                          )}
                       </div>
                    </div>
                 </Card>
               </motion.div>
             ))}
           </motion.div>
        </section>

      </div>
    </div>
  );
}
