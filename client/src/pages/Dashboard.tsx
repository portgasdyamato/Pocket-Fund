import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, Target, MessageCircle, TrendingUp, Wallet, Plus, Trophy, Star, Activity, ShieldCheck, Zap, ArrowUpRight, TrendingDown, Coffee, Car, ShoppingBag, Ticket, FileText, ChevronRight, CreditCard, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import HealthScoreCard from "@/components/HealthScoreCard";
import ChallengeCard from "@/components/ChallengeCard";
import AddExpenseModal from "@/components/AddExpenseModal";
import ChallengeDetailsModal from "@/components/ChallengeDetailsModal";
import ChallengeCelebration from "@/components/ChallengeCelebration";
import type { Transaction, Quest, UserQuest, Badge, UserBadge, Goal } from "@shared/schema";
import { format } from "date-fns";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

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

  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery<Transaction[]>({ queryKey: ["/api/transactions"], retry: false });
  const { data: allQuests = [] } = useQuery<Quest[]>({ queryKey: ["/api/quests"] });
  const { data: userQuests = [] } = useQuery<UserQuest[]>({ queryKey: ["/api/user/quests"] });
  const { data: allBadges = [] } = useQuery<Badge[]>({ queryKey: ["/api/badges"] });
  const { data: userBadges = [] } = useQuery<UserBadge[]>({ queryKey: ["/api/user/badges"] });
  const { data: stashTransactions = [] } = useQuery<any[]>({ queryKey: ["/api/stash"] });
  const { data: goals = [] } = useQuery<Goal[]>({ queryKey: ["/api/goals"] });

  const topUpMutation = useMutation({
    mutationFn: async () => apiRequest("/api/wallet/add", "POST", { amount: topUpAmount }),
    onSuccess: async (response) => {
      const data = await response.json();
      queryClient.setQueryData(["/api/auth/user"], (old: any) => ({ ...old, walletBalance: data.newBalance }));
      setIsTopUpOpen(false); setTopUpAmount("");
      toast({ title: "Funds Added", description: `₹${parseFloat(topUpAmount).toLocaleString('en-IN')} successfully added to your wallet` });
    }
  });

  const completeQuestMutation = useMutation({
    mutationFn: async (questId: string) => apiRequest(`/api/quests/${questId}/complete`, "POST"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/user/quests"] }),
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
        let target = 100; let type = 'count';
        try { const content = JSON.parse(quest.content); if (content.target) target = content.target; if (content.type) type = content.type; } catch (e) {}
        const completedThisWeek = !!(userQuest?.completed && userQuest.completedAt && new Date(userQuest.completedAt).getTime() >= startOfWeek.getTime());
        let calculatedProgress = 0;
        if (completedThisWeek) calculatedProgress = 100;
        else {
          const weeklyStashed = stashTransactions.filter(t => t.type === 'stash' && new Date(t.createdAt).getTime() >= startOfWeek.getTime()).reduce((sum, t) => sum + parseFloat(t.amount || "0"), 0);
          if (type === 'save') calculatedProgress = Math.min(100, Math.round((weeklyStashed / target) * 100));
          else if (quest.title === "The 1% Rule") {
             const maxStash = Math.max(0, ...stashTransactions.filter(t => t.type === 'stash' && new Date(t.createdAt).getTime() >= startOfWeek.getTime()).map(t => parseFloat(t.amount)));
             calculatedProgress = Math.min(100, Math.round((maxStash / 50) * 100));
          }
        }
        return { id: quest.id, title: quest.title, description: quest.description, difficulty: (quest.difficulty as any) || "Medium", points: quest.points, progress: calculatedProgress, target: target, timeRemaining: 'Ongoing', isActive: !!userQuest && !userQuest.completed && !completedThisWeek, isCompleted: !!completedThisWeek, type: type, icon: quest.icon };
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
    const xp = userQuests.filter(uq => uq.completed).reduce((sum, uq) => sum + (allQuests.find(q => q.id === uq.questId)?.points || 0), 0);
    let score = 30;
    if (goals.length > 0) {
      const completionRate = goals.filter(g => g.completed).length / goals.length;
      score += completionRate * 15;
      const totalTarget = goals.reduce((sum, g) => sum + parseFloat(g.targetAmount || "0"), 0);
      const totalCurrent = goals.reduce((sum, g) => sum + parseFloat(g.currentAmount || "0"), 0);
      if (totalTarget > 0) score += (totalCurrent / totalTarget) * 10;
    }
    const stashed = stashTransactions.filter(t => t.type === 'stash').reduce((acc, t) => acc + parseFloat(t.amount || "0"), 0);
    const withdrawn = stashTransactions.filter(t => t.type === 'withdraw' || t.type === 'claim').reduce((acc, t) => acc + parseFloat(t.amount || "0"), 0);
    const netSavings = stashed - withdrawn;
    if (netSavings > 0) score += Math.min(25, (netSavings / 1000) * 5);
    if (userQuests.length > 0) score += (userQuests.filter(uq => uq.completed).length / userQuests.length) * 20;
    const balance = parseFloat(user?.walletBalance?.toString() || "0");
    if (balance > 500) score += 10; else if (balance > 100) score += 5;
    score -= transactions.filter(t => t.tag === 'Ick').length * 2;
    const finalScore = Math.max(0, Math.min(100, Math.round(score)));
    let msg = "Your financial health is stable. Keep it up!";
    if (finalScore >= 85) msg = "Elite status—your budget is perfectly optimized!";
    else if (finalScore >= 70) msg = "Solid progress—keep hitting those goals!";
    else if (finalScore < 50) msg = "Review budget—spending is outpacing savings.";
    return { healthScore: finalScore, totalXP: xp, message: msg };
  }, [userQuests, allQuests, goals, stashTransactions, transactions, user?.walletBalance]);

  const healthLabel = useMemo(() => {
    if (healthScore >= 85) return { label: "EXCELLENT", color: "text-emerald-400", bg: "bg-emerald-400/10" };
    if (healthScore >= 70) return { label: "STABLE", color: "text-blue-400", bg: "bg-blue-400/10" };
    if (healthScore >= 50) return { label: "IMPROVING", color: "text-cyan-400", bg: "bg-cyan-400/10" };
    return { label: "CRITICAL", color: "text-red-400", bg: "bg-red-400/10" };
  }, [healthScore]);

  const recentAchievements = useMemo(() => {
    const wins: any[] = [];
    userBadges.forEach(ub => { const badge = allBadges.find(b => b.id === ub.badgeId); if (badge) wins.push({ id: ub.id, title: badge.name, points: 50, date: ub.earnedAt }); });
    userQuests.forEach(uq => { if (uq.completed) { const quest = allQuests.find(q => q.id === uq.questId); if (quest) wins.push({ id: uq.id, title: quest.title, points: quest.points, date: uq.completedAt }); } });
    return wins.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);
  }, [userBadges, allBadges, userQuests, allQuests]);

  const recentExpenses = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5).map(t => ({ id: t.id, category: t.category || 'Other', description: t.description, tag: t.tag, amount: parseFloat(t.amount), date: format(new Date(t.date), 'MMM d') }));
  }, [transactions]);

  return (
    <div className="min-h-screen bg-[#020205] text-white selection:bg-blue-600/30 pt-24 pb-20">
      <main className="container mx-auto px-6 max-w-7xl">
        
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 p-[2px] premium-shadow">
               <div className="w-full h-full rounded-[22px] bg-[#020205] flex items-center justify-center overflow-hidden">
                  <img src={user?.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="Avatar" className="w-full h-full object-cover" />
               </div>
            </div>
            <div>
              <p className="text-white/40 text-sm font-bold tracking-[0.2em] uppercase mb-1">Elite Dashboard</p>
              <h2 className="text-4xl font-black tracking-tighter">Welcome, {user?.firstName || 'Member'}</h2>
              <div className="flex items-center gap-2 mt-2">
                <div className={`px-3 py-1 rounded-full ${healthLabel.bg} ${healthLabel.color} text-[10px] font-black tracking-widest uppercase border border-white/5`}>
                  {healthLabel.label} STATUS
                </div>
                <div className="bg-white/5 text-white/60 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-white/5 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  {totalXP} XP EARNED
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
             <Button onClick={() => setIsAddExpenseOpen(true)} className="flex-1 md:flex-none h-14 rounded-2xl bg-white text-black hover:bg-white/90 font-bold click-scale px-8">
               <PlusCircle className="w-5 h-5 mr-2" /> New Entry
             </Button>
          </div>
        </motion.div>

        {/* Grid Layout */}
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Wallet Visual */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div variants={item} className="feature-card h-full">
                <Card className="glass-card p-8 h-full min-h-[380px] flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32" />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-12">
                      <div>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">SECURE LEDGER</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Live Integration</p>
                        </div>
                      </div>
                      <Dialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen}>
                        <DialogTrigger asChild>
                          <Button size="icon" className="w-12 h-12 rounded-2xl bg-blue-600 hover:bg-blue-500 shadow-xl click-scale">
                             <Plus className="w-6 h-6" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-morphism border-white/10 text-white p-8 max-w-md">
                           <DialogHeader><DialogTitle className="text-3xl font-black">Refill Wallet</DialogTitle></DialogHeader>
                           <div className="space-y-6 pt-6">
                              <div className="space-y-3">
                                <Label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Entry Amount (₹)</Label>
                                <Input type="number" className="h-16 text-3xl font-black bg-white/5 border-white/10 rounded-2xl px-6" placeholder="0.00" value={topUpAmount} onChange={e => setTopUpAmount(e.target.value)} />
                              </div>
                              <Button className="w-full h-14 rounded-2xl bg-white text-black font-bold" onClick={() => topUpMutation.mutate()} disabled={!topUpAmount || topUpMutation.isPending}>Confirm Transaction</Button>
                           </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="space-y-4">
                      <div className="p-6 rounded-[24px] bg-white/[0.03] border border-white/5 flex flex-col gap-8 relative overflow-hidden group-hover:border-white/10 transition-colors">
                        <div className="flex justify-between items-center opacity-40">
                           <CreditCard className="w-8 h-8" />
                           <div className="w-10 h-6 bg-white/10 rounded-md" />
                        </div>
                        <div className="flex gap-4 text-white/20 font-mono text-sm tracking-widest">
                           <span>****</span><span>****</span><span>****</span><span className="text-white/40">{user?.id?.toString().slice(-4) || '2941'}</span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 pt-8">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-1">Available Funds</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-blue-500">₹</span>
                      <span className="text-6xl font-black tracking-tighter tabular-nums">{parseFloat(user?.walletBalance?.toString() || "0").toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={item} className="h-full">
                <HealthScoreCard score={healthScore} message={message} />
              </motion.div>
            </div>

            {/* Kinetic Actions */}
            <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                 { icon: Activity, label: "Analytics", path: "/analytics", color: "text-emerald-400" },
                 { icon: TrendingUp, label: "Vault", path: "/vault", color: "text-blue-400" },
                 { icon: MessageCircle, label: "Coach", path: "/assistant", color: "text-indigo-400" },
                 { icon: Trophy, label: "Progress", path: "/achievements", color: "text-purple-400" }
               ].map((action, i) => (
                 <button key={i} onClick={() => setLocation(action.path)} className="flex flex-col items-center justify-center p-8 rounded-[32px] bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all click-scale group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                       <action.icon className={`w-6 h-6 ${action.color}`} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">{action.label}</span>
                 </button>
               ))}
            </motion.div>

            {/* Challenges Grid */}
            <motion.div variants={item}>
              <div className="flex items-center justify-between mb-8 px-2">
                <h3 className="text-2xl font-black tracking-tight">Active Operations</h3>
                <Button variant="ghost" className="text-white/30 hover:text-white" onClick={() => setLocation('/learn')}>View Registry</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {challenges.map(c => (
                  <ChallengeCard key={c.id} {...c} onAction={() => { setSelectedChallenge(c); setIsChallengeModalOpen(true); }} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Achievements Card */}
            <motion.div variants={item}>
              <Card className="glass-card p-8">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-2 h-6 bg-blue-500 rounded-full" />
                   <h3 className="text-xl font-black tracking-tight">Recent Wins</h3>
                </div>
                <div className="space-y-4">
                  {recentAchievements.map(win => (
                    <div key={win.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all group cursor-pointer">
                       <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:rotate-6 transition-all">
                          <Trophy className="w-6 h-6 text-blue-400" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate uppercase tracking-tight">{win.title}</p>
                          <p className="text-[10px] font-black text-white/30 tracking-widest mt-0.5">+{win.points} XP SECURED</p>
                       </div>
                       <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-blue-400 transition-colors" />
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Activity Logger */}
            <motion.div variants={item}>
              <Card className="glass-card p-8 min-h-[420px] flex flex-col">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-xl font-black tracking-tight">Activity Log</h3>
                   <Button variant="ghost" size="sm" className="text-blue-400 font-bold" onClick={() => setLocation('/history')}>Registry</Button>
                </div>
                <div className="space-y-4 flex-1">
                  {recentExpenses.map(expense => (
                    <div key={expense.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group cursor-pointer" onClick={() => setLocation('/history')}>
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-blue-500/30 transition-colors">
                             <Zap className="w-5 h-5 text-white/40 group-hover:text-blue-400 transition-colors" />
                          </div>
                          <div>
                             <p className="font-bold text-sm text-white/90 group-hover:text-white transition-colors">{expense.description}</p>
                             <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{expense.date}</span>
                                <span className="w-1 h-1 rounded-full bg-white/10" />
                                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{expense.tag || expense.category}</span>
                             </div>
                          </div>
                       </div>
                       <p className="font-black text-sm tabular-nums">₹{expense.amount.toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <AnimatePresence>
        {isAddExpenseOpen && <AddExpenseModal open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen} />}
      </AnimatePresence>
      <ChallengeDetailsModal isOpen={isChallengeModalOpen} onClose={() => setIsChallengeModalOpen(false)} challenge={selectedChallenge} />
      <ChallengeCelebration isOpen={!!celebratingChallenge} onClose={() => setCelebratingChallenge(null)} challengeName={celebratingChallenge?.title} points={celebratingChallenge?.points} />
    </div>
  );
}


