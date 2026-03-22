import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChallengeCard from "@/components/ChallengeCard";
import { ArrowLeft, Trophy, Swords, CheckCircle2, Zap, Target, Star, Brain, Shield } from "lucide-react";
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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
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
      toast({ title: "OPERATIONAL UPDATE", description: "Mission parameters accepted and deployed." });
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
    <div className="min-h-screen bg-[#020205] text-white selection:bg-blue-500/30">
      {/* Mesh Background */}
      <div className="fixed inset-0 z-0 bg-mesh opacity-20 pointer-events-none" />

      {/* Pro Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.03] bg-[#020205]/60 backdrop-blur-2xl px-6 h-20">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/">
              <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-colors click-scale">
                <ArrowLeft className="w-5 h-5 text-white/60" />
              </button>
            </Link>
            <div className="h-6 w-px bg-white/10" />
            <h1 className="text-sm font-black tracking-[0.3em] uppercase flex items-center gap-3">
              Operational <span className="text-blue-500">Missions</span>
            </h1>
          </div>
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
             <Shield className="w-3.5 h-3.5 text-blue-400" />
             <span className="text-[10px] font-black tracking-widest text-blue-400">ENCRYPTED COMS</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-16">
          
          {/* Elite Performance Console */}
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { icon: Zap, value: stats.totalPoints, label: "ACCUMULATED XP", color: "text-blue-500", bg: "bg-blue-500/5", border: "border-blue-500/20" },
               { icon: CheckCircle2, value: stats.completedCount, label: "MISSIONS COMPLETED", color: "text-emerald-500", bg: "bg-emerald-500/5", border: "border-emerald-500/20" },
               { icon: Target, value: stats.activeCount, label: "ACTIVE OPS", color: "text-cyan-500", bg: "bg-cyan-500/5", border: "border-cyan-500/20" }
             ].map((stat, i) => (
                <div key={i} className={`p-8 rounded-[32px] glass-card border ${stat.border} relative overflow-hidden group`}>
                   <div className="flex flex-col items-center text-center relative z-10">
                      <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} mb-6 border ${stat.border}`}>
                         <stat.icon className="w-7 h-7" />
                      </div>
                      <p className={`text-5xl font-black tracking-tighter tabular-nums ${stat.color} mb-2`}>{stat.value}</p>
                      <p className="text-[10px] font-black tracking-[0.25em] text-white/20 uppercase">{stat.label}</p>
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
             ))}
          </motion.div>

          {/* Mission Deployment Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-16">
              <TabsList className="bg-white/[0.03] border border-white/10 p-1.5 h-16 rounded-[24px] w-full max-w-xl">
                {[
                  { id: "active", label: "In Progress", icon: Swords },
                  { id: "available", label: "Available", icon: Star },
                  { id: "completed", label: "History", icon: Trophy }
                ].map(tab => (
                  <TabsTrigger key={tab.id} value={tab.id} className="rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] data-[state=active]:bg-white data-[state=active]:text-black transition-all h-full flex-1">
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <AnimatePresence mode="wait">
              <TabsContent value="active" className="focus-visible:outline-none">
                <motion.div key="active" variants={container} initial="hidden" animate="show" className="grid gap-8 sm:grid-cols-2">
                  {activeChallenges.map((challenge) => (
                    <motion.div key={challenge.id} variants={item}>
                      <ChallengeCard {...challenge} onAction={() => window.location.href = '/'} />
                    </motion.div>
                  ))}
                  {activeChallenges.length === 0 && (
                    <div className="col-span-full py-32 text-center">
                      <Target className="w-16 h-16 mx-auto mb-6 text-white/10" />
                      <p className="font-black text-white/20 uppercase tracking-widest text-xs">No active operational missions detected.</p>
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="available" className="focus-visible:outline-none">
                <motion.div key="available" variants={container} initial="hidden" animate="show" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {availableChallenges.map((challenge) => (
                    <motion.div key={challenge.id} variants={item}>
                      <ChallengeCard {...challenge} onAction={() => joinMutation.mutate(challenge.id)} />
                    </motion.div>
                  ))}
                  {availableChallenges.length === 0 && !isLoadingQuests && (
                    <div className="col-span-full py-32 text-center">
                      <Brain className="w-16 h-16 mx-auto mb-6 text-white/10" />
                      <p className="font-black text-white/20 uppercase tracking-widest text-xs">All missions globally accepted.</p>
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="completed" className="focus-visible:outline-none">
                <motion.div key="completed" variants={container} initial="hidden" animate="show" className="grid gap-8 sm:grid-cols-2">
                  {completedChallenges.map((challenge) => (
                    <motion.div key={challenge.id} variants={item}>
                      <ChallengeCard {...challenge} />
                    </motion.div>
                  ))}
                  {completedChallenges.length === 0 && (
                    <div className="col-span-full py-32 text-center">
                      <Trophy className="w-16 h-16 mx-auto mb-6 text-white/10" />
                      <p className="font-black text-white/20 uppercase tracking-widest text-xs">Mission history is empty.</p>
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

