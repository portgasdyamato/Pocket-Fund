import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Trophy, Flame, Calendar, Star, Shield, Zap, Target, Award, Sparkles, TrendingUp, Heart, CheckCircle2, Search, ArrowUpRight } from "lucide-react";
import type { Streak, UserQuest, Quest, StashTransaction, Goal, Transaction, Badge, UserBadge } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const item = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 150 } }
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
      title: "Wealth Builder",
      description: "You've successfully saved your first ₹1,000 Milestone. The long road to wealth begins with a single step.",
      points: 100,
      unlocked: totalStashed >= 1000,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20"
    },
    {
      id: "week-streak",
      icon: <Flame className="w-8 h-8" />,
      title: "Iron Discipline",
      description: "7 days of consecutive saving. You're building an unstoppable habit of discipline.",
      points: 250,
      unlocked: (streak?.saveStreak || 0) >= 7,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      border: "border-orange-400/20"
    },
    {
      id: "fight-master",
      icon: <Search className="w-8 h-8" />,
      title: "The Visionary",
      description: "10 transactions mapped. You've gained a strategic perspective over your cash flow.",
      points: 300,
      unlocked: transactions.filter(t => !!t.tag).length >= 10,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/20"
    },
    {
      id: "smart-decisions",
      icon: <Shield className="w-8 h-8" />,
      title: "Noble Guardian",
      description: "Identified 5 wasteful habits. You're shielding your wealth from unnecessary leaks.",
      points: 200,
      unlocked: transactions.filter(t => t.tag === 'Ick').length >= 5,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20"
    },
    {
      id: "goal-crusher",
      icon: <Trophy className="w-8 h-8" />,
      title: "Apex Achiever",
      description: "A major financial goal fully realized. You've proven your dreams are achievable.",
      points: 500,
      unlocked: goals.some(g => parseFloat(g.currentAmount.toString()) >= parseFloat(g.targetAmount.toString())),
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      border: "border-yellow-400/20"
    },
    {
      id: "smart-learner",
      icon: <Zap className="w-8 h-8" />,
      title: "The Scholar",
      description: "First wisdom lesson complete. Knowledge is the one asset that never loses its value.",
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
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30">
      <main className="max-w-7xl mx-auto px-6 py-24 space-y-24">
        
        {/* Simplified Header with Superior Hierarchy */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 text-center sm:text-left"
        >
          <div className="flex items-center justify-center sm:justify-start gap-3">
             <div className="h-0.5 w-12 bg-primary/40 rounded-full" />
             <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/60">Legacy Archive</span>
          </div>
          <h1 className="text-6xl sm:text-9xl font-black tracking-tighter uppercase leading-[0.8] tracking-tighter italic">
            Your Track <br />
            <span className="text-primary italic">Record</span>
          </h1>
          <p className="text-white/40 text-xl sm:text-2xl font-semibold max-w-2xl leading-relaxed italic border-l-4 border-white/10 pl-8 ml-2">
            Celebrating your transition from reckless spending to <span className="text-white">strategic wealth construction</span>.
          </p>
        </motion.div>

        {/* Improved Streaks: Higher Visibility & Clearer Language */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <motion.div 
            variants={container} 
            initial="hidden" 
            animate="show" 
            className="lg:col-span-4 flex flex-col gap-8"
          >
            {/* Savings Streak */}
            <Card className="p-10 rounded-[42px] bg-[#0a0a0a] border border-white/5 hover:bg-white/[0.04] transition-all duration-700 group border-b-4 border-b-orange-500/30">
              <div className="flex flex-col gap-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-[20px] bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20">
                      <Flame className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-base font-black uppercase tracking-widest text-white leading-none">Saving Streak</h3>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Days with Deposits</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-8xl font-black tracking-tighter italic text-white group-hover:scale-105 transition-transform origin-left duration-500">{streak?.saveStreak || 0}</span>
                  <span className="text-sm font-black text-white/10 uppercase italic">Days</span>
                </div>
                <p className="text-xs font-semibold text-white/30 leading-relaxed border-t border-white/5 pt-6 italic">
                  One day at a time, you secure your future.
                </p>
              </div>
            </Card>

            {/* Tracking Streak (Habit Streak) */}
            <Card className="p-10 rounded-[42px] bg-[#0a0a0a] border border-white/5 hover:bg-white/[0.04] transition-all duration-700 group border-b-4 border-b-purple-500/30">
              <div className="flex flex-col gap-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-[20px] bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20">
                      <Search className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-base font-black uppercase tracking-widest text-white leading-none">Habit Streak</h3>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Days Tracking Costs</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-8xl font-black tracking-tighter italic text-white group-hover:scale-105 transition-transform origin-left duration-500">{streak?.fightStreak || 0}</span>
                  <span className="text-sm font-black text-white/10 uppercase italic">Days</span>
                </div>
                <p className="text-xs font-semibold text-white/30 leading-relaxed border-t border-white/5 pt-6 italic">
                  Awareness is the first step toward freedom.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Consistency Overview - Bold & Professional */}
          <motion.div variants={item} initial="hidden" animate="show" className="lg:col-span-8">
            <Card className="h-full p-12 rounded-[50px] bg-[#0a0a0a] border border-white/10 flex flex-col gap-16 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 relative z-10">
                  <div className="space-y-2">
                    <h3 className="text-4xl font-black uppercase tracking-tighter italic leading-none">Consistency Cycle</h3>
                    <p className="text-sm font-black text-white/20 uppercase tracking-[0.2em] italic">Your roadmap of discipline over 30 days</p>
                  </div>
                  <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2 px-3 border-r border-white/10">
                       <div className="w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/20" />
                       <span className="text-xs font-black uppercase tracking-widest text-white/40">Active</span>
                    </div>
                    <div className="flex items-center gap-2 px-3">
                       <div className="w-3 h-3 rounded-full bg-white/5" />
                       <span className="text-xs font-black uppercase tracking-widest text-white/40">Open</span>
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-5 sm:grid-cols-10 gap-3.5 relative z-10">
                  {activityData.map((day) => (
                    <motion.div
                      key={day.day}
                      whileHover={{ y: -3, scale: 1.05 }}
                      className={`aspect-square flex items-center justify-center rounded-2xl transition-all duration-500 ${
                        day.hasActivity
                          ? "bg-primary border-transparent shadow-[0_15px_30px_rgba(139,92,246,0.3)] text-white"
                          : "bg-white/[0.03] border border-white/10 text-white/10"
                      }`}
                    >
                      <span className="text-sm font-black font-mono">{day.day.toString().padStart(2, '0')}</span>
                    </motion.div>
                  ))}
               </div>
               
               <div className="mt-auto px-8 py-6 rounded-[32px] bg-white/[0.04] border border-white/10 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                       <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-black uppercase tracking-widest text-white/30 italic">
                       Building a foundation that lasts for generations.
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                     <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Level Progress</span>
                     <span className="text-2xl font-black italic text-primary">
                       {Math.round(((streak?.saveStreak || 0) / 30) * 100)}%
                     </span>
                  </div>
               </div>
            </Card>
          </motion.div>
        </div>

        {/* Milestone Collection - Massive Contrast & Spacing */}
        <div className="space-y-16">
          <div className="flex items-center justify-between">
              <h2 className="text-4xl font-black tracking-tighter uppercase italic flex items-center gap-8">
                <span className="h-px w-24 bg-white/10 hidden sm:block" />
                The Collection
              </h2>
              <div className="px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-xs font-black uppercase tracking-widest text-primary">
                 Items Unlocked: {milestones.filter(m => m.unlocked).length} / {milestones.length}
              </div>
          </div>

          <motion.div 
             variants={container}
             initial="hidden"
             animate="show"
             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {milestones.map((milestone) => (
              <motion.div key={milestone.id} variants={item}>
                <Card
                  className={`h-full p-12 rounded-[56px] border transition-all duration-700 relative overflow-hidden flex flex-col gap-10 bg-[#0a0a0a] ${
                    !milestone.unlocked ? 'opacity-30 grayscale border-white/5' : `border-white/10 hover:border-primary/40 ${milestone.border} shadow-2xl`
                  }`}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <div className={`w-20 h-20 flex items-center justify-center rounded-[28px] transition-all duration-700 group-hover:scale-110 shadow-inner group-hover:rotate-6 ${
                      milestone.unlocked ? milestone.bg + ' ' + milestone.color : 'bg-white/5 text-white/10'
                    }`}>
                      {milestone.icon}
                    </div>
                    {milestone.unlocked && (
                       <Star className="w-6 h-6 fill-yellow-500 text-yellow-500 animate-pulse" />
                    )}
                  </div>
                  
                  <div className="space-y-4 flex-1 relative z-10">
                    <h3 className="text-3xl font-black tracking-tighter uppercase leading-none italic group-hover:text-primary transition-colors">{milestone.title}</h3>
                    <p className="text-sm font-semibold text-white/30 leading-relaxed italic group-hover:text-white/50 transition-colors">
                       {milestone.description}
                    </p>
                  </div>

                  <div className="pt-10 border-t border-white/5 flex items-end justify-between relative z-10">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Merit Points</p>
                        <p className={`text-4xl font-black italic ${milestone.unlocked ? 'text-primary' : 'text-white/10'}`}>
                          +{milestone.points}
                        </p>
                     </div>
                     <ArrowUpRight className={`w-8 h-8 ${milestone.unlocked ? 'text-white/20' : 'text-white/5'}`} />
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* System Badges: Refined & Aesthetic */}
        <AnimatePresence>
          {userBadges.length > 0 && (
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="pt-24 space-y-16"
            >
              <div className="text-center space-y-4">
                 <Shield className="w-12 h-12 text-primary/20 mx-auto" />
                 <h2 className="text-3xl font-black tracking-tighter uppercase italic text-white/20">Distinct Commendations</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                 {userBadges.map((ub) => {
                   const badge = allBadges.find(b => b.id === ub.badgeId);
                   if (!badge) return null;
                   return (
                    <motion.div 
                      key={ub.id} 
                      whileHover={{ y: -6, scale: 1.05 }}
                      className="p-10 rounded-[48px] border border-white/5 bg-[#0a0a0a] flex flex-col items-center gap-6 group hover:border-primary/20 transition-all text-center"
                    >
                      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:text-primary group-hover:border-primary/40 transition-all">
                        <Star className="w-8 h-8 fill-current opacity-40 group-hover:opacity-100" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-black uppercase tracking-tighter text-base italic leading-none">{badge.name}</h4>
                        <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] italic font-black">{badge.description}</p>
                      </div>
                    </motion.div>
                   );
                 })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Global Style Polishes */}
      <footer className="py-20 border-t border-white/5 text-center">
         <p className="text-[11px] font-black uppercase tracking-[0.6em] text-white/5 italic">Destiny is Forge in the fires of consistency</p>
      </footer>
    </div>
  );
}
