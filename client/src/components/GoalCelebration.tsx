import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { useWindowSize } from "react-use";

interface GoalCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  goalName?: string;
}

export default function GoalCelebration({ isOpen, onClose, goalName = "Goal" }: GoalCelebrationProps) {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5s
      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti width={width} height={height} numberOfPieces={500} recycle={false} />
        </div>
      )}
      
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md text-center border-primary/20 bg-gradient-to-b from-background to-primary/5">
          <DialogHeader>
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4 animate-bounce">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              Congratulations!
            </DialogTitle>
            <DialogDescription className="text-lg pt-2">
              You've completed your goal: <br/>
              <span className="font-bold text-foreground block mt-1 text-xl">"{goalName}"</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            <p className="text-muted-foreground">
              This is a huge milestone on your financial journey. Keep up the amazing work!
            </p>
          </div>

          <Button onClick={onClose} className="w-full text-lg py-6 shadow-lg shadow-primary/20">
            Keep Glowing Up!
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
