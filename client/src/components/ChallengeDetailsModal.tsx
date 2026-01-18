import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, Target } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
    type?: string; // 'save', 'count', 'streak'
  } | null;
}

export default function ChallengeDetailsModal({ isOpen, onClose, challenge }: ChallengeDetailsModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const joinChallengeMutation = useMutation({
    mutationFn: async (questId: string) => {
      // Logic to join/start challenge (create user_quest entry)
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

  if (!challenge) return null;

  const handleAction = () => {
    if (challenge.isActive) {
      onClose(); // Just view progress
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

          {challenge.isActive && (
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
          
          {!challenge.isActive && (
             <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
               <Target className="w-4 h-4" />
               <span>Goal: {challenge.target} {challenge.type === 'save' ? 'saved' : 'actions'}</span>
             </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {!challenge.isCompleted && (
            <Button onClick={handleAction} disabled={joinChallengeMutation.isPending}>
              {joinChallengeMutation.isPending ? "Joining..." : 
               challenge.isActive ? "Continue" : "Start Challenge"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
