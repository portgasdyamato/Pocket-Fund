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
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 20, stiffness: 100 } }
};

const outlineStyle = {
  WebkitTextStroke: '1px rgba(255,255,255,0.1)',
  color: 'transparent'
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
      title: "Foundation Stone",
      description: "Celebrating your first ₹1,000 Milestone. The longest journey starts with a single step.",
      points: 100,
      unlocked: totalStashed >= 1000,
      color: "#3b82f6",
      pattern: "radial-gradient(circle at 2px 2px, #3b82f615 1px, transparent 0)"
    },
    {
      id: "week-streak",
      icon: <Flame className="w-8 h-8" />,
      title: "Iron Will",
      description: "7 consecutive days of progress. Consistency is the hallmark of mastery.",
      points: 250,
      unlocked: (streak?.saveStreak || 0) >= 7,
      color: "#f97316",
      pattern: "radial-gradient(circle at 2px 2px, #f9731615 1px, transparent 0)"
    },
    {
      id: "fight-master",
      icon: <TrendingUp className="w-8 h-8" />,
      title: "The Architect",
      description: "10 transactions mapped. You're no longer just spending; you're designing your future.",
      points: 300,
      unlocked: transactions.filter(t => !!t.tag).length >= 10,
      color: "#a855f7",
      pattern: "radial-gradient(circle at 2px 2px, #a855f715 1px, transparent 0)"
    },
    {
      id: "smart-decisions",
      icon: <Heart className="w-8 h-8" />,
      title: "Noble Guardian",
      description: "Identified 5 wasteful habits. Protecting your wealth is as vital as earning it.",
      points: 200,
      unlocked: transactions.filter(t => t.tag === 'Ick').length >= 5,
      color: "#10b981",
      pattern: "radial-gradient(circle at 2px 2px, #10b98115 1px, transparent 0)"
    },
    {
      id: "goal-crusher",
      icon: <Trophy className="w-8 h-8" />,
      title: "Apex Achiever",
      description: "A major financial goal realized. You've proven that your dreams are within reach.",
      points: 500,
      unlocked: goals.some(g => parseFloat(g.currentAmount.toString()) >= parseFloat(g.targetAmount.toString())),
      color: "#eab308",
      pattern: "radial-gradient(circle at 2px 2px, #eab30815 1px, transparent 0)"
    },
    {
      id: "smart-learner",
      icon: <Zap className="w-8 h-8" />,
      title: "Wise Investor",
      description: "First wisdom cycle complete. Knowledge is the one asset that never depreciates.",
      points: 150,
      unlocked: userQuests.some(uq => {
          const q = allQuests.find(quest => quest.id === uq.questId);
          return uq.completed && q?.category === 'literacy';
      }),
      color: "#0ea5e9",
      pattern: "radial-gradient(circle at 2px 2px, #0ea5e915 1px, transparent 0)"
    },
  ], [totalStashed, streak, transactions, goals, userQuests, allQuests]);

  const activityData = Array.from({ length: 30 }, (_, i) => {
    const dayNumber = i + 1;
    const hasActivity = dayNumber <= (streak?.saveStreak || 0);
    return { day: dayNumber, hasActivity };
  });

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-primary/30 overflow-x-hidden font-sans">
      {/* Premium Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      <main className="max-w-7xl mx-auto px-6 py-24 space-y-32 relative z-10">
        
        {/* Header Section - Refined Typography */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-3">
             <div className="h-px w-12 bg-primary/40" />
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/60">The Grand Gallery</span>
          </div>
          <h1 className="text-7xl sm:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-4">
            Mastery<br />
            <span style={outlineStyle}>Archive</span>
          </h1>
          <p className="text-white/40 text-lg sm:text-xl font-medium max-w-xl leading-relaxed border-l-2 border-white/5 pl-6 italic">
            A curated record of your financial evolution. Every milestone here represents a step towards absolute freedom.
          </p>
        </motion.div>

        {/* Consistency Core - More Industrial/Clean */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <motion.div 
            variants={container} 
            initial="hidden" 
            animate="show" 
            className="lg:col-span-4 flex flex-col gap-6"
          >
            {[
              { label: "Savings Streak", val: streak?.saveStreak || 0, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/5", border: "border-orange-500/10" },
              { label: "Check-in History", val: streak?.fightStreak || 0, icon: Calendar, color: "text-primary", bg: "bg-primary/5", border: "border-primary/10" }
            ].map((stat, i) => (
              <Card key={i} className={`flex-1 p-10 rounded-none border-t-0 border-l-0 border-r-0 border-b-2 ${stat.border} bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 group relative overflow-hidden h-fit`}>
                <div className="flex flex-col gap-8 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">{stat.label}</span>
                    <stat.icon className={`w-5 h-5 ${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black tracking-tighter italic">{stat.val}</span>
                    <span className="text-xs font-bold text-white/10 uppercase italic">Days</span>
                  </div>
                </div>
                <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.bg} blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
              </Card>
            ))}
          </motion.div>

          {/* Activity Grid - More Minimalist */}
          <motion.div variants={item} initial="hidden" animate="show" className="lg:col-span-8">
            <Card className="h-full p-12 rounded-none border-2 border-white/5 bg-[#050505] flex flex-col gap-12 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-[0.02] -rotate-12 translate-x-12 translate-y-[-12] group-hover:translate-x-8 group-hover:translate-y-[-8] transition-transform duration-1000">
                  <Star className="w-64 h-64 text-white" />
               </div>
               
               <div className="flex items-end justify-between relative z-10">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">Discipline Log</h3>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Last 30 Calendar Days</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-10 w-10 flex items-center justify-center border border-white/5 bg-white/[0.02]">
                       <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <div className="h-10 w-10 flex items-center justify-center border border-white/5 bg-white/[0.02]">
                       <div className="w-2 h-2 rounded-full bg-white/5" />
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 relative z-10">
                  {activityData.map((day) => (
                    <motion.div
                      key={day.day}
                      whileHover={{ y: -2 }}
                      className={`aspect-square flex items-center justify-center transition-all duration-300 relative ${
                        day.hasActivity
                          ? "bg-primary/20 border-b-2 border-primary"
                          : "bg-white/[0.02] border-b-2 border-white/5"
                      }`}
                    >
                      <span className={`text-[10px] font-black ${day.hasActivity ? 'text-primary' : 'text-white/10'}`}>
                        {day.day.toString().padStart(2, '0')}
                      </span>
                      {day.hasActivity && (
                         <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-primary animate-pulse" />
                      )}
                    </motion.div>
                  ))}
               </div>
               
               <div className="pt-8 border-t border-white/5 flex items-center justify-between text-white/20">
                  <div className="flex items-center gap-4">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Efficiency Rating: {Math.round((streak?.saveStreak || 0) / 30 * 100)}%</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4" />
               </div>
            </Card>
          </motion.div>
        </div>

        {/* Milestone Collection - REDESIGNED TO FEEL HAND-CRAFTED */}
        <div className="space-y-16">
          <div className="flex items-center justify-between">
              <h2 className="text-4xl font-black tracking-tighter uppercase italic flex items-center gap-6">
                <span className="h-px w-20 bg-white/10 hidden sm:block" />
                Legacy Collection
              </h2>
              <div className="flex items-center gap-6">
                 <div className="h-px w-12 bg-white/5" />
                 <span className="text-sm font-black italic text-primary">{milestones.filter(m => m.unlocked).length} <span className="text-white/20">/ {milestones.length}</span></span>
              </div>
          </div>

          <motion.div 
             variants={container}
             initial="hidden"
             animate="show"
             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-2 border-white/5"
          >
            {milestones.map((milestone) => (
              <motion.div key={milestone.id} variants={item} className="group border border-white/5">
                <Card
                  className={`h-full p-12 rounded-none border-0 transition-all duration-500 relative overflow-hidden flex flex-col gap-10 bg-transparent ${
                    !milestone.unlocked && 'grayscale opacity-30 hover:opacity-50'
                  }`}
                  style={{ backgroundImage: milestone.pattern, backgroundSize: '16px 16px' }}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <div 
                      className="w-16 h-16 flex items-center justify-center transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 shadow-inner"
                      style={{ 
                        border: `1px solid ${milestone.unlocked ? milestone.color + '40' : '#ffffff10'}`,
                        background: `${milestone.unlocked ? milestone.color + '05' : 'transparent'}`,
                        color: milestone.unlocked ? milestone.color : '#ffffff20'
                      }}
                    >
                      {milestone.icon}
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20">Archive ID: {milestone.id.slice(0, 4)}</span>
                  </div>
                  
                  <div className="space-y-4 flex-1 relative z-10">
                    <h3 className="text-2xl font-black tracking-tight uppercase leading-none italic group-hover:text-primary transition-colors">{milestone.title}</h3>
                    <p className="text-xs font-semibold text-white/40 leading-relaxed max-w-[90%]">
                       {milestone.description}
                    </p>
                  </div>

                  <div className="pt-10 border-t border-white/5 flex items-end justify-between relative z-10">
                     <div className="space-y-1">
                        <p className="text-[7px] font-black uppercase tracking-[0.3em] text-white/20">Merit Value</p>
                        <p className="text-lg font-black italic">+{milestone.points} <span className="text-[10px] text-white/30 not-italic uppercase tracking-widest ml-1">XP</span></p>
                     </div>
                     {milestone.unlocked ? (
                       <Star className="w-5 h-5 fill-primary text-primary" />
                     ) : (
                       <div className="h-1.5 w-1.5 rounded-full bg-white/10" />
                     )}
                  </div>
                  
                  {/* Polish Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* System Badges - Sophisticated Horizontal Scroll or Grid */}
        <AnimatePresence>
          {userBadges.length > 0 && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="space-y-16 pb-20"
            >
              <h2 className="text-2xl font-black tracking-tighter uppercase italic text-white/20 flex items-center gap-4">
                 <Shield className="w-5 h-5" />
                 Special Commendations
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                 {userBadges.map((ub) => {
                   const badge = allBadges.find(b => b.id === ub.badgeId);
                   if (!badge) return null;
                   return (
                    <motion.div 
                      key={ub.id} 
                      whileHover={{ x: 5 }}
                      className="p-8 border border-white/5 bg-white/[0.01] flex items-center gap-6 group hover:border-primary/20 transition-all"
                    >
                      <div className="w-12 h-12 flex items-center justify-center border border-white/10 group-hover:border-primary/40 group-hover:text-primary transition-all">
                        <Star className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-black uppercase tracking-tighter text-sm italic leading-none">{badge.name}</h4>
                        <p className="text-[8px] text-white/20 uppercase tracking-widest leading-none">{badge.description}</p>
                      </div>
                    </motion.div>
                   );
                 })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Absolute Bottom Decor */}
      <footer className="py-12 border-t border-white/5 text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.8em] text-white/5">Your Legacy is Still Being Written</p>
      </footer>
    </div>
  );
}
