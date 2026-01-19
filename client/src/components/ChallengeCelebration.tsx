import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Trophy } from "lucide-react";
import { useWindowSize } from "react-use";

interface ChallengeCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  challengeName?: string;
  points?: number;
}

export default function ChallengeCelebration({ isOpen, onClose, challengeName = "Challenge", points = 0 }: ChallengeCelebrationProps) {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000); 
      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {showConfetti && (
        <div className="fixed inset-0 z-[100] pointer-events-none">
          <Confetti width={width} height={height} numberOfPieces={500} recycle={false} />
        </div>
      )}
      
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md text-center border-primary/20 bg-gradient-to-b from-background to-primary/5 z-[101]">
          <DialogHeader>
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4 animate-bounce">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              Challenge Complete!
            </DialogTitle>
            <DialogDescription className="text-lg pt-2">
              You've crushed it! <br/>
              <span className="font-bold text-foreground block mt-1 text-xl">"{challengeName}"</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-2xl font-bold text-primary">
              <Trophy className="w-6 h-6" />
              <span>+{points} Points Earned</span>
            </div>
            <p className="text-muted-foreground mt-2">
              Every challenge completed brings you one step closer to your financial goals.
            </p>
          </div>

          <Button onClick={onClose} className="w-full text-lg py-6 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
            Awesome!
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
