import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, Clock, Target, CheckCircle2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

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
        title: "Challenge Accepted!",
        description: "Good luck on your journey!",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to join challenge. Please try again.",
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
        title: "Challenge Completed!",
        description: "Nicely done! Points added to your total.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete challenge. Please try again.",
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
            title: "Wait!",
            description: "Please enter which subscription you cancelled.",
            variant: "destructive"
          });
          return;
        }
        completeChallengeMutation.mutate({ questId: challenge.id, note });
      } else {
        onClose(); // Just view progress
      }
    } else {
      joinChallengeMutation.mutate(challenge.id);
    }
  };

  const progressPercentage = challenge.target 
    ? Math.min(100, ((challenge.progress || 0) / challenge.target) * 100) 
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {challenge.title}
            <Badge variant={
              challenge.difficulty === 'Hard' ? 'destructive' : 
              challenge.difficulty === 'Medium' ? 'default' : 'secondary'
            }>
              {challenge.difficulty}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {challenge.description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-primary" />
              <span>{challenge.points} Points</span>
            </div>
            {challenge.timeRemaining && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{challenge.timeRemaining}</span>
              </div>
            )}
          </div>

          {challenge.isActive && !isManual && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{challenge.progress} / {challenge.target}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {progressPercentage >= 100 ? "Completed!" : "Keep going!"}
              </p>
            </div>
          )}

          {challenge.isActive && isManual && (
            <div className="space-y-3 p-4 bg-primary/5 rounded-lg border border-primary/10 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-2">
                <Label htmlFor="note" className="text-sm font-semibold">Which platform did you cancel?</Label>
                <Input 
                  id="note" 
                  placeholder="e.g. Netflix, Spotify, etc." 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="bg-background/50"
                  autoFocus
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                Once you enter the name and click 'Complete', you'll earn your {challenge.points} points!
              </p>
            </div>
          )}
          
          {!challenge.isActive && !challenge.isCompleted && (
             <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/20 p-3 rounded-md border border-border/50">
               {isManual ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Target className="w-4 h-4" />}
               <span>Goal: {isManual ? "Manual confirmation" : `${challenge.target} ${challenge.type === 'save' ? 'saved' : 'actions'}`}</span>
             </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
            Close
          </Button>
          {!challenge.isCompleted && (
            <Button 
              onClick={handleAction} 
              disabled={joinChallengeMutation.isPending || completeChallengeMutation.isPending}
              className="flex-1 sm:flex-none bg-primary hover:bg-primary/90"
            >
              {joinChallengeMutation.isPending ? "Joining..." : 
               completeChallengeMutation.isPending ? "Completing..." :
               challenge.isActive ? (isManual ? "Complete Challenge" : "Continue") : "Start Challenge"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
