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
    <div className="section-container py-20">
      <div className="flex flex-col gap-12">
        
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-4">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-20 h-20 rounded-3xl bg-blue-600/20 p-[2px] flex items-center justify-center overflow-hidden border border-blue-500/30">
                <img src={user?.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="Avatar" className="w-full h-full object-cover rounded-[22px]" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-blue-600 border-4 border-[#020205] flex items-center justify-center shadow-lg shadow-blue-600/20">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <p className="text-white/40 text-[10px] font-black tracking-[0.4em] uppercase mb-1">Operational Module 01</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Identity: {user?.firstName?.toUpperCase() || 'MEMBER'}</h2>
              <div className="flex items-center gap-3 mt-3">
                <div className={`px-4 py-1.5 rounded-full ${healthLabel.bg} ${healthLabel.color} text-[10px] font-black tracking-widest uppercase border border-white/5 shadow-xl`}>
                  {healthLabel.label} STATUS
                </div>
                <div className="bg-white/5 text-white/60 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border border-white/5 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  {totalXP} XP ACCUMULATED
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
             <Button onClick={() => setIsAddExpenseOpen(true)} className="flex-1 md:flex-none h-14 rounded-2xl bg-white text-black hover:bg-white/90 font-black text-[10px] tracking-widest uppercase click-scale px-10 shadow-2xl shadow-white/5">
               <PlusCircle className="w-5 h-5 mr-3" /> Execute Entry
             </Button>
          </div>
        </motion.div>

        {/* Tactical Grid */}
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Central Command */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Core Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <motion.div variants={item} className="h-full">
                <Card className="glass-card p-10 h-full min-h-[400px] flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full -mr-40 -mt-40 transition-transform duration-1000 group-hover:scale-125" />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-16">
                      <div>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">CAPITAL RESERVE</p>
                        <div className="flex items-center gap-2.5 mt-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-flicker shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                          <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Live Sync: Active</p>
                        </div>
                      </div>
                      <Dialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen}>
                        <DialogTrigger asChild>
                          <Button size="icon" className="w-14 h-14 rounded-[20px] bg-blue-600 hover:bg-blue-500 shadow-2xl shadow-blue-600/20 click-scale border-none">
                             <Plus className="w-7 h-7" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-frost border-white/10 text-white p-10 max-w-md">
                           <DialogHeader><DialogTitle className="text-3xl font-black uppercase tracking-tight">Refill Strategy</DialogTitle></DialogHeader>
                           <div className="space-y-8 pt-8">
                              <div className="space-y-4">
                                <Label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Entry Amount (₹)</Label>
                                <Input type="number" className="h-16 text-4xl font-black bg-white/5 border-white/10 rounded-2xl px-6 focus:border-blue-500/50 transition-all" placeholder="0.00" value={topUpAmount} onChange={e => setTopUpAmount(e.target.value)} />
                              </div>
                              <Button className="w-full h-16 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs click-scale" onClick={() => topUpMutation.mutate()} disabled={!topUpAmount || topUpMutation.isPending}>Authorize Transaction</Button>
                           </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="space-y-6">
                      <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 flex flex-col gap-10 relative overflow-hidden group-hover:border-white/10 transition-colors">
                        <div className="flex justify-between items-center opacity-40">
                           <CreditCard className="w-10 h-10" />
                           <div className="w-12 h-8 bg-white/10 rounded-lg" />
                        </div>
                        <div className="flex gap-6 text-white/20 font-mono text-lg tracking-[0.4em]">
                           <span>****</span><span>****</span><span>****</span><span className="text-white/60">{user?.id?.toString().slice(-4) || '2941'}</span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 pt-10">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] mb-2">Available Capital</p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-black text-blue-500">₹</span>
                      <span className="text-7xl font-black tracking-tighter tabular-nums text-white">{parseFloat(user?.walletBalance?.toString() || "0").toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={item} className="h-full">
                <HealthScoreCard score={healthScore} message={message} />
              </motion.div>
            </div>

            {/* Terminal Shortlinks */}
            <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {[
                 { icon: Activity, label: "Analytics", path: "/analytics", color: "text-blue-400" },
                 { icon: TrendingUp, label: "Vault", path: "/vault", color: "text-blue-500" },
                 { icon: MessageCircle, label: "Coach", path: "/assistant", color: "text-blue-300" },
                 { icon: Trophy, label: "Progress", path: "/achievements", color: "text-blue-400" }
               ].map((action, i) => (
                 <button key={i} onClick={() => setLocation(action.path)} className="flex flex-col items-center justify-center p-10 rounded-[40px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all click-scale group shadow-xl">
                    <div className="w-16 h-16 rounded-[22px] bg-white/[0.03] border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                       <action.icon className={`w-7 h-7 ${action.color}`} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 group-hover:opacity-100 transition-opacity">{action.label}</span>
                 </button>
               ))}
            </motion.div>

            {/* Tactical Operations */}
            <motion.div variants={item} className="space-y-8">
              <div className="flex items-center justify-between px-4">
                <h3 className="text-2xl font-black tracking-tight uppercase">Active Operations</h3>
                <Button variant="ghost" className="text-white/20 hover:text-white font-black text-[10px] tracking-widest uppercase" onClick={() => setLocation('/learn')}>Archive View</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {challenges.map(c => (
                  <ChallengeCard key={c.id} {...c} onAction={() => { setSelectedChallenge(c); setIsChallengeModalOpen(true); }} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Intelligence Sidebar */}
          <div className="lg:col-span-4 space-y-10">
            
            {/* Achievement Matrix */}
            <motion.div variants={item}>
              <Card className="glass-card p-10">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-2.5 h-8 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                   <h3 className="text-2xl font-black tracking-tight uppercase">Encryption Wins</h3>
                </div>
                <div className="space-y-5">
                  {recentAchievements.map(win => (
                    <div key={win.id} className="flex items-center gap-5 p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] transition-all group cursor-pointer shadow-lg">
                       <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                          <Trophy className="w-7 h-7 text-blue-400" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="font-black text-sm truncate uppercase tracking-tight text-white/90">{win.title}</p>
                          <p className="text-[9px] font-black text-blue-400/60 tracking-[0.3em] mt-1.5 uppercase">+{win.points} XP SECURED</p>
                       </div>
                       <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                  {recentAchievements.length === 0 && (
                    <div className="p-10 text-center border border-white/5 border-dashed rounded-3xl opacity-20 italic font-bold">No active intel.</div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Activity Stream */}
            <motion.div variants={item}>
              <Card className="glass-card p-10 min-h-[500px] flex flex-col">
                <div className="flex items-center justify-between mb-10">
                   <h3 className="text-2xl font-black tracking-tight uppercase">Audit Stream</h3>
                   <Button variant="ghost" size="sm" className="text-blue-500 font-black text-[10px] tracking-widest uppercase" onClick={() => setLocation('/history')}>Registry</Button>
                </div>
                <div className="space-y-5 flex-1">
                  {recentExpenses.map(expense => (
                    <div key={expense.id} className="flex items-center justify-between p-5 rounded-3xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all group cursor-pointer shadow-xl" onClick={() => setLocation('/history')}>
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-blue-500/30 transition-colors">
                             <Zap className="w-6 h-6 text-white/20 group-hover:text-blue-400 transition-colors" />
                          </div>
                          <div>
                             <p className="font-black text-sm text-white/80 group-hover:text-white transition-colors uppercase tracking-tight">{expense.description}</p>
                             <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">{expense.date}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-white/5" />
                                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{expense.tag || expense.category}</span>
                             </div>
                          </div>
                       </div>
                       <p className="font-black text-lg tabular-nums text-white">₹{expense.amount.toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                  {recentExpenses.length === 0 && (
                    <div className="flex-1 flex items-center justify-center border border-white/5 border-dashed rounded-3xl opacity-20 italic font-bold">Zero latency sync.</div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isAddExpenseOpen && <AddExpenseModal open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen} />}
      </AnimatePresence>
      <ChallengeDetailsModal isOpen={isChallengeModalOpen} onClose={() => setIsChallengeModalOpen(false)} challenge={selectedChallenge} />
      <ChallengeCelebration isOpen={!!celebratingChallenge} onClose={() => setCelebratingChallenge(null)} challengeName={celebratingChallenge?.title} points={celebratingChallenge?.points} />
    </div>
  );
}
