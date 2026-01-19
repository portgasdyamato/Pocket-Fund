import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Star, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Trophy,
  Home,
  ShoppingBag,
  Shield,
  HelpCircle,
  Calculator,
  Lock,
  TrendingUp,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Quest, UserQuest } from "@shared/schema";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const iconMap: Record<string, any> = {
  "star": Star,
  "home": Home,
  "shopping-bag": ShoppingBag,
  "shield": Shield,
  "help-circle": HelpCircle,
  "calculator": Calculator,
  "lock": Lock,
  "trending-up": TrendingUp,
  "shield-check": Shield,
};

export default function LevelUp() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [step, setStep] = useState(0); // 0 = intro, 1+ = slides, last = quiz
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const { width, height } = useWindowSize();

  const { data: allQuests = [], isLoading } = useQuery<Quest[]>({
    queryKey: ["/api/quests"],
  });

  const { data: userQuests = [] } = useQuery<UserQuest[]>({
    queryKey: ["/api/user/quests"],
  });

  const literacyQuests = useMemo(() => {
    return allQuests.filter(q => q.category === 'literacy');
  }, [allQuests]);

  const completeMutation = useMutation({
    mutationFn: async (questId: string) => {
      await apiRequest(`/api/quests/${questId}/complete`, "POST", {
        completionNote: "Literacy Quest Completed!"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/quests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsCompleted(true);
    },
  });

  const startQuest = (quest: Quest) => {
    setActiveQuest(quest);
    setStep(0);
    setSelectedOption(null);
    setIsCompleted(false);
  };

  const closeQuest = () => {
    setActiveQuest(null);
    setStep(0);
    setIsCompleted(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-primary/10 text-primary";
      case "Medium": return "bg-secondary/10 text-secondary";
      case "Hard": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading Quests...</div>;
  }

  if (activeQuest) {
    const content = JSON.parse(activeQuest.content);
    const slides = content.slides || [];
    const quiz = content.quiz;
    const totalSteps = slides.length + 2; // intro + slides + quiz

    const isLastStep = step === totalSteps - 1;
    const currentSlide = step > 0 && step <= slides.length ? slides[step - 1] : null;

    const handleNext = () => {
      if (step < totalSteps - 1) {
        setStep(step + 1);
      } else if (selectedOption === quiz.answer) {
        completeMutation.mutate(activeQuest.id);
      } else if (selectedOption !== null) {
        toast({
          title: "Not quite!",
          description: "Try again to find the correct answer.",
          variant: "destructive"
        });
      }
    };

    const handleBack = () => {
      if (step > 0) setStep(step - 1);
    };

    return (
      <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
        {isCompleted && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}
        
        <Card className="w-full max-w-2xl overflow-hidden backdrop-blur-xl bg-card/50 border-primary/20 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-muted">
            <motion.div 
               className="h-full bg-primary"
               initial={{ width: 0 }}
               animate={{ width: `${(step / (totalSteps - 1)) * 100}%` }}
            />
          </div>

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Button variant="ghost" size="icon" onClick={closeQuest}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                {activeQuest.points} Pts
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-8 min-h-[400px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {isCompleted ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6 flex flex-col items-center justify-center h-full"
                >
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                    <Trophy className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Quest Complete!</h2>
                    <p className="text-muted-foreground">
                      You've earned {activeQuest.points} points and leveled up your financial knowledge.
                    </p>
                  </div>
                  <Button size="lg" className="w-full rounded-full" onClick={closeQuest}>
                    Awesome!
                  </Button>
                </motion.div>
              ) : step === 0 ? (
                <motion.div 
                  key="intro"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                     <div className="text-6xl p-4 bg-primary/10 rounded-2xl">
                        {activeQuest.icon.length > 5 ? (
                           <TrendingUp className="w-12 h-12 text-primary" />
                        ) : activeQuest.icon}
                     </div>
                     <h2 className="text-3xl font-bold">{activeQuest.title}</h2>
                     <p className="text-lg text-muted-foreground">{activeQuest.description}</p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl border border-primary/10">
                    <p className="text-sm italic ">By the end of this quest, you'll be a pro at {activeQuest.title.toLowerCase()}!</p>
                  </div>
                </motion.div>
              ) : currentSlide ? (
                <motion.div 
                  key={`slide-${step}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col items-center text-center space-y-6 pt-4">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                      {currentSlide.icon && iconMap[currentSlide.icon] ? (
                        (() => {
                          const IconComp = iconMap[currentSlide.icon];
                          return <IconComp className="w-12 h-12 text-primary" />;
                        })()
                      ) : (
                        <BookOpen className="w-12 h-12 text-primary" />
                      )}
                    </div>
                    <h2 className="text-3xl font-bold">{currentSlide.title}</h2>
                    <p className="text-xl leading-relaxed text-foreground/90">
                      {currentSlide.text}
                    </p>
                  </div>
                </motion.div>
              ) : isLastStep ? (
                <motion.div 
                   key="quiz"
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="space-y-6"
                >
                  <div className="text-center">
                    <Badge className="mb-4">Final Challenge</Badge>
                    <h2 className="text-2xl font-bold mb-6">{quiz.question}</h2>
                  </div>
                  <div className="space-y-3">
                    {quiz.options.map((option: string, index: number) => (
                      <Button
                        key={index}
                        variant={selectedOption === index ? "default" : "outline"}
                        className={`w-full justify-start h-auto py-4 px-6 text-left transition-all ${
                          selectedOption === index ? 'ring-2 ring-primary ring-offset-2' : ''
                        }`}
                        onClick={() => setSelectedOption(index)}
                      >
                        <span className="w-8 h-8 rounded-full border flex items-center justify-center mr-4 shrink-0 font-bold">
                          {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {!isCompleted && (
              <div className="flex gap-4 pt-8">
                {step > 0 && (
                  <Button variant="ghost" onClick={handleBack} className="flex-1">
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                )}
                <Button onClick={handleNext} className="flex-1 rounded-full group">
                  {isLastStep ? "Submit Quiz" : "Continue"} 
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">Level Up</h1>
            <p className="text-muted-foreground text-lg italic">Master your money through bite-sized missions 🚀</p>
          </div>
          <div className="p-4 bg-primary/10 rounded-2xl flex items-center gap-4 border border-primary/20">
            <Trophy className="w-8 h-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">Pro Badge</p>
              <p className="text-xs text-muted-foreground">Complete 5 quests to unlock</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {literacyQuests.map((quest) => {
            const userQuest = userQuests.find(uq => uq.questId === quest.id);
            const isDone = !!userQuest?.completed;

            return (
              <Card 
                key={quest.id} 
                className={`group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/40 to-card/60 border hover:border-primary/60 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer ${
                  isDone ? 'border-primary/40 opacity-90' : 'border-primary/20'
                }`} 
                onClick={() => startQuest(quest)}
                data-testid={`card-quest-${quest.id}`}
              >
                {isDone && (
                  <div className="absolute top-0 right-0 p-4">
                    <CheckCircle2 className="w-6 h-6 text-primary fill-primary/10" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                      {iconMap[quest.icon] ? (
                        (() => {
                          const IconComp = iconMap[quest.icon];
                          return <IconComp className="w-12 h-12 text-primary" />;
                        })()
                      ) : (
                        quest.icon.length > 5 ? <TrendingUp className="w-12 h-12 text-primary" /> : quest.icon
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-2xl mb-2">{quest.title}</CardTitle>
                  <div className="flex gap-2 mb-4">
                    <Badge className={getDifficultyColor(quest.difficulty)} variant="secondary">
                      {quest.difficulty}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 border-primary/40">
                      <Star className="w-3 h-3 text-primary" />
                      {quest.points} XP
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2 mb-6">
                    {quest.description}
                  </p>
                  <Button 
                    variant={isDone ? "outline" : "default"} 
                    className="w-full rounded-full transition-all group-hover:bg-primary group-hover:text-primary-foreground"
                    disabled={completeMutation.isPending}
                  >
                    {isDone ? "Play Again" : "Start Quest"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {literacyQuests.length === 0 && !isLoading && (
          <Card className="border-dashed border-2 bg-muted/20">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">New Quests Loading...</h3>
              <p className="text-muted-foreground">Our financial ninjas are preparing your next training missions.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
