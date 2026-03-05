import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Trophy, Flame, Calendar, Star, Shield, Zap, Target, Award, Sparkles, TrendingUp, Heart, CheckCircle2, Search, ArrowUpRight, BarChart3, Fingerprint, Activity } from "lucide-react";
import type { Streak, UserQuest, Quest, StashTransaction, Goal, Transaction, Badge, UserBadge } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

// Snappy, non-AI-feeling transitions (Inspired by technical dashboards like Linear/Vercel)
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
      icon: <Target className="w-6 h-6" />,
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
      icon: <Flame className="w-6 h-6" />,
      title: "Discipline Engine",
      label: "Phase 02",
      description: "7 days of absolute consistency. You are now operating with mechanical precision in your wealth creation.",
      points: 500,
      unlocked: (streak?.saveStreak || 0) >= 7,
      color: "border-orange-500/30",
      accent: "text-orange-500"
    },
    {
      id: "fight-master",
      icon: <Search className="w-6 h-6" />,
      title: "Network Mapping",
      label: "Phase 03",
      description: "10 transactions categorized. Total visibility established across your financial architecture.",
      points: 400,
      unlocked: transactions.filter(t => !!t.tag).length >= 10,
      color: "border-purple-500/30",
      accent: "text-purple-500"
    },
    {
      id: "smart-decisions",
      icon: <Shield className="w-6 h-6" />,
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
      icon: <Trophy className="w-6 h-6" />,
      title: "Impact Milestone",
      label: "Elite",
      description: "Primary objective realizes. Your execution capabilities have moved into the top 1% tier.",
      points: 1000,
      unlocked: goals.some(g => parseFloat(g.currentAmount.toString()) >= parseFloat(g.targetAmount.toString())),
      color: "border-yellow-500/30",
      accent: "text-yellow-500"
    },
    {
      id: "smart-learner",
      icon: <Zap className="w-6 h-6" />,
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
    <div className="min-h-screen bg-[#080808] text-white selection:bg-white/10 relative overflow-hidden font-sans antialiased">
      {/* Hand-crafted texture overlay (Dot grid) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      
      <main className="max-w-7xl mx-auto px-8 py-24 space-y-32 relative z-10">
        
        {/* Architectural Header Section */}
        <header className="flex flex-col lg:flex-row items-baseline justify-between gap-12 border-b border-white/[0.05] pb-20">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-primary" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Repository // 0xAF23</span>
            </div>
            <h1 className="text-7xl sm:text-[120px] font-black tracking-[-0.05em] uppercase italic leading-[0.85] text-[#F0F0F0]">
              Track<br />Record
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="max-w-sm space-y-8"
          >
            <p className="text-white/30 text-lg font-medium leading-relaxed italic border-l-2 border-primary/20 pl-8">
              Converting raw consistency into <span className="text-white">institutional wealth</span>. Every day is a block in your legacy.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
               <div>
                  <p className="text-[9px] uppercase font-black text-white/20 tracking-widest mb-1">Architecture</p>
                  <p className="text-sm font-black text-white uppercase italic">Pioneer Tier</p>
               </div>
               <div>
                  <p className="text-[9px] uppercase font-black text-white/20 tracking-widest mb-1">Efficiency</p>
                  <p className="text-sm font-black text-primary uppercase italic">Elite Grade</p>
               </div>
            </div>
          </motion.div>
        </header>

        {/* Technical Data Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Savings Streak Widget */}
            <motion.div variants={item} initial="hidden" animate="show">
              <Card className="hover:bg-white/[0.03] transition-colors duration-500 bg-transparent border border-white/[0.06] p-10 rounded-2xl flex flex-col gap-12 group">
                 <div className="flex justify-between items-start">
                    <div className="p-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white/40 group-hover:text-primary transition-colors">
                       <Flame className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Metric A1</span>
                 </div>
                 <div className="space-y-1">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">Discipline Sequence</h3>
                    <div className="flex items-baseline gap-4">
                       <span className="text-9xl font-black italic tracking-tighter leading-none">{streak?.saveStreak || 0}</span>
                       <span className="text-[10px] uppercase font-bold text-white/10 tracking-widest">Days</span>
                    </div>
                 </div>
              </Card>
            </motion.div>

            {/* Habit Streak Widget */}
            <motion.div variants={item} initial="hidden" animate="show">
              <Card className="hover:bg-white/[0.03] transition-colors duration-500 bg-transparent border border-white/[0.06] p-10 rounded-2xl flex flex-col gap-12 group">
                 <div className="flex justify-between items-start">
                    <div className="p-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white/40 group-hover:text-primary transition-colors">
                       <Fingerprint className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Metric B4</span>
                 </div>
                 <div className="space-y-1">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">Awareness Flow</h3>
                    <div className="flex items-baseline gap-4">
                       <span className="text-9xl font-black italic tracking-tighter leading-none">{streak?.fightStreak || 0}</span>
                       <span className="text-[10px] uppercase font-bold text-white/10 tracking-widest">Days</span>
                    </div>
                 </div>
              </Card>
            </motion.div>
          </div>

          {/* Precision Consistency Map */}
          <div className="lg:col-span-8">
            <motion.div variants={item} initial="hidden" animate="show" className="h-full">
              <Card className="h-full p-12 bg-transparent border border-white/[0.06] rounded-2xl flex flex-col gap-16 group hover:bg-white/[0.01] transition-colors duration-700">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                       <div className="w-1.5 h-4 bg-primary" />
                       <h3 className="text-2xl font-black uppercase tracking-tighter italic">Consistency Matrix</h3>
                    </div>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">30-Cycle Monitoring Output</p>
                  </div>
                  <div className="flex items-center gap-6 px-6 py-3 bg-white/[0.02] border border-white/[0.06] rounded-full">
                    <div className="flex items-center gap-2">
                       <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                       <span className="text-[10px] font-black uppercase text-white/40">Verified</span>
                    </div>
                    <div className="h-4 w-px bg-white/[0.08]" />
                    <div className="flex items-center gap-2">
                       <div className="w-2.5 h-2.5 rounded-full bg-white/[0.05]" />
                       <span className="text-[10px] font-black uppercase text-white/20">Pending</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 relative">
                  {activityData.map((day) => (
                    <motion.div
                      key={day.day}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`aspect-[1/1.2] flex items-center justify-center rounded-lg transition-all duration-300 relative border ${
                        day.hasActivity
                          ? "bg-primary border-transparent text-white shadow-[0_10px_30px_rgba(139,92,246,0.3)]"
                          : "bg-white/[0.01] border-white/[0.04] text-white/10"
                      }`}
                    >
                      <span className="text-[11px] font-black font-mono">{day.day.toString().padStart(2, '0')}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-auto flex flex-col sm:flex-row justify-between items-end gap-8 pt-12 border-t border-white/[0.05]">
                   <div className="flex items-center gap-6">
                      <BarChart3 className="w-8 h-8 text-white/10" />
                      <div>
                         <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Efficiency rating</p>
                         <p className="text-3xl font-black italic tracking-tighter">{Math.round(((streak?.saveStreak || 0) / 30) * 100)}%</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">System Diagnostic</p>
                      <p className="text-sm font-black uppercase italic tracking-tighter text-emerald-500">Operational Excellence</p>
                   </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Hand-crafted Achievement Exhibition */}
        <section className="space-y-16">
          <div className="flex items-end justify-between border-b border-white/[0.05] pb-8">
              <h2 className="text-4xl font-black tracking-tighter uppercase italic flex items-center gap-4">
                <div className="w-2 h-8 bg-white" />
                Evidence Log
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
                Foundations Found: {milestones.filter(m => m.unlocked).length} / {milestones.length}
              </p>
          </div>

          <motion.div 
             variants={container}
             initial="hidden"
             animate="show"
             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 px-[1px] bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden"
          >
            {milestones.map((milestone) => (
              <motion.div 
                key={milestone.id} 
                variants={item}
                className={`p-10 bg-[#080808] border-r border-b border-white/[0.06] group transition-all duration-500 hover:bg-white/[0.02] last:border-r-0 ${!milestone.unlocked ? 'opacity-30' : ''}`}
              >
                <div className="flex flex-col gap-16">
                   <div className="flex justify-between items-start">
                      <div className={`p-4 bg-transparent border-2 ${milestone.unlocked ? milestone.color + ' ' + milestone.accent : 'border-white/[0.05] text-white/5'} rounded-full`}>
                         {milestone.icon}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 group-hover:text-white/30 transition-colors uppercase">{milestone.label}</span>
                   </div>

                   <div className="space-y-4">
                      <h3 className="text-2xl font-black uppercase tracking-[-0.03em] italic leading-none">{milestone.title}</h3>
                      <p className="text-xs font-semibold text-white/30 leading-relaxed italic group-hover:text-white/50 transition-colors">
                         {milestone.description}
                      </p>
                   </div>

                   <div className="pt-8 border-t border-white/[0.05] flex justify-between items-center group-hover:border-white/[0.1] transition-colors">
                      <div className="space-y-0.5">
                         <p className="text-[8px] font-black uppercase text-white/20 tracking-widest">Yield Valuation</p>
                         <p className={`text-3xl font-black italic tabular-nums ${milestone.unlocked ? 'text-white' : 'text-white/10'}`}>
                           +{milestone.points}
                         </p>
                      </div>
                      {milestone.unlocked ? (
                         <div className="w-10 h-10 rounded-full border border-white/[0.1] flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                            <ArrowUpRight className="w-5 h-5" />
                         </div>
                      ) : (
                         <div className="w-8 h-8 rounded-full border border-white/[0.05] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Search className="w-4 h-4 text-white/10" />
                         </div>
                      )}
                   </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Brutalist Secondary Commendations */}
        {userBadges.length > 0 && (
          <section className="pt-24 border-t border-white/[0.06] space-y-20">
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="text-[9px] font-black uppercase tracking-[0.8em] text-primary">Credential Archive</span>
              <h2 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Distinctions</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-px bg-white/[0.05] border border-white/[0.05] rounded-xl overflow-hidden">
               {userBadges.map((ub) => {
                 const badge = allBadges.find(b => b.id === ub.badgeId);
                 if (!badge) return null;
                 return (
                  <motion.div 
                    key={ub.id} 
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                    className="p-12 bg-[#080808] flex flex-col items-center gap-8 group"
                  >
                    <div className="w-16 h-16 flex items-center justify-center border border-white/[0.08] rounded-full group-hover:border-primary transition-all duration-500 shadow-inner group-hover:bg-primary group-hover:text-white">
                      <Activity className="w-7 h-7 opacity-20 group-hover:opacity-100" />
                    </div>
                    <div className="space-y-2 text-center">
                      <h4 className="font-black uppercase tracking-tighter text-sm italic leading-none">{badge.name}</h4>
                      <p className="text-[9px] text-white/20 uppercase font-black tracking-widest italic leading-tight group-hover:text-white/40 transition-colors uppercase">{badge.description}</p>
                    </div>
                  </motion.div>
                 );
               })}
            </div>
          </section>
        )}
      </main>
      
      {/* Precision Footer */}
      <footer className="py-32 border-t border-white/[0.05] text-center relative z-10">
         <div className="max-w-md mx-auto space-y-6">
            <Fingerprint className="w-10 h-10 text-white/5 mx-auto" />
            <p className="text-[12px] font-black uppercase tracking-[0.8em] text-white/10 italic leading-relaxed">
              Discipline is the only bridge to freedom
            </p>
            <div className="flex items-center justify-center gap-4 text-[9px] font-bold text-white/10 uppercase tracking-widest">
               <span>Ver: 2.0.4</span>
               <div className="h-1 w-1 bg-white/20 rounded-full" />
               <span>Protocol Activated</span>
            </div>
         </div>
      </footer>
    </div>
  );
}
