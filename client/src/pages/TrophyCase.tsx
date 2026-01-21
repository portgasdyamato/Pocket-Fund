import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Flame, Calendar, Star, Shield, Zap, Target, Award } from "lucide-react";
import type { Streak, UserQuest, Quest, StashTransaction, Goal, Transaction } from "@shared/schema";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1 }
};

export default function TrophyCase() {
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

  const totalStashed = stashTransactions
    .filter(t => t.type === 'stash')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const achievements = useMemo(() => [
    {
      id: "first-stash",
      icon: <Target className="w-8 h-8" />,
      title: "First Deployment",
      description: "Successfully stashed 1,000 units of capital.",
      points: 100,
      unlocked: totalStashed >= 1000,
      color: "text-primary"
    },
    {
      id: "week-streak",
      icon: <Flame className="w-8 h-8" />,
      title: "Resilience Protocol",
      description: "Maintained structural integrity for 7 consecutive days.",
      points: 250,
      unlocked: (streak?.saveStreak || 0) >= 7,
      color: "text-orange-400"
    },
    {
      id: "fight-master",
      icon: <Award className="w-8 h-8" />,
      title: "Analysis Elite",
      description: "Successfully decoded 10 tactical transactions.",
      points: 300,
      unlocked: transactions.filter(t => !!t.tag).length >= 10,
      color: "text-blue-400"
    },
    {
      id: "ick-slayer",
      icon: <Shield className="w-8 h-8" />,
      title: "Anomaly Purifier",
      description: "Neutralized 5 financial inefficiencies.",
      points: 200,
      unlocked: transactions.filter(t => t.tag === 'Ick').length >= 5,
      color: "text-red-400"
    },
    {
      id: "goal-crusher",
      icon: <Trophy className="w-8 h-8" />,
      title: "Prime Objective",
      description: "Reached maximum capacity of a primary savings goal.",
      points: 500,
      unlocked: goals.some(g => parseFloat(g.currentAmount) >= parseFloat(g.targetAmount)),
      color: "text-green-400"
    },
    {
      id: "quest-complete",
      icon: <Zap className="w-8 h-8" />,
      title: "Neural Sync",
      description: "Completed first cognitive literacy module.",
      points: 150,
      unlocked: userQuests.some(uq => {
          const q = allQuests.find(quest => quest.id === uq.questId);
          return uq.completed && q?.category === 'literacy';
      }),
      color: "text-purple-400"
    },
  ], [totalStashed, streak, transactions, goals, userQuests, allQuests]);

  const streakCalendar = Array.from({ length: 30 }, (_, i) => {
    const dayNumber = i + 1;
    const hasActivity = dayNumber <= (streak?.saveStreak || 0);
    return { day: dayNumber, hasActivity };
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <main className="max-w-7xl mx-auto px-6 py-20 space-y-16">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-6xl font-black tracking-tighter italic uppercase">Hall of <span className="text-primary">Commendations</span></h1>
          <p className="text-white/40 text-2xl font-medium max-w-2xl leading-relaxed">
            A permanent record of your <span className="text-white italic">strategic victories</span> in the financial theater.
          </p>
        </motion.div>

        {/* Tactical Streaks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div variants={item} initial="hidden" animate="show" className="lg:col-span-4 space-y-8">
            <Card className="p-8 rounded-[40px] glass-morphism border-orange-500/20 bg-orange-500/[0.03] group hover:bg-orange-500/[0.06] transition-all relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Flame className="w-32 h-32 text-orange-400" />
               </div>
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400 border border-orange-500/30">
                     <Flame className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-widest text-orange-400">Save Sequence</h3>
               </div>
               <div className="relative">
                  <span className="text-8xl font-black tracking-tighter font-mono italic">{streak?.saveStreak || 0}</span>
                  <span className="text-xs font-black uppercase tracking-widest text-white/30 ml-4">CYCLES</span>
               </div>
               <p className="mt-6 text-sm font-bold text-white/40 leading-relaxed italic">"Consistency is the ultimate weapon."</p>
            </Card>

            <Card className="p-8 rounded-[40px] glass-morphism border-primary/20 bg-primary/[0.03] group hover:bg-primary/[0.06] transition-all relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Calendar className="w-32 h-32 text-primary" />
               </div>
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                     <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-widest text-primary">Fight Protocol</h3>
               </div>
               <div className="relative">
                  <span className="text-8xl font-black tracking-tighter font-mono italic">{streak?.fightStreak || 0}</span>
                  <span className="text-xs font-black uppercase tracking-widest text-white/30 ml-4">CYCLES</span>
               </div>
               <p className="mt-6 text-sm font-bold text-white/40 leading-relaxed italic">"Analysis leads to absolute dominance."</p>
            </Card>
          </motion.div>

          {/* Activity Matrix */}
          <motion.div variants={item} initial="hidden" animate="show" className="lg:col-span-8">
            <Card className="h-full p-10 rounded-[50px] glass-morphism border-white/5 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
               <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                        <Star className="w-6 h-6" />
                     </div>
                     <h3 className="text-xl font-black uppercase tracking-[0.3em]">Temporal Activity Matrix</h3>
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/20">Last 30 Cycles</div>
               </div>

               <div className="grid grid-cols-5 sm:grid-cols-10 gap-4">
                  {streakCalendar.map((day) => (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: day.day * 0.02 }}
                      className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative group transition-all duration-300 ${
                        day.hasActivity
                          ? "bg-primary border border-primary/50 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                          : "bg-white/[0.03] border border-white/5"
                      }`}
                    >
                      <span className={`text-[10px] font-black font-mono transition-colors ${day.hasActivity ? 'text-white' : 'text-white/20'}`}>
                        {day.day.toString().padStart(2, '0')}
                      </span>
                      {day.hasActivity && (
                         <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full border-2 border-primary animate-pulse" />
                      )}
                    </motion.div>
                  ))}
               </div>
            </Card>
          </motion.div>
        </div>

        {/* Commendation Array */}
        <div className="space-y-12">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Trophy className="w-5 h-5" />
             </div>
             <h2 className="text-3xl font-black tracking-tight uppercase italic">Service Decorations</h2>
          </div>

          <motion.div 
             variants={container}
             initial="hidden"
             animate="show"
             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {achievements.map((achievement) => (
              <motion.div key={achievement.id} variants={item}>
                <Card
                  className={`group h-full p-8 rounded-[40px] glass-morphism border-white/5 transition-all duration-500 relative overflow-hidden flex flex-col ${
                    achievement.unlocked 
                      ? 'bg-white/[0.03] border-white/10 hover:border-primary/40' 
                      : 'opacity-30 grayscale cursor-not-allowed'
                  }`}
                >
                  <div className={`mb-8 w-16 h-16 rounded-[28%] flex items-center justify-center border border-white/10 bg-white/5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 ${achievement.unlocked ? achievement.color : 'text-white/20'}`}>
                    {achievement.icon}
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    <h3 className="text-xl font-black tracking-tight uppercase leading-none">{achievement.title}</h3>
                    <p className="text-sm font-medium text-white/40 leading-relaxed">
                       {achievement.description}
                    </p>
                  </div>

                  <div className="mt-10 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-primary fill-primary" />
                        <span className="text-xs font-black uppercase tracking-widest">{achievement.points} CREDITS</span>
                     </div>
                     {achievement.unlocked ? (
                       <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-[8px] font-black uppercase tracking-[0.2em] text-green-400">
                         SECURED
                       </div>
                     ) : (
                       <div className="text-[8px] font-black uppercase tracking-[0.2em] text-white/10">
                         LOCKED
                       </div>
                     )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
