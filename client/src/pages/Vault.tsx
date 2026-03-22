import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Plus, Target, ArrowUpCircle, ArrowDownCircle, Trophy, Sparkles, ShieldCheck, Lock, ArrowRight, Zap, TargetIcon, MousePointer2, ChevronRight } from "lucide-react";
import type { Goal, StashTransaction } from "@shared/schema";
import GoalCelebration from "@/components/GoalCelebration";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function GlowUp() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isNewGoalOpen, setIsNewGoalOpen] = useState(false);
  const [isStashOpen, setIsStashOpen] = useState(false);
  const [vaultStep, setVaultStep] = useState<'action' | 'setup' | 'verify'>('action');
  const [enteredCode, setEnteredCode] = useState("");
  const [newPin, setNewPin] = useState("");
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
        title: "Mission Established",
        description: `"${goalName}" has been successfully added to your trajectory database.`,
      });
    },
  });

  const stashMutation = useMutation({
    mutationFn: async (type: 'stash' | 'withdraw') => {
      if (type === 'withdraw') {
        if (!user?.vaultPin) throw new Error("Security PIN not initialized.");
        if (enteredCode !== user.vaultPin) {
          throw new Error("Invalid security PIN verification.");
        }
      }
      
      return await apiRequest("/api/stash", "POST", {
        amount: stashAmount,
        type: type,
        goalId: selectedGoalId || null,
        status: "completed",
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stash"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stash/total"] });
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/streak"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });

      setIsStashOpen(false);
      setVaultStep('action');
      setStashAmount("");
      setSelectedGoalId("");
      setEnteredCode("");
      
      toast({
        title: "Vault Synchronized",
        description: "Transaction history successfully encrypted and stored.",
      });
    },
    onError: (error: any) => {
       toast({
        title: "Handshake Failed",
        description: error.message || "An unexpected error occurred during encryption.",
        variant: "destructive",
      });
    }
  });

  const setupPinMutation = useMutation({
    mutationFn: async (pin: string) => {
      return await apiRequest("/api/user/vault-pin", "PATCH", { pin });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setVaultStep('verify');
      setNewPin("");
      toast({
        title: "Encryption Key Updated",
        description: "Your security PIN is now active. Authorization required for withdrawals.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Initialization Failed",
        description: error.message || "Failed to set security PIN.",
        variant: "destructive",
      });
    }
  });

  const handleWithdrawClick = () => {
    if (!stashAmount || parseFloat(stashAmount) <= 0) {
      toast({ title: "Invalid Input", description: "Identify a non-zero amount for extraction.", variant: "destructive" });
      return;
    }
    
    if (parseFloat(stashAmount) > totalStashed) {
      toast({ title: "Insufficient Reserves", description: "Selected amount exceeds available vault capital.", variant: "destructive" });
      return;
    }

    if (!user?.vaultPin) {
      setVaultStep('setup');
    } else {
      setVaultStep('verify');
    }
  };

  const getPinRestrictionMessage = () => {
    if (!user?.vaultPinUpdatedAt) return null;
    const updatedAt = new Date(user.vaultPinUpdatedAt);
    const now = new Date();
    const diffDays = Math.ceil((now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `Wait period: ${30 - diffDays} days remaining for PIN reset.`;
    }
    return null;
  };

  const claimGoalMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/goals/${id}/claim`, "POST");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stash/total"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stash"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      const goal = goals.find(g => g.id === variables);
      if (goal) {
        setCompletedGoalName(goal.name);
        setShowCelebration(true);
      }
      
      toast({
        title: "Mission Accomplished",
        description: "Capital has been successfully claimed and isolated for deployment.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Extraction Failed",
        description: error.message || "Failed to finalize goal claim successfully.",
        variant: "destructive",
      });
    }
  });

  const totalStashed = totalStashedData?.total || 0;

  return (
    <div className="section-container py-20">
      <div className="flex flex-col gap-12">
        
        {/* Cinematic Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
                Capital Isolation
              </div>
              <div className="h-[1px] w-20 bg-white/5" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-[-0.05em] leading-[0.8] mb-4 text-white uppercase">
              THE FROST <br />
              <span className="text-gradient-blue">VAULT.</span>
            </h1>
            <p className="text-white/30 text-lg font-medium tracking-tight max-w-xl">
              Bank-grade asset preservation with sub-zero isolation protocols.
            </p>
          </div>
          
          <Dialog open={isStashOpen} onOpenChange={(open) => {
            setIsStashOpen(open);
            if (!open) { setVaultStep('action'); setEnteredCode(""); }
          }}>
            <DialogTrigger asChild>
              <Button className="h-24 rounded-[32px] px-16 bg-blue-600 hover:bg-blue-500 text-white font-black text-xl tracking-tighter click-scale shadow-[0_30px_60px_-15px_rgba(37,99,235,0.4)] border-none">
                <TrendingUp className="w-8 h-8 mr-6" />
                Initialize Sync
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-frost border-white/10 text-white p-10 max-w-xl">
               <AnimatePresence mode="wait">
                {vaultStep === 'action' ? (
                  <motion.div key="action" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-10">
                    <div className="flex justify-between items-start">
                      <DialogHeader>
                        <DialogTitle className="text-4xl font-black uppercase tracking-tight text-white mb-2">Vault Console</DialogTitle>
                        <DialogDescription className="text-white/30 font-bold uppercase text-[10px] tracking-widest">Execute deposit or extraction vectors.</DialogDescription>
                      </DialogHeader>
                      {user?.vaultPin && !getPinRestrictionMessage() && (
                        <button className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-blue-500 transition-colors" onClick={() => setVaultStep('setup')}>Reset Key</button>
                      )}
                    </div>
                    <div className="space-y-10">
                      <div className="space-y-4">
                        <Label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Capital Amount (₹)</Label>
                        <input className="w-full bg-white/5 border border-white/10 h-20 rounded-[28px] px-8 text-4xl font-black focus:border-blue-500/50 transition-all outline-none text-white tabular-nums" placeholder="0.00" value={stashAmount} onChange={(e) => setStashAmount(e.target.value)} />
                      </div>
                      <div className="space-y-4">
                        <Label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Trajectory Allocation</Label>
                        <select className="w-full h-16 rounded-[24px] border border-white/10 bg-[#0a0a0f] px-8 text-white appearance-none focus:outline-none focus:border-blue-500/50 font-bold tracking-tight" value={selectedGoalId} onChange={(e) => setSelectedGoalId(e.target.value)}>
                          <option value="" className="bg-[#0a0a0a]">General Isolation</option>
                          {goals.filter(g => !g.completed && parseFloat(g.currentAmount) < parseFloat(g.targetAmount)).map((goal) => (
                            <option key={goal.id} value={goal.id} className="bg-[#0a0a0a]">
                              {goal.name.toUpperCase()} ({(parseFloat(goal.currentAmount)/parseFloat(goal.targetAmount)*100).toFixed(0)}%)
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <Button onClick={() => stashMutation.mutate('stash')} disabled={stashMutation.isPending || !stashAmount} className="flex flex-col h-[140px] py-8 rounded-[40px] bg-blue-600 hover:bg-blue-500 text-white border-none shadow-2xl">
                          <ArrowUpCircle className="w-10 h-10 mb-4" />
                          <span className="font-black text-[10px] uppercase tracking-[0.3em]">Deposit Asset</span>
                        </Button>
                        <Button onClick={handleWithdrawClick} disabled={stashMutation.isPending || !stashAmount} variant="outline" className="flex flex-col h-[140px] py-8 rounded-[40px] border-white/10 hover:bg-white/[0.05] transition-all">
                          <ArrowDownCircle className="w-10 h-10 mb-4" />
                          <span className="font-black text-[10px] uppercase tracking-[0.3em] text-white/40">Extract Asset</span>
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-8 rounded-[32px] bg-white/[0.02] border border-white/5">
                         <div className="flex flex-col">
                           <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1.5">Liquid Balance</span>
                           <span className="text-xl font-black text-white tabular-nums">₹{parseFloat(user?.walletBalance?.toString() || "0").toLocaleString('en-IN')}</span>
                         </div>
                         <div className="w-[1px] h-14 bg-white/10" />
                         <div className="flex flex-col items-end">
                           <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1.5">Frozen Balance</span>
                           <span className="text-xl font-black text-blue-500 tabular-nums">₹{totalStashed.toLocaleString('en-IN')}</span>
                         </div>
                      </div>
                    </div>
                  </motion.div>
                ) : vaultStep === 'setup' ? (
                  <motion.div key="setup" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-12 py-10">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-[32px] bg-blue-500/10 border border-blue-500/20 mb-10 shadow-2xl">
                        <Lock className="w-10 h-10 text-blue-500" />
                      </div>
                      <h2 className="text-4xl font-black uppercase tracking-tight text-white mb-4">{user?.vaultPin ? 'Re-Encrypt Key' : 'Establish Key'}</h2>
                      <p className="text-white/30 font-medium text-lg leading-relaxed">Initialize a 4-digit biometric PIN to authorize extraction vectors.</p>
                      {getPinRestrictionMessage() && (
                        <p className="text-[10px] text-rose-500 mt-8 font-black uppercase tracking-[0.3em] border border-rose-500/20 bg-rose-500/5 p-4 rounded-2xl animate-pulse">
                          {getPinRestrictionMessage()}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-center py-4">
                      <Input type="password" className="w-64 bg-white/5 border-white/10 h-24 rounded-[32px] text-center text-5xl font-black tracking-[0.8em] focus:border-blue-500/50 transition-all outline-none" maxLength={4} placeholder="••••" value={newPin} onChange={(e) => setNewPin(e.target.value)} autoFocus />
                    </div>
                    <div className="space-y-6">
                      <Button onClick={() => setupPinMutation.mutate(newPin)} disabled={setupPinMutation.isPending || newPin.length < 4 || !!getPinRestrictionMessage()} className="w-full h-20 rounded-[32px] text-lg font-black uppercase tracking-[0.2em]">{setupPinMutation.isPending ? 'Syncing...' : 'Authorize Secret Key'}</Button>
                      <Button variant="ghost" className="w-full h-12 text-white/20 font-black uppercase tracking-widest hover:text-white" onClick={() => setVaultStep('action')}>Abort Setup</Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="verify" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12 py-10">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-[32px] bg-blue-500/10 border border-blue-500/20 mb-10 shadow-2xl">
                        <ShieldCheck className="w-10 h-10 text-blue-400" />
                      </div>
                      <h2 className="text-4xl font-black uppercase tracking-tight text-white mb-4">Validate Security</h2>
                      <p className="text-white/30 font-medium text-lg leading-relaxed">Enter your 4-digit secret key to finalize this extraction handshake.</p>
                    </div>
                    <div className="flex justify-center py-4">
                      <Input type="password" className="w-64 bg-white/5 border-white/10 h-24 rounded-[32px] text-center text-5xl font-black tracking-[0.8em] focus:border-blue-500/50 transition-all outline-none" maxLength={4} placeholder="••••" value={enteredCode} onChange={(e) => setEnteredCode(e.target.value)} autoFocus />
                    </div>
                    <div className="space-y-6">
                      <Button onClick={() => stashMutation.mutate('withdraw')} disabled={stashMutation.isPending || enteredCode.length < 4} className="w-full h-20 rounded-[32px] text-lg font-black uppercase tracking-[0.2em]">{stashMutation.isPending ? 'Validating...' : 'Authorize Extraction'}</Button>
                      <Button variant="ghost" className="w-full h-12 text-white/20 font-black uppercase tracking-widest hover:text-white" onClick={() => setVaultStep('action')}>Abort Handshake</Button>
                    </div>
                  </motion.div>
                )}
               </AnimatePresence>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Global Preservation Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="group relative overflow-hidden glass-frost p-16 md:p-24 text-center border-white/5 rounded-[64px] shadow-2xl">
            <div className="absolute inset-0 spectral-glow opacity-30 pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/[0.03] border border-white/10 shadow-xl mb-12 animate-pulse-subtle">
                <ShieldCheck className="w-6 h-6 text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60">Consolidated Asset Integrity</span>
              </div>
              <h2 className="text-7xl sm:text-9xl md:text-[180px] font-black tracking-[-0.08em] leading-none mb-10 bg-gradient-to-r from-white via-white to-white/20 bg-clip-text text-transparent group-hover:scale-[1.03] transition-transform duration-1000 tabular-nums">
                ₹{totalStashed.toLocaleString('en-IN')}
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-12 mt-12">
                 <div className="flex flex-col items-center">
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-3">Yield Protocol</p>
                   <span className="text-blue-500 font-black text-xl uppercase tracking-tighter">Strategic Liquid Growth</span>
                 </div>
                 <div className="hidden sm:block w-[1.5px] h-16 bg-white/10" />
                 <div className="flex flex-col items-center">
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-3">Operational State</p>
                   <span className="text-emerald-400 font-black uppercase tracking-[0.2em] text-lg">Fully Encrypted</span>
                 </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Goals Management Grid */}
        <div className="space-y-12">
           <div className="flex items-center justify-between px-6">
              <div className="flex items-center gap-5">
                 <div className="w-3 h-10 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
                 <h2 className="text-4xl font-black tracking-[-0.03em] uppercase">Active Trajectories</h2>
              </div>
              <Button onClick={() => setIsNewGoalOpen(true)} className="h-16 rounded-[24px] px-10 bg-white/[0.03] border border-white/10 text-white font-black hover:bg-white/[0.08] shadow-xl click-scale flex items-center gap-4 text-xs uppercase tracking-widest">
                <Plus className="w-5 h-5" />
                Establish Mission
              </Button>
           </div>

           <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {goals.filter(g => !g.completed).map((goal) => {
                const current = parseFloat(goal.currentAmount);
                const target = parseFloat(goal.targetAmount);
                const progress = (current / target) * 100;
                const isReadyToClaim = current >= target;
                return (
                  <motion.div key={goal.id} variants={item}>
                    <Card className="glass-frost p-12 h-full rounded-[48px] border-white/5 hover-lift group relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 blur-[90px] rounded-full -mr-24 -mt-24 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                       
                       <div className="flex justify-between items-start mb-12">
                          <div className="w-16 h-16 rounded-[28px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-2xl group-hover:rotate-12 transition-all">
                             <Target className="w-8 h-8" />
                          </div>
                          <div className="text-right">
                             <div className="text-4xl font-black text-white tabular-nums tracking-tighter">{progress.toFixed(0)}%</div>
                             <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-1.5">Maturity</div>
                          </div>
                       </div>

                       <div className="mb-10">
                          <h3 className="text-2xl font-black tracking-tight mb-4 flex items-center gap-3">
                             {goal.name.toUpperCase()}
                             {goal.isMain && <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />}
                          </h3>
                          <p className="text-lg font-bold text-white/40 tracking-tight">
                             ₹{parseFloat(goal.currentAmount).toLocaleString('en-IN')} / ₹{parseFloat(goal.targetAmount).toLocaleString('en-IN')}
                          </p>
                       </div>

                       <div className="space-y-3">
                          <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden p-[2px]">
                             <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(progress, 100)}%` }} transition={{ duration: 2, ease: "expoOut" }} className={`h-full rounded-full ${isReadyToClaim ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]'}`} />
                          </div>
                       </div>

                       {isReadyToClaim && (
                         <div className="mt-12">
                            <Button onClick={(e) => { e.stopPropagation(); claimGoalMutation.mutate(goal.id); }} disabled={claimGoalMutation.isPending} className="w-full h-20 rounded-[32px] bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-600/30 border-none transition-all hover:scale-[1.02]">
                               {claimGoalMutation.isPending ? 'Extracting Intel...' : (
                                 <div className="flex items-center gap-4">
                                   <Zap className="w-6 h-6" />
                                   Claim Mission Rewards
                                 </div>
                               )}
                            </Button>
                         </div>
                       )}
                    </Card>
                  </motion.div>
                );
              })}
           </motion.div>
        </div>

        {/* Tactical History Logger */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12 pb-24">
           {/* Sidebar Wins */}
           <div className="lg:col-span-4 flex flex-col gap-10">
              <h3 className="text-2xl font-black tracking-tight uppercase flex items-center gap-5">
                 <Trophy className="w-8 h-8 text-blue-500" />
                 Missions Completed
              </h3>
              <div className="space-y-6">
                 {goals.filter(g => g.completed).map((goal) => (
                   <div key={goal.id} className="p-8 rounded-[40px] bg-white/[0.01] border border-white/5 flex items-center justify-between group hover:border-blue-500/20 transition-all shadow-xl">
                      <div>
                        <div className="text-lg font-black text-white/60 uppercase tracking-tight">{goal.name}</div>
                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mt-2">Operational Logic: Solved</div>
                      </div>
                      <div className="w-14 h-14 rounded-[22px] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-xl group-hover:scale-110 transition-transform">
                         <Trophy className="w-6 h-6 text-emerald-500" />
                      </div>
                   </div>
                 ))}
                 {goals.filter(g => g.completed).length === 0 && (
                   <div className="p-20 text-center border-2 border-white/5 border-dashed rounded-[48px] opacity-20">
                      <p className="text-lg font-black italic uppercase tracking-widest text-white/30">Zero artifacts found.</p>
                   </div>
                 )}
              </div>
           </div>

           {/* Global Registry */}
           <div className="lg:col-span-8 flex flex-col gap-10">
              <div className="flex items-center justify-between px-6">
                <h3 className="text-2xl font-black tracking-tight uppercase">Registry Log</h3>
                <Button variant="ghost" className="text-blue-500 font-black text-[10px] tracking-widest uppercase hover:text-white">Export Terminal Data</Button>
              </div>
              <div className="glass-frost border-white/5 rounded-[56px] overflow-hidden shadow-2xl">
                 {stashTransactions.length > 0 ? (
                    <div className="divide-y divide-white/[0.03]">
                       {stashTransactions.slice(0, 10).map((t) => (
                         <div key={t.id} className="p-8 flex justify-between items-center hover:bg-white/[0.02] transition-all group">
                            <div className="flex items-center gap-8">
                               <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center border ${
                                 t.type === 'stash' ? 'bg-blue-600/10 border-blue-600/20 text-blue-500' : 
                                 t.type === 'claim' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                               } shadow-xl group-hover:scale-110 transition-transform`}>
                                 {t.type === 'stash' ? <ArrowUpCircle className="w-8 h-8" /> : 
                                  t.type === 'claim' ? <Trophy className="w-8 h-8" /> :
                                  <ArrowDownCircle className="w-8 h-8" />}
                               </div>
                               <div>
                                 <p className="text-xl font-black text-white/90 group-hover:text-blue-500 transition-colors uppercase tracking-tight">
                                   {t.type === 'stash' ? 'Inbound Asset' : t.type === 'claim' ? 'Mission Claimed' : 'Outbound Extraction'}
                                 </p>
                                 <div className="flex items-center gap-4 mt-2">
                                   <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{new Date(t.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                   <span className="w-1 h-1 rounded-full bg-white/10" />
                                   <span className="text-[9px] text-white/30 bg-white/[0.02] px-4 py-1.5 rounded-full border border-white/10 uppercase font-black tracking-widest">
                                     {t.goalId ? goals.find(g => g.id === t.goalId)?.name || 'General Reserves' : 'General Reserves'}
                                   </span>
                                 </div>
                               </div>
                            </div>
                            <div className={`text-3xl font-black tabular-nums ${t.type === 'stash' ? 'text-blue-500' : 'text-rose-500'}`}>
                               {t.type === 'stash' ? '+' : '-'}₹{parseFloat(t.amount).toLocaleString('en-IN')}
                            </div>
                         </div>
                       ))}
                    </div>
                 ) : (
                    <div className="p-40 text-center opacity-10 italic font-black uppercase tracking-[0.5em] text-white">Registry Empty.</div>
                 )}
              </div>
           </div>
        </section>

      </div>

      <GoalCelebration isOpen={showCelebration} onClose={() => setShowCelebration(false)} goalName={completedGoalName} />
      
      {/* Establishment Console */}
      <Dialog open={isNewGoalOpen} onOpenChange={setIsNewGoalOpen}>
         <DialogContent className="glass-frost border-white/10 text-white p-12 max-w-2xl rounded-[48px]">
           <DialogHeader>
             <DialogTitle className="text-4xl font-black uppercase tracking-tight mb-4">Establish Mission</DialogTitle>
             <DialogDescription className="text-white/30 font-bold uppercase text-[10px] tracking-widest">Define your long-term capital trajectory.</DialogDescription>
           </DialogHeader>
           <div className="space-y-10 pt-10">
             <div className="space-y-4">
               <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Mission Identifier</Label>
               <Input className="bg-white/5 border-white/10 h-16 text-xl font-bold rounded-2xl focus:border-blue-500/50" placeholder="e.g. STRATEGIC GROWTH" value={goalName} onChange={(e) => setGoalName(e.target.value)} />
             </div>
             <div className="space-y-4">
               <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Capital Target (₹)</Label>
               <Input className="bg-white/5 border-white/10 h-16 text-xl font-bold rounded-2xl focus:border-blue-500/50" type="number" placeholder="50000" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} />
             </div>
             <Button onClick={() => createGoalMutation.mutate()} disabled={createGoalMutation.isPending || !goalName || !goalAmount} className="w-full h-20 rounded-[32px] font-black uppercase tracking-[0.3em] text-xs bg-white text-black hover:bg-white/90 click-scale mt-4" size="lg">Confirm Mission Parameters</Button>
           </div>
         </DialogContent>
      </Dialog>
    </div>
  );
}
