import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Plus, Target, ArrowUpCircle, ArrowDownCircle, Trophy, Sparkles, ShieldCheck, Lock, ArrowRight } from "lucide-react";
import type { Goal, StashTransaction } from "@shared/schema";
import GoalCelebration from "@/components/GoalCelebration";
import { useAuth } from "@/hooks/useAuth";
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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function GlowUp() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isNewGoalOpen, setIsNewGoalOpen] = useState(false);
  const [isStashOpen, setIsStashOpen] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [stashAmount, setStashAmount] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedGoalName, setCompletedGoalName] = useState("");

  const { data: goals = [] } = useQuery<Goal[]>({
    queryKey: ["/api/goals"],
  });

  const { data: totalStashedData } = useQuery<{ total: number }>({
    queryKey: ["/api/stash/total"],
  });

  const { data: stashTransactions = [] } = useQuery<StashTransaction[]>({
    queryKey: ["/api/stash"],
  });

  const createGoalMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("/api/goals", "POST", {
        name: goalName,
        targetAmount: goalAmount,
        isMain: goals.length === 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/goals/main"] });
      setIsNewGoalOpen(false);
      setGoalName("");
      setGoalAmount("");
      toast({
        title: "Mission Initialized",
        description: `Quest "${goalName}" has been added to your backlog.`,
      });
    },
  });

  const stashMutation = useMutation({
    mutationFn: async (type: "stash" | "withdraw" = "stash") => {
      const amount = type === "stash" ? stashAmount : (goals.find(g => g.id === selectedGoalId)?.currentAmount || "0");
      return await apiRequest("/api/stash", "POST", {
        amount: amount,
        type: type,
        goalId: selectedGoalId || null,
        status: "completed",
      });
    },
    onSuccess: async (response, variables) => {
      const data = await response.json();
      const type = typeof variables === 'string' ? variables : "stash";
      
      queryClient.invalidateQueries({ queryKey: ["/api/stash"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stash/total"] });
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/streak"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });

      setIsStashOpen(false);
      setStashAmount("");
      
      if (type === "stash" && data.goalCompleted && selectedGoalId) {
        const goal = goals.find(g => g.id === selectedGoalId);
        setCompletedGoalName(goal?.name || "Goal");
        setShowCelebration(true);
      }
      
      setSelectedGoalId("");
      toast({
        title: type === "stash" ? "Protocol Success" : "Withdrawal Complete",
        description: type === "stash" 
          ? `₹${stashAmount} successfully transferred to secure storage.`
          : `Funds successfully returned to your main wallet.`,
      });
    },
    onError: (error: any) => {
       toast({
        title: "Protocol Failure",
        description: error.message || "Sequence interrupted. Check your energy levels.",
        variant: "destructive",
      });
    }
  });

  const totalStashed = totalStashedData?.total || 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full border border-primary/5 pointer-events-none" />
      <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full border border-primary/5 pointer-events-none" />

      <main className="container mx-auto px-6 py-12 space-y-12 max-w-7xl relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary/20 text-primary p-2 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary/80">Command Center</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter">The Glow Up</h1>
            <p className="text-white/40 font-medium mt-2">Manage your locker and monitor your evolution.</p>
          </div>
          
          <Dialog open={isStashOpen} onOpenChange={setIsStashOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-2xl h-16 px-10 text-xl font-bold premium-shadow click-scale group">
                <TrendingUp className="w-6 h-6 mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Stash Cash
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-morphism border-white/10 text-white p-8">
              <DialogHeader>
                <DialogTitle className="text-3xl font-black tracking-tight">Financial Protocol</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 pt-6">
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-white/40 uppercase tracking-widest">Amount to Stash (₹)</Label>
                  <Input
                    className="bg-white/5 border-white/10 h-16 text-2xl font-black focus:border-primary transition-all"
                    placeholder="0.00"
                    value={stashAmount}
                    onChange={(e) => setStashAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-white/40 uppercase tracking-widest">Allocate to Mission</Label>
                  <div className="relative">
                    <select
                      className="w-full h-14 rounded-xl border border-white/10 bg-white/5 px-4 text-white appearance-none focus:outline-none focus:border-primary font-bold"
                      value={selectedGoalId}
                      onChange={(e) => setSelectedGoalId(e.target.value)}
                    >
                      <option value="" className="bg-[#0a0a0a]">General Storage</option>
                      {goals.filter(g => parseFloat(g.currentAmount) < parseFloat(g.targetAmount)).map((goal) => (
                        <option key={goal.id} value={goal.id} className="bg-[#0a0a0a]">
                          {goal.name} ({(parseFloat(goal.currentAmount)/parseFloat(goal.targetAmount)*100).toFixed(0)}%)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
                   <div className="flex items-center gap-2">
                     <Lock className="w-4 h-4 text-primary" />
                     <span className="text-xs font-bold text-white/60">Current Wallet Energy</span>
                   </div>
                   <span className="text-sm font-black text-primary">₹{parseFloat(user?.walletBalance?.toString() || "0").toLocaleString('en-IN')}</span>
                </div>
                <Button
                  onClick={() => stashMutation.mutate("stash")}
                  disabled={stashMutation.isPending || !stashAmount}
                  className="w-full h-16 text-lg font-black bg-primary hover:bg-primary/90 rounded-2xl premium-shadow"
                >
                  Initiate Stash Sequence
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Locker Balance Hero Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="group relative overflow-hidden glass-morphism border-white/5 p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50 pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-xs font-black uppercase tracking-widest text-white/60">Total Vault Value</span>
              </div>
              <h2 className="text-7xl md:text-9xl font-black tracking-tighter mb-4 bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent group-hover:scale-[1.02] transition-transform duration-700">
                ₹{totalStashed.toLocaleString('en-IN')}
              </h2>
              <div className="flex items-center justify-center gap-8 mt-8">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Growth Engine</span>
                  <span className="text-primary font-bold">Liquid Mutual Fund</span>
                </div>
                <div className="w-[1px] h-8 bg-white/10" />
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Status</span>
                  <span className="text-green-400 font-bold uppercase tracking-wider text-xs">Active & Secure</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Goals Grid */}
        <section className="space-y-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-primary rounded-full" />
              <h2 className="text-3xl font-bold tracking-tight">Active Missions</h2>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsNewGoalOpen(true)}
              className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl h-12 px-6 font-bold"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </Button>
          </motion.div>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {goals.filter(g => parseFloat(g.currentAmount) < parseFloat(g.targetAmount)).map((goal) => {
              const progress = (parseFloat(goal.currentAmount) / parseFloat(goal.targetAmount)) * 100;
              return (
                <motion.div key={goal.id} variants={item}>
                  <Card className="group relative overflow-hidden glass-morphism border-white/5 p-8 h-full hover:scale-[1.02] transition-all duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                        <Target className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <div className="flex items-center gap-2">
                          <Lock className="w-3 h-3 text-white/20" />
                          <div className="text-3xl font-black text-white">{progress.toFixed(0)}%</div>
                        </div>
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Locked until goal</div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                        {goal.name}
                        {goal.isMain && <Sparkles className="w-4 h-4 text-accent" />}
                      </h3>
                      <p className="text-sm font-bold text-white/40">
                        ₹{parseFloat(goal.currentAmount).toLocaleString('en-IN')} / ₹{parseFloat(goal.targetAmount).toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="space-y-2">
                       <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(progress, 100)}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_15px_rgba(139,92,246,0.5)] rounded-full"
                         />
                       </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
            
            <Dialog open={isNewGoalOpen} onOpenChange={setIsNewGoalOpen}>
               <DialogContent className="glass-morphism border-white/10 text-white p-8">
                 <DialogHeader>
                   <DialogTitle className="text-3xl font-black">Design New Mission</DialogTitle>
                 </DialogHeader>
                 <div className="space-y-6 pt-6">
                   <div className="space-y-2">
                     <Label className="text-xs font-black uppercase tracking-widest text-white/40">Mission Name</Label>
                     <Input
                       className="bg-white/5 border-white/10 h-14 text-lg font-bold focus:border-primary"
                       placeholder="e.g. World Domination"
                       value={goalName}
                       onChange={(e) => setGoalName(e.target.value)}
                     />
                   </div>
                   <div className="space-y-2">
                     <Label className="text-xs font-black uppercase tracking-widest text-white/40">Target Capital (₹)</Label>
                     <Input
                       className="bg-white/5 border-white/10 h-14 text-lg font-bold focus:border-primary"
                       type="number"
                       placeholder="50000"
                       value={goalAmount}
                       onChange={(e) => setGoalAmount(e.target.value)}
                     />
                   </div>
                   <Button
                     onClick={() => createGoalMutation.mutate()}
                     disabled={createGoalMutation.isPending || !goalName || !goalAmount}
                     className="w-full h-16 text-lg font-black bg-primary premium-shadow"
                   >
                     Launch Mission
                   </Button>
                 </div>
               </DialogContent>
            </Dialog>
          </motion.div>
        </section>

        {/* History / Recent Activity */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           {/* Completed Missions */}
           <div className="lg:col-span-4 flex flex-col gap-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent" />
                Hall of Fame
              </h3>
              <div className="space-y-4">
                  {goals.filter(g => parseFloat(g.currentAmount) >= parseFloat(g.targetAmount)).map((goal) => (
                    <div key={goal.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-4 group">
                       <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold text-white/50">{goal.name}</div>
                            <div className="text-xs font-black text-green-500 uppercase tracking-widest mt-1">Status: Conquered</div>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                             <Trophy className="w-5 h-5 text-green-500" />
                          </div>
                       </div>
                       <Button 
                          className="w-full bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 font-bold"
                          onClick={() => {
                            setSelectedGoalId(goal.id);
                            stashMutation.mutate("withdraw");
                          }}
                          disabled={stashMutation.isPending && selectedGoalId === goal.id}
                       >
                          <ArrowDownCircle className="w-4 h-4 mr-2" />
                          Claim ₹{parseFloat(goal.currentAmount).toLocaleString('en-IN')}
                       </Button>
                    </div>
                  ))}
                 {goals.filter(g => parseFloat(g.currentAmount) >= parseFloat(g.targetAmount)).length === 0 && (
                   <div className="p-10 text-center border border-white/5 border-dashed rounded-3xl opacity-30">
                      <p className="text-sm font-bold">No conquered missions yet.</p>
                   </div>
                 )}
              </div>
           </div>

           {/* Transaction Log */}
           <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Recent Protocols</h3>
                <Button variant="ghost" className="text-primary hover:bg-primary/5 text-xs font-black tracking-widest uppercase">
                  Export Log
                </Button>
              </div>
              <div className="glass-morphism border-white/5 rounded-3xl overflow-hidden">
                 {stashTransactions.length > 0 ? (
                    <div className="divide-y divide-white/[0.03]">
                      {stashTransactions.slice(0, 8).map((t) => (
                        <motion.div 
                          key={t.id}
                          className="p-6 flex justify-between items-center hover:bg-white/[0.02] transition-colors group"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                              t.type === 'stash' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-destructive/10 border-destructive/20 text-destructive'
                            }`}>
                              {t.type === 'stash' ? <ArrowUpCircle className="w-6 h-6" /> : <ArrowDownCircle className="w-6 h-6" />}
                            </div>
                            <div>
                              <p className="font-bold text-white group-hover:text-primary transition-colors">
                                {t.type === 'stash' ? 'Funds Stashed' : 'Energy Withdrawal'}
                              </p>
                              <p className="text-xs font-bold text-white/30 uppercase tracking-widest mt-1">
                                {new Date(t.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <div className={`text-xl font-black ${
                            t.type === 'stash' ? 'text-primary' : 'text-destructive'
                          }`}>
                            {t.type === 'stash' ? '+' : '-'}₹{parseFloat(t.amount).toLocaleString('en-IN')}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                 ) : (
                    <div className="p-20 text-center text-white/20 italic">
                      Zero activity detected in the sectors.
                    </div>
                 )}
              </div>
           </div>
        </section>

      </main>

      <GoalCelebration 
        isOpen={showCelebration} 
        onClose={() => setShowCelebration(false)} 
        goalName={completedGoalName} 
      />
    </div>
  );
}
