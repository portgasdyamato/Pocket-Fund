import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  PlusCircle, 
  Target, 
  MessageCircle, 
  TrendingUp, 
  Wallet, 
  Plus, 
  Trophy, 
  Star,
  Activity,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  TrendingDown
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import HealthScoreCard from "@/components/HealthScoreCard";
import QuickActionButton from "@/components/QuickActionButton";
import ChallengeCard from "@/components/ChallengeCard";
import ExpenseItem from "@/components/ExpenseItem";
import AchievementBadge from "@/components/AchievementBadge";
import AddExpenseModal from "@/components/AddExpenseModal";
import ChallengeDetailsModal from "@/components/ChallengeDetailsModal";
import ChallengeCelebration from "@/components/ChallengeCelebration";
import type { Transaction, Quest, UserQuest, Badge, UserBadge } from "@shared/schema";
import { format } from "date-fns";

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
  show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [celebratingChallenge, setCelebratingChallenge] = useState<any>(null);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    retry: false,
  });

  const { data: allQuests = [] } = useQuery<Quest[]>({
    queryKey: ["/api/quests"],
  });

  const { data: userQuests = [] } = useQuery<UserQuest[]>({
    queryKey: ["/api/user/quests"],
  });

  const { data: allBadges = [] } = useQuery<Badge[]>({
    queryKey: ["/api/badges"],
  });

  const { data: userBadges = [] } = useQuery<UserBadge[]>({
    queryKey: ["/api/user/badges"],
  });

  const { data: stashTransactions = [] } = useQuery<any[]>({
    queryKey: ["/api/stash"],
  });

  const topUpMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/wallet/add", "POST", {
        amount: topUpAmount,
      });
    },
    onSuccess: async (response) => {
      const data = await response.json();
      queryClient.setQueryData(["/api/auth/user"], (old: any) => ({
        ...old,
        walletBalance: data.newBalance
      }));
      setIsTopUpOpen(false);
      setTopUpAmount("");
      toast({
        title: "Success",
        description: `Added ₹${topUpAmount} to your wallet`,
      });
    }
  });

  const completeQuestMutation = useMutation({
    mutationFn: async (questId: string) => {
      return await apiRequest(`/api/quests/${questId}/complete`, "POST");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/quests"] });
    },
  });

  const challenges = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    return allQuests
      .filter(q => q.category === 'challenge')
      .slice(0, 6)
      .map(quest => {
        const userQuest = userQuests.find(uq => uq.questId === quest.id);
        let target = 100;
        let type = 'count';
        try {
          const content = JSON.parse(quest.content);
          if (content.target) target = content.target;
          if (content.type) type = content.type;
        } catch (e) {}

        const completedThisWeek = !!(userQuest?.completed && 
          userQuest.completedAt && 
          new Date(userQuest.completedAt).getTime() >= startOfWeek.getTime());

        let calculatedProgress = 0;
        if (completedThisWeek) {
          calculatedProgress = 100;
        } else {
          const weeklyStashed = stashTransactions
            .filter(t => t.type === 'stash' && new Date(t.createdAt).getTime() >= startOfWeek.getTime())
            .reduce((sum, t) => sum + parseFloat(t.amount || "0"), 0);

          if (type === 'save') {
             calculatedProgress = Math.min(100, Math.round((weeklyStashed / target) * 100));
          } else if (quest.title === "The 1% Rule") {
             const maxStash = Math.max(0, ...stashTransactions
               .filter(t => t.type === 'stash' && new Date(t.createdAt).getTime() >= startOfWeek.getTime())
               .map(t => parseFloat(t.amount)));
             calculatedProgress = Math.min(100, Math.round((maxStash / 50) * 100));
          }
        }

        return {
          id: quest.id,
          title: quest.title,
          description: quest.description,
          difficulty: (quest.difficulty as "Easy" | "Medium" | "Hard") || "Medium",
          points: quest.points,
          progress: calculatedProgress,
          target: target,
          timeRemaining: 'Ongoing', 
          isActive: !!userQuest && !userQuest.completed && !completedThisWeek,
          isCompleted: !!completedThisWeek,
          type: type,
          icon: quest.icon
        };
      });
  }, [allQuests, userQuests, stashTransactions]);

  const triggeredCelebrations = useRef<string[]>([]);

  useEffect(() => {
    if (celebratingChallenge) return;
    challenges.forEach(c => {
      if (c.progress >= 100 && c.isActive && !c.isCompleted && !triggeredCelebrations.current.includes(c.id)) {
        triggeredCelebrations.current.push(c.id);
        completeQuestMutation.mutate(c.id);
        setCelebratingChallenge(c);
      }
    });
  }, [challenges, celebratingChallenge]);

  const { healthScore, totalXP, message } = useMemo(() => {
    const xp = userQuests
      .filter(uq => uq.completed)
      .reduce((sum, uq) => {
        const quest = allQuests.find(q => q.id === uq.questId);
        return sum + (quest?.points || 0);
      }, 0);

    let score = 50;
    // Add real logic for health score here based on user data
    if (userQuests.length > 0) score += 10;
    
    return { healthScore: Math.min(100, score), totalXP: xp, message: "Your financial health is stable. Keep pushing!" };
  }, [userQuests, allQuests]);

  const recentAchievements = useMemo(() => {
    const wins: any[] = [];
    userBadges.forEach(ub => {
      const badge = allBadges.find(b => b.id === ub.badgeId);
      if (badge) wins.push({ id: ub.id, title: badge.name, description: badge.description, type: 'badge', date: ub.earnedAt });
    });
    userQuests.forEach(uq => {
      if (uq.completed) {
        const quest = allQuests.find(q => q.id === uq.questId);
        if (quest) wins.push({ id: uq.id, title: quest.title, description: uq.completionNote || "Challenge crushed!", points: quest.points, type: 'challenge', date: uq.completedAt });
      }
    });
    return wins.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3).map(w => ({
      id: w.id,
      title: w.title,
      description: w.description,
      points: w.points || 0,
      type: 'trophy' as const
    }));
  }, [userBadges, allBadges, userQuests, allQuests]);

  const recentExpenses = transactions.slice(0, 5).map(t => ({
    id: t.id,
    category: t.category || 'Other',
    description: t.description,
    amount: parseFloat(t.amount),
    date: format(new Date(t.date), 'MMM d'),
  }));

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30">
      <main className="container mx-auto px-6 py-10 space-y-10 max-w-7xl">
        
        {/* Top Section: Profile & Global Metrics */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent p-[2px] premium-shadow">
              <div className="w-full h-full rounded-[14px] bg-[#050505] flex items-center justify-center overflow-hidden">
                <img src={user?.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.firstName || 'Soldier'}!</h2>
              <div className="flex items-center gap-2 text-white/40 mt-1">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Verified Financial Status</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end mr-4">
              <div className="text-xs font-bold text-white/30 tracking-widest uppercase mb-1">Total Experience</div>
              <div className="flex items-center gap-2">
                <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-black flex items-center gap-1 border border-primary/30">
                  <Star className="w-3.5 h-3.5 fill-primary" />
                  {totalXP} XP
                </div>
              </div>
            </div>
            <div className="h-10 w-[1px] bg-white/10" />
            <Button 
              onClick={() => setIsAddExpenseOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 h-12 font-bold click-scale premium-shadow"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Log Expense
            </Button>
          </div>
        </motion.div>

        {/* Dashboard Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Left Column (8 units) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Wallet & Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={item}>
                <Card className="glass-morphism border-white/5 p-8 h-full relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                        <Wallet className="w-6 h-6 text-primary" />
                      </div>
                      <Dialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:bg-white/5 text-white/40 hover:text-white">
                            <Plus className="w-6 h-6" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-morphism border-white/10 text-white">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Refill Energy</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6 pt-6">
                            <div className="space-y-3">
                              <Label className="text-sm font-bold text-white/60">Amount to Add (₹)</Label>
                              <Input 
                                type="number" 
                                className="bg-white/5 border-white/10 h-14 text-xl font-bold focus:border-primary transition-all"
                                placeholder="0.00"
                                value={topUpAmount}
                                onChange={(e) => setTopUpAmount(e.target.value)}
                              />
                            </div>
                            <Button 
                              className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90" 
                              onClick={() => topUpMutation.mutate()}
                              disabled={topUpMutation.isPending || !topUpAmount}
                            >
                              Confirm Energy Boost
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="mt-auto">
                      <p className="text-white/40 text-sm font-bold tracking-widest uppercase mb-1">Available Funds</p>
                      <div className="text-5xl font-black tracking-tighter">
                        ₹{parseFloat(user?.walletBalance?.toString() || "0").toLocaleString('en-IN')}
                      </div>
                      <div className="flex items-center gap-2 mt-4 text-green-400 text-sm font-bold">
                        <ArrowUpRight className="w-4 h-4" />
                        <span>+12.5% vs last week</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <HealthScoreCard score={healthScore} message={message} />
              </motion.div>
            </div>

            {/* Quick Actions Grid */}
            <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Zap, label: "Fight Plan", path: "/fight", color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" },
                { icon: TrendingUp, label: "Glow Up", path: "/glow-up", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
                { icon: MessageCircle, label: "AI Coach", path: "/coach", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
                { icon: Activity, label: "Analytics", path: "/expenses", color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20" }
              ].map((action, i) => (
                <button 
                  key={i}
                  onClick={() => setLocation(action.path)}
                  className={`flex flex-col items-center justify-center p-6 rounded-3xl border ${action.border} ${action.bg} hover:scale-105 transition-all duration-300 click-scale group`}
                >
                  <action.icon className={`w-8 h-8 ${action.color} mb-3 group-hover:scale-110 transition-transform`} />
                  <span className="text-sm font-bold text-white/80">{action.label}</span>
                </button>
              ))}
            </motion.div>

            {/* Quests Section */}
            <motion.div variants={item}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-primary rounded-full" />
                  <h3 className="text-2xl font-bold tracking-tight">Active Quests</h3>
                </div>
                <Button variant="ghost" className="text-white/40 hover:text-white" onClick={() => setLocation('/challenges')}>
                  View Mission Log
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenges.length > 0 ? (
                  challenges.map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      {...challenge}
                      onAction={() => {
                        setSelectedChallenge(challenge);
                        setIsChallengeModalOpen(true);
                      }}
                    />
                  ))
                ) : (
                  <div className="col-span-2 glass-morphism border-white/5 p-12 text-center rounded-3xl">
                    <Trophy className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <p className="text-white/40 font-medium">No active missions available.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column (4 units) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Recent Wins */}
            <motion.div variants={item}>
              <Card className="glass-morphism border-white/5 p-6 h-full">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-accent" />
                  Recent Battles
                </h3>
                <div className="space-y-4">
                  {recentAchievements.length > 0 ? (
                    recentAchievements.map((win) => (
                      <div key={win.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                        <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/20 group-hover:scale-110 transition-transform">
                          <Star className="w-6 h-6 text-accent fill-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm truncate">{win.title}</div>
                          <div className="text-xs text-white/40 mt-0.5">+{win.points} XP earned</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <Star className="w-10 h-10 text-white/5 mx-auto mb-4" />
                      <p className="text-sm text-white/30">Your trophy case is empty.<br/>Win some battles!</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Activity Logger */}
            <motion.div variants={item}>
              <Card className="glass-morphism border-white/5 p-6 min-h-[400px]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Mission Log</h3>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" onClick={() => setLocation('/expenses')}>
                    Analyze
                  </Button>
                </div>
                <div className="space-y-3">
                  {isLoadingTransactions ? (
                    <div className="flex flex-col gap-4">
                      {[1, 2, 3].map(i => <div key={i} className="h-16 w-full bg-white/5 rounded-2xl animate-pulse" />)}
                    </div>
                  ) : recentExpenses.length > 0 ? (
                    recentExpenses.map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${expense.category === 'Ick' ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-500'}`}>
                            {expense.category === 'Ick' ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white/90">{expense.description}</div>
                            <div className="text-xs text-white/40">{expense.date} • {expense.category}</div>
                          </div>
                        </div>
                        <div className="text-sm font-black text-white">₹{expense.amount}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 opacity-40">
                      <Activity className="w-10 h-10 mx-auto mb-4" />
                      <p className="text-sm">No recent activity detected.</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Modals & Celebrations */}
      <AnimatePresence>
        {isAddExpenseOpen && (
          <AddExpenseModal
            open={isAddExpenseOpen}
            onOpenChange={setIsAddExpenseOpen}
          />
        )}
      </AnimatePresence>
      
      <ChallengeDetailsModal 
        isOpen={isChallengeModalOpen}
        onClose={() => setIsChallengeModalOpen(false)}
        challenge={selectedChallenge}
      />

      <ChallengeCelebration
        isOpen={!!celebratingChallenge}
        onClose={() => setCelebratingChallenge(null)}
        challengeName={celebratingChallenge?.title}
        points={celebratingChallenge?.points}
      />
    </div>
  );
}

