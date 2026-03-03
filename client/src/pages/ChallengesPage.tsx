import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChallengeCard from "@/components/ChallengeCard";
import ThemeToggle from "@/components/ThemeToggle";
import StreakCounter from "@/components/StreakCounter";
import { ArrowLeft, Trophy, Swords, CheckCircle2, Zap, Target, Star, Brain } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Quest, UserQuest } from "@shared/schema";

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
  const [activeTab, setActiveTab] = useState("available");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: allQuests = [], isLoading: isLoadingQuests } = useQuery<Quest[]>({
    queryKey: ["/api/quests"],
  });

  const { data: userQuests = [] } = useQuery<UserQuest[]>({
    queryKey: ["/api/user/quests"],
  });

  const joinMutation = useMutation({
    mutationFn: async (questId: string) => {
      return await apiRequest(`/api/quests/${questId}/join`, "POST");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/quests"] });
      toast({ title: "Challenge Accepted!", description: "Check your dashboard for progress." });
      setActiveTab("active");
    }
  });

  const challenges = useMemo(() => {
    return allQuests
      .filter(q => q.category === 'challenge')
      .map(quest => {
        const userQuest = userQuests.find(uq => uq.questId === quest.id);
        
        return {
          id: quest.id,
          title: quest.title,
          description: quest.description,
          difficulty: (quest.difficulty as "Easy" | "Medium" | "Hard") || "Medium",
          points: quest.points,
          progress: userQuest?.completed ? 100 : 0,
          isActive: !!userQuest && !userQuest.completed,
          isCompleted: !!userQuest?.completed,
          icon: quest.icon
        };
      });
  }, [allQuests, userQuests]);

  const activeChallenges = challenges.filter(c => c.isActive);
  const availableChallenges = challenges.filter(c => !c.isActive && !c.isCompleted);
  const completedChallenges = challenges.filter(c => c.isCompleted);

  const stats = useMemo(() => {
    const xp = challenges
      .filter(c => c.isCompleted)
      .reduce((sum, c) => sum + c.points, 0);
    
    return {
      totalPoints: xp,
      completedCount: completedChallenges.length,
      activeCount: activeChallenges.length
    };
  }, [challenges, completedChallenges, activeChallenges]);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-3xl px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hover:bg-white/5 rounded-xl border border-white/5">
                <ArrowLeft className="w-5 h-5 text-white/40" />
              </Button>
            </Link>
            <div className="h-8 w-px bg-white/10 hidden md:block" />
            <h1 className="text-xl font-black tracking-tight flex items-center gap-2 uppercase tracking-widest">
              Financial <span className="text-primary italic">Missions</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
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
                   <p className="text-4xl font-black font-mono tracking-tighter text-primary">{stats.totalPoints}</p>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Mission Rewards (XP)</p>
                 </div>
                 <div className="space-y-2">
                   <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                   </div>
                   <p className="text-4xl font-black font-mono tracking-tighter text-green-500">{stats.completedCount}</p>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Missions Completed</p>
                 </div>
                 <div className="space-y-2">
                   <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
                        <Target className="w-6 h-6" />
                      </div>
                   </div>
                   <p className="text-4xl font-black font-mono tracking-tighter text-accent">{stats.activeCount}</p>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Active Operations</p>
                 </div>
               </div>
            </div>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-10">
              <TabsList className="bg-white/5 border border-white/10 p-1 h-14 rounded-2xl w-full max-w-lg">
                <TabsTrigger value="active" className="rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white transition-all h-full flex-1">
                  <Swords className="w-4 h-4 mr-2" />
                  In Progress
                </TabsTrigger>
                <TabsTrigger value="available" className="rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white transition-all h-full flex-1">
                  <Star className="w-4 h-4 mr-2" />
                  Available
                </TabsTrigger>
                <TabsTrigger value="completed" className="rounded-xl font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-white transition-all h-full flex-1">
                  <Trophy className="w-4 h-4 mr-2" />
                  History
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
                   className="grid gap-6 sm:grid-cols-2"
                >
                  {activeChallenges.map((challenge) => (
                    <motion.div key={challenge.id} variants={item}>
                      <ChallengeCard
                        {...challenge}
                        onAction={() => window.location.href = '/'}
                      />
                    </motion.div>
                  ))}
                  {activeChallenges.length === 0 && (
                    <div className="col-span-full py-20 text-center opacity-40">
                      <Target className="w-12 h-12 mx-auto mb-4" />
                      <p className="font-bold">No active missions. Pick one from 'Available'.</p>
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="available" className="focus-visible:outline-none">
                <motion.div 
                   key="available"
                   variants={container}
                   initial="hidden"
                   animate="show"
                   className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {availableChallenges.map((challenge, idx) => (
                    <motion.div key={challenge.id} variants={item} transition={{ delay: idx * 0.05 }}>
                      <ChallengeCard
                        {...challenge}
                        onAction={() => joinMutation.mutate(challenge.id)}
                      />
                    </motion.div>
                  ))}
                  {availableChallenges.length === 0 && !isLoadingQuests && (
                    <div className="col-span-full py-20 text-center opacity-40">
                      <Brain className="w-12 h-12 mx-auto mb-4" />
                      <p className="font-bold">All missions accepted or completed!</p>
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="completed" className="space-y-6 focus-visible:outline-none">
                <motion.div 
                   key="completed"
                   variants={container}
                   initial="hidden"
                   animate="show"
                   className="grid gap-6 sm:grid-cols-2"
                >
                  {completedChallenges.map((challenge) => (
                    <motion.div key={challenge.id} variants={item}>
                      <ChallengeCard
                        {...challenge}
                      />
                    </motion.div>
                  ))}
                  {completedChallenges.length === 0 && (
                    <div className="col-span-full py-20 text-center opacity-40">
                      <Trophy className="w-12 h-12 mx-auto mb-4" />
                      <p className="font-bold">No missions completed yet. Time to start your journey!</p>
                    </div>
                  )}
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
