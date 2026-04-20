import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, Clock, Target, CheckCircle2, ShieldCheck, Zap, ArrowRight, BarChart3 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChallengeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    points: number;
    progress?: number;
    target?: number;
    timeRemaining?: string;
    isActive: boolean;
    isCompleted?: boolean;
    type?: string; // 'save', 'count', 'streak', 'manual'
  } | null;
}

export default function ChallengeDetailsModal({ isOpen, onClose, challenge }: ChallengeDetailsModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [note, setNote] = useState("");

  const joinChallengeMutation = useMutation({
    mutationFn: async (questId: string) => {
      return await apiRequest(`/api/quests/${questId}/join`, "POST");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/quests"] });
      toast({
        title: "Mission Accepted",
        description: "Your strategic objectives have been updated.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to initialize mission. System bypass required.",
        variant: "destructive",
      });
    }
  });

  const completeChallengeMutation = useMutation({
    mutationFn: async (data: { questId: string, note?: string }) => {
      return await apiRequest(`/api/quests/${data.questId}/complete`, "POST", { completionNote: data.note });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/quests"] });
      toast({
        title: "Mission Complete!",
        description: "Strategic objectives realized. Rewards allocated.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to finalize mission. Retry sequence initiated.",
        variant: "destructive",
      });
    }
  });

  if (!challenge) return null;

  const isManual = challenge.type === 'manual' || challenge.title === "Subscription Audit";

  const handleAction = () => {
    if (challenge.isActive) {
      if (isManual) {
        if (!note.trim()) {
          toast({
            title: "Data Required",
            description: "Please specify the objective parameters (e.g. platform name).",
            variant: "destructive"
          });
          return;
        }
        completeChallengeMutation.mutate({ questId: challenge.id, note });
      } else {
        onClose(); 
      }
    } else {
      joinChallengeMutation.mutate(challenge.id);
    }
  };

  const progressPercentage = challenge.target 
    ? Math.min(100, ((challenge.progress || 0) / challenge.target) * 100) 
    : 0;

  const difficultyColors = {
    'Hard': 'bg-red-500/10 text-red-500 border-red-500/20',
    'Medium': 'bg-primary/10 text-primary border-primary/20',
    'Easy': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-[#0A0A0A] border-white/10 rounded-[40px] shadow-2xl">
        <div className="relative">
          {/* Header/Banner Section */}
          <div className="bg-gradient-to-br from-primary/20 via-[#0A0A0A] to-[#0A0A0A] p-8 pt-12 border-b border-white/5 relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Target className="w-48 h-48 text-white" />
            </div>
            
            <div className="relative space-y-4">
              <div className="flex items-center gap-2">
                <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${difficultyColors[challenge.difficulty as keyof typeof difficultyColors] || difficultyColors.Medium}`}>
                   {challenge.difficulty} TIER
                </div>
                <div className="h-px w-8 bg-white/10" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 italic">Mission Brief // 0x{challenge.id.slice(0, 4).toUpperCase()}</span>
              </div>
              
              <DialogTitle className="text-4xl font-black tracking-tighter uppercase italic text-white leading-none">
                {challenge.title}
              </DialogTitle>
              
              <DialogDescription className="text-white/40 text-base font-medium leading-relaxed italic max-w-md">
                {challenge.description}
              </DialogDescription>
            </div>
          </div>

          {/* Metrics Section */}
          <div className="p-8 space-y-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-1 group hover:border-primary/20 transition-colors">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20 flex items-center gap-2">
                  <Zap className="w-3 h-3 text-primary" /> Potential Yield
                </p>
                <p className="text-3xl font-black italic text-white">+{challenge.points} XP</p>
              </div>
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-1 group hover:border-white/20 transition-colors">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20 flex items-center gap-2">
                  <Clock className="w-3 h-3" /> Duration
                </p>
                <p className="text-3xl font-black italic text-white">{challenge.timeRemaining || 'Active'}</p>
              </div>
            </div>

            {/* Progress / Action Area */}
            <div className="space-y-6">
              {challenge.isActive && !isManual && (
                <div className="space-y-4 p-8 rounded-[32px] bg-white/[0.03] border border-white/10">
                  <div className="flex justify-between items-end mb-2">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Execution Progress</p>
                      <p className="text-sm font-bold text-white">Strategic Benchmark</p>
                    </div>
                    <p className="text-2xl font-black italic text-primary">{Math.round(progressPercentage)}%</p>
                  </div>
                  <div className="relative h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      className="h-full bg-primary rounded-full relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </motion.div>
                  </div>
                  <div className="flex justify-between text-[10px] font-black tracking-widest text-white/20 uppercase pt-2">
                    <span>Baseline: 0</span>
                    <span>Target: {challenge.target}</span>
                  </div>
                </div>
              )}

              {challenge.isActive && isManual && (
                <div className="space-y-6 p-8 rounded-[32px] bg-primary/5 border border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-3">
                    <Label htmlFor="note" className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">Objective Specification</Label>
                    <Input 
                      id="note" 
                      placeholder="e.g. Netflix, Amazon Prime, etc." 
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="h-16 bg-black/40 border-white/10 rounded-2xl text-lg font-black placeholder:text-white/10 focus:border-primary focus:ring-0 transition-all italic"
                      autoFocus
                    />
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs font-semibold text-white/40 leading-relaxed italic">
                      Verify cancellation of high-extraction subscriptions to recover capital leakage. Minimum entry required for protocol validation.
                    </p>
                  </div>
                </div>
              )}
              
              {!challenge.isActive && !challenge.isCompleted && (
                <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 flex items-center gap-6 group hover:bg-white/[0.04] transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <BarChart3 className="w-6 h-6 text-white/20" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Mission Metric</p>
                    <p className="text-lg font-black text-white italic">
                      Goal: {isManual ? "Manual verification sequence" : `${challenge.target} ${challenge.type === 'save' ? 'unit savings' : 'strategic actions'}`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-8 pt-0 flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 h-16 rounded-[24px] border-white/10 bg-white/5 font-black uppercase tracking-widest text-[10px] hover:bg-white/10"
            >
              Abort Brief
            </Button>
            {!challenge.isCompleted && (
              <Button 
                onClick={handleAction} 
                disabled={joinChallengeMutation.isPending || completeChallengeMutation.isPending}
                className="flex-[2] h-16 rounded-[24px] bg-white text-black font-black uppercase tracking-widest text-[11px] hover:bg-white/90 group transition-all shadow-[0_15px_30px_rgba(255,255,255,0.1)]"
              >
                {joinChallengeMutation.isPending ? "Initializing..." : 
                 completeChallengeMutation.isPending ? "Finalizing..." :
                 challenge.isActive ? (isManual ? "Complete Mission" : "Return to Ops") : "Acknowledge Mission"}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
          
          {/* Decorative Bottom Bar */}
          <div className="bg-white/[0.02] border-t border-white/5 px-8 py-3 flex justify-between items-center overflow-hidden">
            <div className="flex gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="text-[10px] font-black text-white/[0.03] animate-pulse" style={{ animationDelay: `${i * 200}ms` }}>SYSTEM_OK</div>
              ))}
            </div>
            <span className="text-[8px] font-black text-white/5 uppercase tracking-[0.5em]">Auth Rev: 2.0 // Secured</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
