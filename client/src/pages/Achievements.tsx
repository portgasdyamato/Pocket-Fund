import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Trophy, Flame, Calendar, Star, Shield, Zap, Target, Award, Sparkles, TrendingUp, Heart, CheckCircle2 } from "lucide-react";
import type { Streak, UserQuest, Quest, StashTransaction, Goal, Transaction, Badge, UserBadge } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 15 } }
};

export default function AchievementsPage() {
  const { data: streak } = useQuery<Streak>({
    queryKey: ["/api/streak"],
  });

  const { data: userQuests = [] } = useQuery<UserQuest[]>({
    queryKey: ["/api/user/quests"],
  });
  
  const { data: allQuests = [] } = useQuery<Quest[]>({
    queryKey: ["/api/quests"],
  });
  
  const { data: stashTransactions = [] } = useQuery<StashTransaction[]>({
    queryKey: ["/api/stash"],
  });
  
  const { data: goals = [] } = useQuery<Goal[]>({
    queryKey: ["/api/goals"],
  });
  
  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: allBadges = [] } = useQuery<Badge[]>({
    queryKey: ["/api/badges"],
  });

  const { data: userBadges = [] } = useQuery<UserBadge[]>({
    queryKey: ["/api/user/badges"],
  });

  const totalStashed = useMemo(() => stashTransactions
    .filter(t => t.type === 'stash')
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0), [stashTransactions]);

  const milestones = useMemo(() => [
    {
      id: "first-stash",
      icon: <Target className="w-8 h-8" />,
      title: "First Step",
      description: "You've successfully saved your first ₹1,000! This is the foundation of your future wealth.",
      points: 100,
      unlocked: totalStashed >= 1000,
      gradient: "from-blue-600/20 via-indigo-600/10 to-transparent",
      accent: "text-blue-400",
      glow: "shadow-[0_0_40px_rgba(37,99,235,0.15)]"
    },
    {
      id: "week-streak",
      icon: <Flame className="w-8 h-8" />,
      title: "Consistency Pro",
      description: "You've stayed on track for 7 days in a row. Small daily actions lead to massive results.",
      points: 250,
      unlocked: (streak?.saveStreak || 0) >= 7,
      gradient: "from-orange-600/20 via-red-600/10 to-transparent",
      accent: "text-orange-400",
      glow: "shadow-[0_0_40px_rgba(234,88,12,0.15)]"
    },
    {
      id: "fight-master",
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Expense Master",
      description: "You've categorized 10 transactions. Being aware of your spending is your secret weapon.",
      points: 300,
      unlocked: transactions.filter(t => !!t.tag).length >= 10,
      gradient: "from-purple-600/20 via-pink-600/10 to-transparent",
      accent: "text-purple-400",
      glow: "shadow-[0_0_40px_rgba(147,51,234,0.15)]"
    },
    {
      id: "smart-decisions",
      icon: <Heart className="w-8 h-8" />,
      title: "Mindful Spender",
      description: "You've spotted 5 'Spending Icks'. Every time you say no to an impulse, you say yes to yourself.",
      points: 200,
      unlocked: transactions.filter(t => t.tag === 'Ick').length >= 5,
      gradient: "from-emerald-600/20 via-teal-600/10 to-transparent",
      accent: "text-emerald-400",
      glow: "shadow-[0_0_40px_rgba(5,150,105,0.15)]"
    },
    {
      id: "goal-crusher",
      icon: <Trophy className="w-8 h-8" />,
      title: "Goal Achiever",
      description: "You've fully completed a major savings goal. You're turning your dreams into reality.",
      points: 500,
      unlocked: goals.some(g => parseFloat(g.currentAmount.toString()) >= parseFloat(g.targetAmount.toString())),
      gradient: "from-yellow-600/20 via-amber-600/10 to-transparent",
      accent: "text-yellow-400",
      glow: "shadow-[0_0_40px_rgba(217,119,6,0.15)]"
    },
    {
      id: "smart-learner",
      icon: <Zap className="w-8 h-8" />,
      title: "Quick Learner",
      description: "You've finished your first wisdom lesson. The more you know, the more you grow.",
      points: 150,
      unlocked: userQuests.some(uq => {
          const q = allQuests.find(quest => quest.id === uq.questId);
          return uq.completed && q?.category === 'literacy';
      }),
      gradient: "from-sky-600/20 via-blue-600/10 to-transparent",
      accent: "text-sky-400",
      glow: "shadow-[0_0_40px_rgba(2,132,199,0.15)]"
    },
  ], [totalStashed, streak, transactions, goals, userQuests, allQuests]);

  const activityData = Array.from({ length: 30 }, (_, i) => {
    const dayNumber = i + 1;
    const hasActivity = dayNumber <= (streak?.saveStreak || 0);
    return { day: dayNumber, hasActivity };
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <main className="max-w-7xl mx-auto px-6 py-20 space-y-24 relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-2 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            Your Progress Gallery
          </div>
          <h1 className="text-6xl sm:text-8xl font-black tracking-tighter italic uppercase leading-[0.85] flex flex-col">
            The Trophy <span className="text-primary mt-2">Room</span>
          </h1>
          <p className="text-white/40 text-lg sm:text-2xl font-medium max-w-2xl leading-relaxed mx-auto lg:mx-0">
            Celebrating every win on your <span className="text-white italic">journey to financial freedom</span>. You're doing better than you think.
          </p>
        </motion.div>

        {/* Consistency Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Consistency Cards */}
          <motion.div 
            variants={container} 
            initial="hidden" 
            animate="show" 
            className="lg:col-span-4 flex flex-col gap-8"
          >
            <Card className="flex-1 p-8 rounded-[48px] glass-morphism border-orange-500/10 bg-gradient-to-br from-orange-500/5 to-transparent group hover:bg-orange-500/[0.08] transition-all duration-500 relative overflow-hidden backdrop-blur-3xl">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                  <Flame className="w-32 h-32 text-orange-400" />
               </div>
               <div className="flex items-center gap-4 mb-10">
                   <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400 border border-orange-500/20 shadow-lg shadow-orange-500/10">
                      <Flame className="w-7 h-7" />
                   </div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-orange-500/80">Savings Streak</h3>
               </div>
               <div className="flex items-baseline gap-3">
                  <span className="text-8xl font-black tracking-tighter font-mono italic text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                    {streak?.saveStreak || 0}
                  </span>
                  <span className="text-sm font-black uppercase tracking-widest text-white/20">DAYS</span>
               </div>
               <p className="mt-8 text-xs font-bold text-white/40 leading-relaxed italic border-t border-white/5 pt-6">
                 "One day at a time, you build a lifetime of security."
               </p>
            </Card>

            <Card className="flex-1 p-8 rounded-[48px] glass-morphism border-primary/10 bg-gradient-to-br from-primary/5 to-transparent group hover:bg-primary/[0.08] transition-all duration-500 relative overflow-hidden backdrop-blur-3xl">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                  <Calendar className="w-32 h-32 text-primary" />
               </div>
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/10">
                     <Calendar className="w-7 h-7" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary/80">Habit Tracking</h3>
               </div>
               <div className="flex items-baseline gap-3">
                  <span className="text-8xl font-black tracking-tighter font-mono italic text-white drop-shadow-[0_0_30px_rgba(139,92,246,0.1)]">
                    {streak?.fightStreak || 0}
                  </span>
                  <span className="text-sm font-black uppercase tracking-widest text-white/20">DAYS</span>
               </div>
               <p className="mt-8 text-xs font-bold text-white/40 leading-relaxed italic border-t border-white/5 pt-6">
                 "The more you track, the more you win."
               </p>
            </Card>
          </motion.div>

          {/* Activity Map */}
          <motion.div variants={item} initial="hidden" animate="show" className="lg:col-span-8">
            <Card className="h-full p-12 rounded-[60px] glass-morphism border-white/5 relative overflow-hidden backdrop-blur-3xl flex flex-col gap-12">
               <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 relative z-10">
                  <div className="flex items-center gap-5">
                     <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shadow-inner">
                        <Star className="w-7 h-7 fill-yellow-500 drop-shadow-[0_0_12px_rgba(234,179,8,0.4)]" />
                     </div>
                     <div className="space-y-1">
                        <h3 className="text-2xl font-black uppercase tracking-widest italic">Consistency Map</h3>
                        <p className="text-sm font-medium text-white/20 tracking-wider">Visualizing your daily growth over 30 days</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-6 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                      <span className="text-[10px] font-black text-white/40 tracking-[0.2em]">SUCCESS</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-white/5 border border-white/10" />
                      <span className="text-[10px] font-black text-white/40 tracking-[0.2em]">PENDING</span>
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-5 sm:grid-cols-10 gap-4 relative z-10">
                  {activityData.map((day) => (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: day.day * 0.015 }}
                      whileHover={{ scale: 1.15, zIndex: 20 }}
                      className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative group transition-all duration-500 ${
                        day.hasActivity
                          ? "bg-gradient-to-br from-primary to-accent border border-white/20 shadow-[0_0_30px_rgba(139,92,246,0.2)]"
                          : "bg-white/[0.03] border border-white/5 hover:border-white/10"
                      }`}
                    >
                      <span className={`text-xs font-black font-mono transition-colors ${day.hasActivity ? 'text-white' : 'text-white/20'}`}>
                        {day.day}
                      </span>
                      {day.hasActivity && (
                         <div className="absolute -top-1.5 -right-1.5">
                            <Star className="w-4 h-4 text-white fill-yellow-400 drop-shadow-[0_0_5px_rgba(255,255,255,0.6)]" />
                         </div>
                      )}
                      
                      {/* Interactive Tooltip */}
                      <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none shadow-[0_20px_40px_rgba(0,0,0,0.4)] translate-y-2 group-hover:translate-y-0 border-t-2 border-primary">
                        Day {day.day}: {day.hasActivity ? 'Habit Maintained!' : 'Keep going!'}
                      </div>
                    </motion.div>
                  ))}
               </div>
               
               <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 flex items-center gap-4 mt-auto">
                 <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                    <CheckCircle2 className="w-5 h-5" />
                 </div>
                 <p className="text-xs font-bold text-white/40 leading-relaxed">
                   Your habits determine your future. You've completed activity for <span className="text-white">{streak?.saveStreak || 0}</span> days in this period.
                 </p>
               </div>
            </Card>
          </motion.div>
        </div>

        {/* Milestone Gallery */}
        <div className="space-y-16">
          <div className="flex items-end justify-between flex-wrap gap-8">
             <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-xl shadow-primary/10">
                   <Award className="w-8 h-8 font-black" />
                </div>
                <div>
                   <h2 className="text-4xl font-black tracking-tighter uppercase italic mb-1">Badge Collection</h2>
                   <p className="text-sm font-medium text-white/30 tracking-widest">Major breakthroughs you've achieved</p>
                </div>
             </div>
             <div className="px-8 py-4 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-md flex items-baseline gap-3">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic">Unlocked</span>
               <span className="text-3xl font-black italic text-primary">{milestones.filter(m => m.unlocked).length}</span>
               <span className="text-lg font-black italic text-white/20">/ {milestones.length}</span>
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
                  className={`group h-full p-10 rounded-[56px] border transition-all duration-700 relative overflow-hidden flex flex-col backdrop-blur-3xl hover:scale-[1.02] active:scale-[0.98] ${
                    milestone.unlocked 
                      ? `bg-gradient-to-br ${milestone.gradient} border-white/10 hover:border-white/20 shadow-2xl ${milestone.glow}` 
                      : 'bg-white/[0.01] border-white/5 opacity-50 grayscale cursor-not-allowed hover:opacity-60 transition-opacity'
                  }`}
                >
                  {/* Subtle Background Badge */}
                  <div className={`absolute -right-12 -top-12 opacity-[0.03] group-hover:scale-150 transition-transform duration-1000 group-hover:rotate-12 ${milestone.unlocked ? milestone.accent : 'text-white'}`}>
                    {milestone.icon}
                  </div>

                  <div className={`mb-10 w-24 h-24 rounded-[35%] flex items-center justify-center border transition-all duration-700 group-hover:rotate-[15deg] group-hover:scale-110 shadow-inner relative ${
                    milestone.unlocked 
                      ? `bg-white/10 border-white/20 ${milestone.accent}` 
                      : 'bg-white/5 border-white/5 text-white/20'
                  }`}>
                    {milestone.unlocked && (
                      <div className="absolute inset-0 bg-white/20 rounded-[inherit] blur-2xl animate-pulse -z-10" />
                    )}
                    {milestone.icon}
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <h3 className="text-3xl font-black tracking-tighter uppercase leading-none italic">{milestone.title}</h3>
                    <p className="text-sm font-medium text-white/40 leading-relaxed font-sans group-hover:text-white/60 transition-colors">
                       {milestone.description}
                    </p>
                  </div>

                  <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-8">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center border border-yellow-400/20">
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                           <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Rewards</span>
                           <span className="text-sm font-black italic text-yellow-400/80">+{milestone.points} XP</span>
                        </div>
                     </div>
                     {milestone.unlocked ? (
                       <div className="px-5 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-[9px] font-black uppercase tracking-[0.3em] text-green-400 shadow-lg shadow-green-500/10">
                         ACHIEVED
                       </div>
                     ) : (
                       <div className="px-5 py-2 rounded-full bg-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-white/20 italic">
                         LOCKED
                       </div>
                     )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* System Badges */}
        <AnimatePresence>
          {userBadges.length > 0 && (
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-16"
            >
              <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-3xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20 shadow-xl shadow-accent/10">
                     <Shield className="w-8 h-8" />
                  </div>
                  <div>
                     <h2 className="text-4xl font-black tracking-tighter uppercase italic mb-1">Special Recognition</h2>
                     <p className="text-sm font-medium text-white/30 tracking-widest">Unique honors for your contribution</p>
                  </div>
               </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                 {userBadges.map((ub) => {
                   const badge = allBadges.find(b => b.id === ub.badgeId);
                   if (!badge) return null;
                   return (
                    <motion.div 
                      key={ub.id} 
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="p-8 rounded-[40px] bg-gradient-to-br from-white/5 to-transparent border border-white/5 flex flex-col items-center text-center gap-6 backdrop-blur-3xl group transition-all"
                    >
                      <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20 text-accent group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all">
                        <Star className="w-10 h-10 fill-accent" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-black uppercase tracking-tighter text-xl leading-none italic">{badge.name}</h4>
                        <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold">{badge.description}</p>
                      </div>
                    </motion.div>
                   );
                 })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Motivational Quote */}
        <motion.div 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="text-center py-20 border-t border-white/5"
        >
          <p className="text-3xl sm:text-5xl font-black italic tracking-tighter text-white/10 uppercase max-w-4xl mx-auto leading-none">
            "Your accomplishments are the results of your <span className="text-white/20">daily discipline</span> and <span className="text-white/20">unshakable patience</span>."
          </p>
        </motion.div>
      </main>
    </div>
  );
}
