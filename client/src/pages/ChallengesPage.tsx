import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChallengeCard from "@/components/ChallengeCard";
import ThemeToggle from "@/components/ThemeToggle";
import StreakCounter from "@/components/StreakCounter";
import { ArrowLeft, Trophy, Swords, CheckCircle2, Zap, Target, Star } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

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
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 }
};

export default function ChallengesPage() {
  const [activeTab, setActiveTab] = useState("active");

  const activeChallenges = [
    {
      id: '1',
      title: 'No Coffee Shop Week',
      difficulty: 'Medium' as const,
      points: 500,
      progress: 42,
      timeRemaining: '3 days left',
      isActive: true
    },
    {
      id: '2',
      title: 'Save $100 This Week',
      difficulty: 'Easy' as const,
      points: 250,
      progress: 65,
      timeRemaining: '2 days left',
      isActive: true
    },
  ];

  const availableChallenges = [
    {
      id: '3',
      title: 'Track Every Expense',
      difficulty: 'Hard' as const,
      points: 1000,
      progress: 0,
      timeRemaining: '1 week',
      isActive: false
    },
    {
      id: '4',
      title: 'Cook 5 Meals at Home',
      difficulty: 'Medium' as const,
      points: 400,
      progress: 0,
      timeRemaining: '1 week',
      isActive: false
    },
    {
      id: '5',
      title: 'No Impulse Buys',
      difficulty: 'Hard' as const,
      points: 750,
      progress: 0,
      timeRemaining: '3 days',
      isActive: false
    },
    {
      id: '6',
      title: 'Save $50 This Week',
      difficulty: 'Easy' as const,
      points: 200,
      progress: 0,
      timeRemaining: '1 week',
      isActive: false
    },
  ];

  const completedChallenges = [
    {
      id: '7',
      title: 'First Week Logging',
      difficulty: 'Easy' as const,
      points: 100,
      progress: 100,
      isActive: false
    },
    {
      id: '8',
      title: 'Budget Setup Pro',
      difficulty: 'Medium' as const,
      points: 300,
      progress: 100,
      isActive: false
    },
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
            <h1 className="text-xl font-black tracking-tight flex items-center gap-2 uppercase tracking-widest">
              Engagement <span className="text-primary italic">Matrix</span>
            </h1>
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
          {/* Performance Overview */}
          <motion.div variants={item}>
            <div className="p-8 rounded-[40px] glass-morphism border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-[0.02]">
                  <Trophy className="w-64 h-64 text-primary" />
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
                 <div className="space-y-2">
                   <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <Zap className="w-6 h-6" />
                      </div>
                   </div>
                   <p className="text-4xl font-black font-mono tracking-tighter text-primary">2,450</p>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Neural Credits Earned</p>
                 </div>
                 <div className="space-y-2">
                   <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                   </div>
                   <p className="text-4xl font-black font-mono tracking-tighter text-secondary">08</p>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Operations Completed</p>
                 </div>
                 <div className="space-y-2">
                   <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
                        <Target className="w-6 h-6" />
                      </div>
                   </div>
                   <p className="text-4xl font-black font-mono tracking-tighter text-accent">02</p>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Active Missions</p>
                 </div>
               </div>
            </div>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-10">
              <TabsList className="bg-white/5 border border-white/10 p-1 h-14 rounded-2xl w-full max-w-lg">
                <TabsTrigger value="active" className="rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white transition-all h-full">
                  <Swords className="w-4 h-4 mr-2" />
                  In Progress
                </TabsTrigger>
                <TabsTrigger value="available" className="rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white transition-all h-full">
                  <Star className="w-4 h-4 mr-2" />
                  Deployment Ready
                </TabsTrigger>
                <TabsTrigger value="completed" className="rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white transition-all h-full">
                  <Trophy className="w-4 h-4 mr-2" />
                  Archived Wins
                </TabsTrigger>
              </TabsList>
            </div>

            <AnimatePresence mode="wait">
              <TabsContent value="active" className="space-y-6 focus-visible:outline-none">
                <motion.div 
                   key="active"
                   variants={container}
                   initial="hidden"
                   animate="show"
                   className="space-y-4"
                >
                  {activeChallenges.map((challenge) => (
                    <motion.div key={challenge.id} variants={item}>
                      <ChallengeCard
                        {...challenge}
                        isCompleted={challenge.progress >= 100}
                        onAction={() => console.log(`Continue challenge ${challenge.id}`)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>

              <TabsContent value="available" className="focus-visible:outline-none">
                <motion.div 
                   key="available"
                   variants={container}
                   initial="hidden"
                   animate="show"
                   className="grid gap-6 sm:grid-cols-2"
                >
                  {availableChallenges.map((challenge, idx) => (
                    <motion.div key={challenge.id} variants={item} transition={{ delay: idx * 0.05 }}>
                      <ChallengeCard
                        {...challenge}
                        isCompleted={false}
                        onAction={() => console.log(`Start challenge ${challenge.id}`)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>

              <TabsContent value="completed" className="space-y-6 focus-visible:outline-none">
                <motion.div 
                   key="completed"
                   variants={container}
                   initial="hidden"
                   animate="show"
                   className="space-y-4"
                >
                  {completedChallenges.map((challenge) => (
                    <motion.div key={challenge.id} variants={item}>
                      <ChallengeCard
                        {...challenge}
                        isCompleted={true}
                        onAction={() => console.log(`View challenge ${challenge.id}`)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
