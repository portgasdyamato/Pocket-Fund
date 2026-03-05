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
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 150 } }
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
      icon: <Target className="w-5 h-5" />,
      title: "Wealth Builder",
      description: "You've successfully stashed your first ₹1,000. Your future self is thanking you.",
      points: 100,
      unlocked: totalStashed >= 1000,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20"
    },
    {
      id: "week-streak",
      icon: <Flame className="w-5 h-5" />,
      title: "Iron Discipline",
      description: "7 days of consecutive saving. You're building a habit that lasts a lifetime.",
      points: 250,
      unlocked: (streak?.saveStreak || 0) >= 7,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      border: "border-orange-400/20"
    },
    {
      id: "fight-master",
      icon: <Search className="w-5 h-5" />,
      title: "Strategic Eye",
      description: "10 expenses reviewed. You now have full control over where your money flows.",
      points: 300,
      unlocked: transactions.filter(t => !!t.tag).length >= 10,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/20"
    },
    {
      id: "smart-decisions",
      icon: <Shield className="w-5 h-5" />,
      title: "Smart Guard",
      description: "Identified 5 wasteful 'Icks'. You're cutting the leaks in your financial ship.",
      points: 200,
      unlocked: transactions.filter(t => t.tag === 'Ick').length >= 5,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20"
    },
    {
      id: "goal-crusher",
      icon: <Trophy className="w-5 h-5" />,
      title: "Goal Breaker",
      description: "A major financial goal fully funded. Dreams are just goals with a plan.",
      points: 500,
      unlocked: goals.some(g => parseFloat(g.currentAmount.toString()) >= parseFloat(g.targetAmount.toString())),
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      border: "border-yellow-400/20"
    },
    {
      id: "smart-learner",
      icon: <Zap className="w-5 h-5" />,
      title: "Knowledge Elite",
      description: "First learning module complete. The best interest is paid on your brain.",
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
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/20">
      <main className="max-w-6xl mx-auto px-6 py-20 space-y-20">
        
        {/* Header: High Hierarchy */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 text-center sm:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Mastery Dashboard</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight uppercase leading-none italic">
            Your <span className="text-white outline-text-sm">Milestones</span>
          </h1>
          <p className="text-white/40 text-lg sm:text-xl font-medium max-w-2xl leading-relaxed italic">
            Celebrating the transition from spending to <span className="text-white">strategic wealth creation</span>.
          </p>
        </motion.div>

        {/* Streaks: Clear Separation & Visibility */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.div variants={container} initial="hidden" animate="show" className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Savings Streak */}
            <Card className="p-8 rounded-[32px] bg-[#0a0a0a] border border-white/5 hover:border-orange-500/30 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform">
                <Flame className="w-32 h-32" />
              </div>
              <div className="flex flex-col gap-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-white">Saving Streak</h3>
                    <p className="text-[9px] font-bold text-white/20 uppercase">Action: Adding to Pocket</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-7xl font-black tracking-tighter italic text-white group-hover:text-orange-400 transition-colors">{streak?.saveStreak || 0}</span>
                  <span className="text-sm font-black text-white/10 uppercase italic">Days</span>
                </div>
              </div>
            </Card>

            {/* Awareness Streak */}
            <Card className="p-8 rounded-[32px] bg-[#0a0a0a] border border-white/5 hover:border-purple-500/30 transition-all duration-500 group relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform">
                <TrendingUp className="w-32 h-32" />
              </div>
              <div className="flex flex-col gap-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <Search className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-white">Awareness Streak</h3>
                    <p className="text-[9px] font-bold text-white/20 uppercase">Action: Tagging Expenses</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-7xl font-black tracking-tighter italic text-white group-hover:text-purple-400 transition-colors">{streak?.fightStreak || 0}</span>
                  <span className="text-sm font-black text-white/10 uppercase italic">Days</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Consistency Map: High Visibility Grid */}
          <motion.div variants={item} initial="hidden" animate="show" className="lg:col-span-8">
            <Card className="h-full p-10 rounded-[40px] bg-[#0a0a0a] border border-white/5 relative overflow-hidden flex flex-col gap-10">
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">Consistency Log</h3>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Monthly Growth Overview</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      <span className="text-[9px] font-black uppercase text-primary">Active</span>
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                  {activityData.map((day) => (
                    <div
                      key={day.day}
                      className={`aspect-square flex items-center justify-center rounded-xl transition-all duration-500 ${
                        day.hasActivity
                          ? "bg-primary text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] scale-105 z-10"
                          : "bg-white/[0.03] border border-white/5 text-white/10 group-hover:bg-white/[0.05]"
                      }`}
                    >
                      <span className="text-xs font-black font-mono">{day.day.toString().padStart(2, '0')}</span>
                    </div>
                  ))}
               </div>
               
               <div className="mt-auto px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-white/40">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Your discipline is your greatest asset.</span>
                  </div>
                  <span className="text-primary font-black text-xs italic">
                    Level Up Progress: {Math.round(((streak?.saveStreak || 0) / 30) * 100)}%
                  </span>
               </div>
            </Card>
          </motion.div>
        </div>

        {/* Milestones: Strong Typography & Separation */}
        <div className="space-y-12">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black tracking-tighter uppercase italic text-white flex items-center gap-4">
              <Award className="w-8 h-8 text-primary" />
              Mastery Collection
            </h2>
            <div className="h-px flex-1 bg-white/5" />
            <div className="px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase text-white/40">
              Unlocked: <span className="text-primary">{milestones.filter(m => m.unlocked).length}</span> / {milestones.length}
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
                  className={`group h-full p-8 rounded-[32px] bg-[#0a0a0a] border transition-all duration-500 relative overflow-hidden flex flex-col gap-8 ${
                    !milestone.unlocked ? 'opacity-30 border-white/5' : `border-white/10 hover:border-primary/40 ${milestone.border}`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-700 group-hover:scale-110 shadow-lg ${
                      milestone.unlocked ? milestone.bg + ' ' + milestone.color : 'bg-white/5 text-white/20'
                    }`}>
                      {milestone.icon}
                    </div>
                    {milestone.unlocked && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    <h3 className="text-2xl font-black tracking-tight uppercase leading-none italic group-hover:text-primary transition-colors">
                      {milestone.title}
                    </h3>
                    <p className="text-sm font-medium text-white/30 leading-relaxed font-sans group-hover:text-white/40 transition-colors">
                       {milestone.description}
                    </p>
                  </div>

                  <div className="pt-8 mt-4 border-t border-white/5 flex items-end justify-between">
                     <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase text-white/20 italic tracking-widest">XP Reward</p>
                        <p className={`text-xl font-black italic ${milestone.unlocked ? 'text-primary' : 'text-white/10'}`}>
                          +{milestone.points}
                        </p>
                     </div>
                     <ArrowUpRight className={`w-6 h-6 ${milestone.unlocked ? 'text-white/40' : 'text-white/5'}`} />
                  </div>
                  
                  {/* Subtle hover accent */}
                  {milestone.unlocked && (
                    <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-primary/5 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Badges: Simple & Elegant */}
        {userBadges.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-10 space-y-10">
            <h2 className="text-xl font-black tracking-tighter uppercase italic text-white/20 text-center">Special Recognition</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {userBadges.map((ub) => {
                 const badge = allBadges.find(b => b.id === ub.badgeId);
                 if (!badge) return null;
                 return (
                  <motion.div 
                    key={ub.id} 
                    whileHover={{ scale: 1.05 }}
                    className="p-6 rounded-[24px] border border-white/5 bg-[#0a0a0a] flex flex-col items-center gap-4 text-center group"
                  >
                    <div className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-full group-hover:border-primary/40 group-hover:text-primary transition-all">
                      <Star className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black uppercase tracking-tighter text-sm italic">{badge.name}</h4>
                      <p className="text-[9px] text-white/20 uppercase font-bold">{badge.description}</p>
                    </div>
                  </motion.div>
                 );
               })}
            </div>
          </motion.div>
        )}
      </main>
      
      {/* Global CSS for the outline effect */}
      <style>{`
        .outline-text-sm {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
          color: transparent;
        }
      `}</style>
    </div>
  );
}
