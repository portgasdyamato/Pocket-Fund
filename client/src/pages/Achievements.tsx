import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Trophy, Flame, Calendar, Star, Shield, Zap, Target, Award, Sparkles, TrendingUp, Heart, CheckCircle2, Search, ArrowUpRight } from "lucide-react";
import type { Streak, UserQuest, Quest, StashTransaction, Goal, Transaction, Badge, UserBadge } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 120 } }
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
      icon: <Target className="w-7 h-7" />,
      title: "Wealth Builder",
      description: "Celebrating your first ₹1,000 Milestone. A solid foundation for your future.",
      points: 100,
      unlocked: totalStashed >= 1000,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20"
    },
    {
      id: "week-streak",
      icon: <Flame className="w-7 h-7" />,
      title: "Iron Discipline",
      description: "7 days of consecutive progress. Consistency is the hallmark of mastery.",
      points: 250,
      unlocked: (streak?.saveStreak || 0) >= 7,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      border: "border-orange-400/20"
    },
    {
      id: "fight-master",
      icon: <Search className="w-7 h-7" />,
      title: "The Visionary",
      description: "10 transactions mapped. You've gained primary control over your cash flow.",
      points: 300,
      unlocked: transactions.filter(t => !!t.tag).length >= 10,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/20"
    },
    {
      id: "smart-decisions",
      icon: <Shield className="w-7 h-7" />,
      title: "Noble Guardian",
      description: "Identified 5 wasteful habits. Protecting your wealth from unnecessary leaks.",
      points: 200,
      unlocked: transactions.filter(t => t.tag === 'Ick').length >= 5,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20"
    },
    {
      id: "goal-crusher",
      icon: <Trophy className="w-7 h-7" />,
      title: "Apex Achiever",
      description: "A major financial goal realized. You've proven your dreams are achievable.",
      points: 500,
      unlocked: goals.some(g => parseFloat(g.currentAmount.toString()) >= parseFloat(g.targetAmount.toString())),
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      border: "border-yellow-400/20"
    },
    {
      id: "smart-learner",
      icon: <Zap className="w-7 h-7" />,
      title: "The Scholar",
      description: "First wisdom lesson complete. The best interest is paid on your brain.",
      points: 150,
      unlocked: userQuests.some(uq => {
          const q = allQuests.find(quest => quest.id === uq.questId);
          return uq.completed && q?.category === 'literacy';
      }),
      color: "text-sky-400",
      bg: "bg-sky-400/10",
      border: "border-sky-400/20"
    },
  ], [totalStashed, streak, transactions, goals, userQuests, allQuests]);

  const activityData = Array.from({ length: 30 }, (_, i) => {
    const dayNumber = i + 1;
    const hasActivity = dayNumber <= (streak?.saveStreak || 0);
    return { day: dayNumber, hasActivity };
  });

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-primary/20">
      <main className="max-w-6xl mx-auto px-6 py-20 space-y-24 relative z-10">
        
        {/* Refined Header - More Elegant Size */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Mastery Archive</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight uppercase leading-tight italic">
            Financial <br />
            <span className="text-primary italic">Milestones</span>
          </h1>
          <p className="text-white/40 text-lg sm:text-xl font-medium max-w-2xl leading-relaxed italic border-l-2 border-white/5 pl-6">
            A curated record of your evolution from spending to <span className="text-white">strategic wealth construction</span>.
          </p>
        </motion.div>

        {/* Improved Streak Cards - More Premium, Less "Ugly" */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <motion.div 
            variants={container} 
            initial="hidden" 
            animate="show" 
            className="lg:col-span-4 flex flex-col gap-6"
          >
            {/* Savings Streak */}
            <Card className="p-8 rounded-[32px] glass-morphism border-white/5 hover:bg-white/[0.04] transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                <Flame className="w-32 h-32 text-orange-400" />
              </div>
              <div className="flex flex-col gap-8 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-white/60">Saving Streak</h3>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Active Deposits</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black tracking-tighter italic text-white">{streak?.saveStreak || 0}</span>
                  <span className="text-xs font-black text-white/10 uppercase tracking-widest italic">Days</span>
                </div>
              </div>
            </Card>

            {/* Habit Streak */}
            <Card className="p-8 rounded-[32px] glass-morphism border-white/5 hover:bg-white/[0.04] transition-all duration-500 group relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                <Search className="w-32 h-32 text-purple-400" />
              </div>
              <div className="flex flex-col gap-8 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-white/60">Habit Streak</h3>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Tracking History</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black tracking-tighter italic text-white">{streak?.fightStreak || 0}</span>
                  <span className="text-xs font-black text-white/10 uppercase tracking-widest italic">Days</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Improved Activity Map */}
          <motion.div variants={item} initial="hidden" animate="show" className="lg:col-span-8">
            <Card className="h-full p-10 rounded-[40px] glass-morphism border-white/5 flex flex-col gap-10 relative overflow-hidden group">
               <div className="flex items-center justify-between relative z-10">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">Discipline Log</h3>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">30-Day Consistency Cycle</p>
                  </div>
                  <div className="flex gap-4 bg-white/5 p-2 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2 px-2 border-r border-white/10">
                       <div className="w-2 h-2 rounded-full bg-primary" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Active</span>
                    </div>
                    <div className="flex items-center gap-2 px-2">
                       <div className="w-2 h-2 rounded-full bg-white/5" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Open</span>
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5 relative z-10">
                  {activityData.map((day) => (
                    <motion.div
                      key={day.day}
                      whileHover={{ scale: 1.08 }}
                      className={`aspect-square flex items-center justify-center rounded-xl transition-all duration-300 relative ${
                        day.hasActivity
                          ? "bg-primary/20 border-2 border-primary/30 shadow-[0_0_15px_rgba(139,92,246,0.1)] text-primary"
                          : "bg-white/[0.03] border border-white/5 text-white/10"
                      }`}
                    >
                      <span className="text-xs font-black font-mono">{day.day}</span>
                    </motion.div>
                  ))}
               </div>
               
               <div className="pt-8 mt-auto border-t border-white/5 flex items-center justify-between text-white/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Building Legacy</span>
                  </div>
                  <span className="text-[10px] font-black uppercase italic tracking-widest">
                    Efficiency Rating: {Math.round(((streak?.saveStreak || 0) / 30) * 100)}%
                  </span>
               </div>
            </Card>
          </motion.div>
        </div>

        {/* Redesigned Milestone Collection - High Contrast & Refined Spacing */}
        <div className="space-y-12">
          <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-4">
                <Trophy className="w-6 h-6 text-primary" />
                The Collection
              </h2>
              <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase text-white/40">
                Items Unlocked: <span className="text-primary">{milestones.filter(m => m.unlocked).length}</span> / {milestones.length}
              </div>
          </div>

          <motion.div 
             variants={container}
             initial="hidden"
             animate="show"
             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {milestones.map((milestone) => (
              <motion.div key={milestone.id} variants={item}>
                <Card
                  className={`group h-full p-8 rounded-[32px] glass-morphism transition-all duration-500 relative overflow-hidden flex flex-col gap-10 ${
                    !milestone.unlocked ? 'opacity-30 grayscale border-white/5' : `border-white/10 hover:border-primary/40 ${milestone.border} shadow-2xl shadow-primary/5`
                  }`}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <div className={`w-16 h-16 flex items-center justify-center rounded-2xl transition-all duration-700 group-hover:scale-110 shadow-inner ${
                      milestone.unlocked ? milestone.bg + ' ' + milestone.color : 'bg-white/5 text-white/10'
                    }`}>
                      {milestone.icon}
                    </div>
                    {milestone.unlocked && (
                       <Star className="w-5 h-5 fill-yellow-500 text-yellow-500 animate-pulse" />
                    )}
                  </div>
                  
                  <div className="space-y-4 flex-1 relative z-10">
                    <h3 className="text-2xl font-black tracking-tight uppercase leading-none italic">{milestone.title}</h3>
                    <p className="text-sm font-semibold text-white/30 leading-relaxed italic group-hover:text-white/40 transition-colors">
                       {milestone.description}
                    </p>
                  </div>

                  <div className="pt-8 border-t border-white/5 flex items-end justify-between relative z-10">
                     <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase text-white/20 tracking-widest">Merit Credit</p>
                        <p className={`text-2xl font-black italic ${milestone.unlocked ? 'text-primary' : 'text-white/10'}`}>
                          +{milestone.points} <span className="text-[10px] uppercase font-bold not-italic">XP</span>
                        </p>
                     </div>
                     <ArrowUpRight className={`w-6 h-6 ${milestone.unlocked ? 'text-white/30' : 'text-white/5'}`} />
                  </div>
                  
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Special Badges Section */}
        {userBadges.length > 0 && (
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="pt-20 space-y-12"
          >
            <h2 className="text-2xl font-black tracking-tighter uppercase italic text-white/20 text-center tracking-widest">Special Commendations</h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
               {userBadges.map((ub) => {
                 const badge = allBadges.find(b => b.id === ub.badgeId);
                 if (!badge) return null;
                 return (
                  <motion.div 
                    key={ub.id} 
                    whileHover={{ scale: 1.05 }}
                    className="p-8 rounded-[32px] border border-white/5 bg-white/[0.01] flex flex-col items-center gap-6 group hover:border-primary/20 transition-all text-center"
                  >
                    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:border-primary/40 group-hover:text-primary transition-all">
                      <Star className="w-8 h-8 opacity-20 group-hover:opacity-100" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black uppercase tracking-tighter text-sm italic">{badge.name}</h4>
                      <p className="text-[9px] text-white/20 uppercase font-black tracking-widest italic">{badge.description}</p>
                    </div>
                  </motion.div>
                 );
               })}
            </div>
          </motion.div>
        )}
      </main>
      
      {/* Footer Quote */}
      <footer className="py-20 border-t border-white/5 text-center">
         <p className="text-[11px] font-black uppercase tracking-[0.6em] text-white/5 italic">Destiny is forged in the fires of consistency</p>
      </footer>
    </div>
  );
}
