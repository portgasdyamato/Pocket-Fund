import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChallengeCard from "@/components/ChallengeCard";
import { ArrowLeft, Trophy, Swords, CheckCircle2, Zap, Target, Star, Brain, Shield, BarChart3, Fingerprint, Activity, ShieldCheck, ZapIcon, Globe, TargetIcon, MousePointer2 } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Quest, UserQuest } from "@shared/schema";
import { Card } from "@/components/ui/card";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
    <div className="section-container py-20">
      <div className="flex flex-col gap-12">
        
        {/* Cinematic Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
                Operational Missions
              </div>
              <div className="h-[1px] w-20 bg-white/5" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-[-0.05em] leading-[0.8] mb-4 text-white uppercase italic">
              GLOBAL <br />
              <span className="text-gradient-blue">SWORDS.</span>
            </h1>
            <p className="text-white/30 text-lg font-medium tracking-tight max-w-xl">
              Execute high-impact financial maneuvers to accelerate your capital velocity tier.
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
             <div className="px-8 py-4 rounded-[28px] glass-frost border-blue-500/20 flex items-center gap-4 shadow-xl">
                <Shield className="w-6 h-6 text-blue-500" />
                <span className="text-[10px] font-black tracking-[0.4em] text-blue-400 uppercase">Encrypted Mission Hub</span>
             </div>
          </div>
        </motion.div>

        {/* Elite Performance Console */}
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-10">
           {[
             { icon: Zap, value: stats.totalPoints, label: "ACCUMULATED XP", color: "text-blue-500", bg: "bg-blue-600/10", border: "border-blue-500/20" },
             { icon: CheckCircle2, value: stats.completedCount, label: "MISSIONS COMPLETED", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
             { icon: Target, value: stats.activeCount, label: "ACTIVE OPS", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" }
           ].map((stat, i) => (
              <Card key={i} className={`p-10 rounded-[48px] glass-frost border-white/5 relative overflow-hidden group shadow-2xl transition-all duration-700 hover-lift`}>
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 blur-[80px] rounded-full -mr-24 -mt-24 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex flex-col items-center text-center relative z-10">
                  <div className={`w-18 h-18 rounded-[28px] ${stat.bg} ${stat.color} flex items-center justify-center border ${stat.border} mb-8 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                     <stat.icon className="w-9 h-9" />
                  </div>
                  <p className={`text-6xl font-black italic tracking-tighter tabular-nums ${stat.color} mb-3 drop-shadow-2xl`}>{stat.value}</p>
                  <p className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">{stat.label}</p>
                </div>
              </Card>
           ))}
        </motion.div>

        {/* Mission Deployment Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full pb-24">
          <div className="flex justify-center mb-16">
            <TabsList className="bg-white/[0.03] border border-white/10 p-2 h-20 rounded-[32px] w-full max-w-2xl shadow-2xl backdrop-blur-3xl">
              {[
                { id: "active", label: "In Progress", icon: Swords },
                { id: "available", label: "Available", icon: Star },
                { id: "completed", label: "Registry", icon: Trophy }
              ].map(tab => (
                <TabsTrigger key={tab.id} value={tab.id} className="rounded-[24px] font-black uppercase tracking-[0.3em] text-[10px] data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-2xl transition-all h-full flex-1 gap-3">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            <TabsContent value="active" className="focus-visible:outline-none">
              <motion.div key="active" variants={container} initial="hidden" animate="show" className="grid gap-10 sm:grid-cols-2">
                {activeChallenges.map((challenge) => (
                  <motion.div key={challenge.id} variants={item}>
                    <ChallengeCard {...challenge} onAction={() => window.location.href = '/'} />
                  </motion.div>
                ))}
                {activeChallenges.length === 0 && (
                  <div className="col-span-full py-40 text-center border-2 border-dashed border-white/5 rounded-[56px] opacity-20">
                    <Target className="w-20 h-20 mx-auto mb-8 text-white/10" />
                    <p className="font-black text-white/20 uppercase tracking-[0.5em] text-lg">No active operational missions detected.</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="available" className="focus-visible:outline-none">
              <motion.div key="available" variants={container} initial="hidden" animate="show" className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {availableChallenges.map((challenge) => (
                  <motion.div key={challenge.id} variants={item}>
                    <ChallengeCard {...challenge} onAction={() => joinMutation.mutate(challenge.id)} />
                  </motion.div>
                ))}
                {availableChallenges.length === 0 && !isLoadingQuests && (
                  <div className="col-span-full py-40 text-center border-2 border-dashed border-white/5 rounded-[56px] opacity-20">
                    <Brain className="w-20 h-20 mx-auto mb-8 text-white/10" />
                    <p className="font-black text-white/20 uppercase tracking-[0.5em] text-lg">All missions globally accepted.</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="completed" className="focus-visible:outline-none">
              <motion.div key="completed" variants={container} initial="hidden" animate="show" className="grid gap-10 sm:grid-cols-2">
                {completedChallenges.map((challenge) => (
                  <motion.div key={challenge.id} variants={item}>
                    <ChallengeCard {...challenge} />
                  </motion.div>
                ))}
                {completedChallenges.length === 0 && (
                  <div className="col-span-full py-40 text-center border-2 border-dashed border-white/5 rounded-[56px] opacity-20">
                    <Trophy className="w-20 h-20 mx-auto mb-8 text-white/10" />
                    <p className="font-black text-white/20 uppercase tracking-[0.5em] text-lg">Mission history archive is empty.</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}
