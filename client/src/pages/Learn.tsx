import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  ArrowLeft,
  Brain,
  Zap,
  Globe
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
  "zap": Zap,
  "globe": Globe,
  "brain": Brain,
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function LearnPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { width, height } = useWindowSize();

  // ── ALL hooks at top level ──────────────────────────────
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [step, setStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const { data: allQuests = [], isLoading } = useQuery<Quest[]>({
    queryKey: ["/api/quests"],
  });

  const { data: userQuests = [] } = useQuery<UserQuest[]>({
    queryKey: ["/api/user/quests"],
  });

  const literacyQuests = useMemo(() => {
    return allQuests.filter(q => q.category === "literacy");
  }, [allQuests]);

  const completeMutation = useMutation({
    mutationFn: async (questId: string) => {
      const res = await apiRequest(`/api/quests/${questId}/complete`, "POST", {
        completionNote: "Literacy Quest Completed!"
      });
      return res;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/quests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/quests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/streak"] });
      setIsCompleted(true);
      if (data?.pointsEarned) {
        toast({
          title: `+${data.pointsEarned} XP Earned! 🎉`,
          description: `You've completed "${data.questTitle || "the course"}". Keep learning!`,
        });
      }
    },
  });

  const { masteryPercentage } = useMemo(() => {
    if (literacyQuests.length === 0) return { masteryPercentage: 0 };
    const completedCount = literacyQuests.filter(q =>
      userQuests.some(uq => uq.questId === q.id && uq.completed)
    ).length;
    return {
      masteryPercentage: Math.round((completedCount / literacyQuests.length) * 100),
    };
  }, [literacyQuests, userQuests]);

  // ── Derived state from activeQuest (safe — no hooks) ───
  const courseData = useMemo(() => {
    if (!activeQuest) return null;
    try {
      const content = JSON.parse(activeQuest.content);
      const slides = content.slides || [];
      const quizzes = content.quizzes || (content.quiz ? [content.quiz] : []);
      const totalSteps = slides.length + quizzes.length + 1; // intro + slides + quizzes
      return { slides, quizzes, totalSteps };
    } catch {
      return null;
    }
  }, [activeQuest]);

  // ── Handlers ────────────────────────────────────────────
  const startQuest = (quest: Quest) => {
    setActiveQuest(quest);
    setStep(0);
    setSelectedOption(null);
    setIsCompleted(false);
    setShowSolution(false);
  };

  const closeQuest = () => {
    setActiveQuest(null);
    setStep(0);
    setIsCompleted(false);
    setShowSolution(false);
    setSelectedOption(null);
  };

  const handleNext = () => {
    if (!courseData || !activeQuest) return;
    const { slides, quizzes, totalSteps } = courseData;

    const isOnSlide = step > 0 && step <= slides.length;
    const isOnQuiz = step > slides.length;
    const isLastStep = step === totalSteps - 1;

    if (!isOnQuiz) {
      // Still on intro or a slide — advance
      setStep(s => s + 1);
      setSelectedOption(null);
      setShowSolution(false);
      return;
    }

    // On a quiz step
    const quizIdx = step - slides.length - 1;
    const currentQuiz = quizzes[quizIdx];

    if (selectedOption === null) {
      toast({ title: "Please select an answer to continue." });
      return;
    }

    if (selectedOption === currentQuiz.answer) {
      // Correct!
      if (isLastStep) {
        completeMutation.mutate(activeQuest.id);
      } else {
        setStep(s => s + 1);
        setSelectedOption(null);
        setShowSolution(false);
      }
    } else {
      // Wrong answer
      setShowSolution(true);
      toast({
        title: "Incorrect — but that's okay!",
        description: "The correct answer is highlighted in green. Review it, then retry or move on.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(s => s - 1);
      setSelectedOption(null);
      setShowSolution(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "text-green-400 bg-green-400/10";
      case "Medium": return "text-orange-400 bg-orange-400/10";
      case "Hard": return "text-red-400 bg-red-400/10";
      default: return "text-white/40 bg-white/5";
    }
  };

  // ── Render the active course view ───────────────────────
  const renderCourseView = () => {
    if (!activeQuest || !courseData) return null;
    const { slides, quizzes, totalSteps } = courseData;

    const isOnQuiz = step > slides.length;
    const quizIdx = isOnQuiz ? step - slides.length - 1 : null;
    const currentQuiz = quizIdx !== null ? quizzes[quizIdx] : null;
    const currentSlide = step > 0 && step <= slides.length ? slides[step - 1] : null;
    const isLastStep = step === totalSteps - 1;
    const progressPct = totalSteps > 1 ? (step / (totalSteps - 1)) * 100 : 0;

    return (
      <div className="min-h-screen bg-[#050505] p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
        {isCompleted && (
          <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.1} colors={["#8B5CF6", "#D946EF", "#2DD4BF"]} />
        )}

        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/20 rounded-full animate-[spin_60s_linear_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-accent/10 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-3xl z-10"
        >
          <Card className="w-full overflow-hidden glass-morphism border-white/10 shadow-3xl relative">
            {/* Progress bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-8 pt-8">
              <Button variant="ghost" size="icon" onClick={closeQuest} className="hover:bg-white/5 rounded-xl border border-white/5">
                <ArrowLeft className="w-5 h-5 text-white/40" />
              </Button>
              <div className="flex gap-4">
                <div className="px-4 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 fill-primary" />
                  {activeQuest.points} Pts
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-8 pb-10 pt-4 min-h-[480px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {/* ── Completed screen ── */}
                {isCompleted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-8 flex flex-col items-center justify-center h-full py-12"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary blur-3xl rounded-full opacity-30 animate-pulse" />
                      <div className="w-24 h-24 bg-primary text-white rounded-[32%] flex items-center justify-center relative shadow-2xl">
                        <Trophy className="w-12 h-12" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-4xl font-black tracking-tighter mb-4 uppercase italic">Lesson Completed!</h2>
                      <p className="text-white/40 font-medium text-lg max-w-md mx-auto">
                        You earned <span className="text-primary font-black">{activeQuest.points} XP</span> for completing this lesson.
                      </p>
                    </div>
                    <Button size="lg" className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xl premium-shadow" onClick={closeQuest}>
                      Back to Lessons
                    </Button>
                  </motion.div>

                ) : step === 0 ? (
                  /* ── Intro screen ── */
                  <motion.div
                    key="intro"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10 py-10"
                  >
                    <div className="flex flex-col items-center text-center space-y-6">
                      <div className="p-8 relative">
                        <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full" />
                        <div className="relative filter drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                          {iconMap[activeQuest.icon]
                            ? (() => { const I = iconMap[activeQuest.icon]; return <I className="w-32 h-32 text-primary" />; })()
                            : <TrendingUp className="w-32 h-32 text-primary" />
                          }
                        </div>
                      </div>
                      <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Lesson Overview</p>
                        <h2 className="text-5xl font-black tracking-tighter uppercase italic">{activeQuest.title}</h2>
                        <p className="text-xl text-white/50 font-medium leading-relaxed max-w-xl">{activeQuest.description}</p>
                        <div className="flex items-center justify-center gap-4 pt-2">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${getDifficultyColor(activeQuest.difficulty)}`}>{activeQuest.difficulty}</span>
                          <span className="text-sm text-white/30">{slides.length} lessons · {quizzes.length} quiz questions</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                ) : currentSlide ? (
                  /* ── Slide screen ── */
                  <motion.div
                    key={`slide-${step}`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="space-y-10 py-8"
                  >
                    <div className="flex flex-col items-center text-center space-y-8">
                      <div className="w-24 h-24 rounded-[30%] bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {currentSlide.icon && iconMap[currentSlide.icon]
                          ? (() => { const I = iconMap[currentSlide.icon]; return <I className="w-10 h-10 text-primary relative z-10" />; })()
                          : <BookOpen className="w-10 h-10 text-primary relative z-10" />
                        }
                      </div>
                      <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Slide {step} of {slides.length}</p>
                        <h2 className="text-3xl font-black tracking-tight">{currentSlide.title}</h2>
                        <p className="text-lg leading-relaxed text-white/60 font-medium max-w-2xl">
                          {currentSlide.text}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                ) : currentQuiz ? (
                  /* ── Quiz screen ── */
                  <motion.div
                    key={`quiz-${step}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8 py-4"
                  >
                    <div className="text-center space-y-4">
                      <div className="inline-flex px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent text-[10px] font-black uppercase tracking-widest">
                        Question {(quizIdx ?? 0) + 1} of {quizzes.length}
                      </div>
                      <h2 className="text-2xl font-black tracking-tight leading-tight">{currentQuiz.question}</h2>
                    </div>

                    <div className="space-y-3">
                      {currentQuiz.options.map((option: string, index: number) => {
                        const isCorrect = index === currentQuiz.answer;
                        const isSelected = selectedOption === index;
                        const isWrong = isSelected && !isCorrect && showSolution;

                        let borderClass = "border-white/5 hover:bg-white/10 hover:border-white/20";
                        if (isSelected && !showSolution) borderClass = "border-primary bg-primary/10 ring-1 ring-primary/50";
                        if (isWrong) borderClass = "border-red-500 bg-red-500/10";
                        if (showSolution && isCorrect) borderClass = "border-green-500 bg-green-500/10";

                        let dotClass = "border-white/10 text-white/40";
                        if (isSelected && !showSolution) dotClass = "bg-primary text-white border-transparent";
                        if (isWrong) dotClass = "bg-red-500 text-white border-transparent";
                        if (showSolution && isCorrect) dotClass = "bg-green-500 text-white border-transparent";

                        return (
                          <Button
                            key={index}
                            variant="outline"
                            className={`w-full justify-start h-auto py-4 px-5 text-left rounded-2xl border bg-white/5 transition-all ${borderClass}`}
                            onClick={() => !showSolution && setSelectedOption(index)}
                            disabled={showSolution && !isCorrect && !isSelected}
                          >
                            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mr-4 shrink-0 font-black text-xs transition-colors ${dotClass}`}>
                              {String.fromCharCode(65 + index)}
                            </div>
                            <div className="flex flex-col text-left">
                              <span className={`font-bold ${isSelected || (showSolution && isCorrect) ? "text-white" : "text-white/60"}`}>{option}</span>
                              {isWrong && <span className="text-[10px] text-red-400 mt-0.5 font-black uppercase tracking-widest">✗ Wrong Answer</span>}
                              {showSolution && isCorrect && <span className="text-[10px] text-green-400 mt-0.5 font-black uppercase tracking-widest">✓ Correct Answer</span>}
                            </div>
                          </Button>
                        );
                      })}
                    </div>

                    {showSolution && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center"
                      >
                        <p className="text-sm text-white/50 mb-3">Review the correct answer above, then retry or continue.</p>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="rounded-xl h-10 px-6 font-black uppercase tracking-widest text-[10px]"
                          onClick={() => { setShowSolution(false); setSelectedOption(null); }}
                        >
                          Retry Selection
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>

                ) : null}
              </AnimatePresence>

              {/* Navigation */}
              {!isCompleted && (
                <div className="flex gap-4 pt-8">
                  {step > 0 && (
                    <Button variant="outline" onClick={handleBack} className="flex-1 h-14 rounded-2xl border-white/5 bg-white/5 font-black uppercase tracking-widest text-[10px]">
                      <ChevronLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                  )}
                  <Button
                    onClick={handleNext}
                    disabled={completeMutation.isPending}
                    className="flex-[2] h-14 rounded-2xl bg-white text-black hover:bg-white/90 font-black uppercase tracking-tighter text-sm premium-shadow-white group"
                  >
                    {showSolution
                      ? "Move Forward"
                      : isLastStep
                      ? completeMutation.isPending ? "Saving…" : "Finish Quest"
                      : "Next Step"
                    }
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  };

  // ── Render the list view ────────────────────────────────
  const renderListView = () => (
    <div className="min-h-screen bg-[#050505] text-white">
      <main className="max-w-7xl mx-auto px-6 py-20 space-y-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-12"
        >
          <div className="space-y-4">
            <h1 className="text-6xl font-black tracking-tighter italic uppercase">Learn <span className="text-primary">& Earn</span></h1>
            <p className="text-white/40 text-2xl font-medium max-w-2xl leading-relaxed">
              Improve your financial literacy through <span className="text-white italic">interactive lessons</span>.
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-8 glass-morphism border-white/5 rounded-[40px] flex items-center gap-8 group"
          >
            <div className="w-20 h-20 bg-primary rounded-[28%] flex items-center justify-center relative shadow-2xl group-hover:rotate-12 transition-transform">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-2">Learning Status</p>
              <p className="text-3xl font-black tracking-tight">
                {masteryPercentage >= 100 ? "FINANCIAL ELITE" : masteryPercentage >= 50 ? "FINANCIAL PRO" : "FINANCIAL NOVICE"}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${masteryPercentage}%` }} className="h-full bg-primary" />
                </div>
                <span className="text-[10px] font-bold text-primary italic">{masteryPercentage}% Complete</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Course Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {literacyQuests.map((quest) => {
            const isDone = userQuests.some(uq => uq.questId === quest.id && uq.completed);
            return (
              <motion.div key={quest.id} variants={item}>
                <Card
                  className={`group h-full flex flex-col p-8 rounded-[40px] glass-morphism border-white/5 hover:border-primary/20 transition-all duration-500 cursor-pointer overflow-hidden relative ${isDone ? "opacity-70" : ""}`}
                  onClick={() => startQuest(quest)}
                >
                  {isDone && (
                    <div className="absolute top-8 right-8">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      </div>
                    </div>
                  )}

                  <div className="mb-8 relative">
                    <div className="text-[80px] group-hover:scale-110 transition-transform duration-500 filter group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                      {iconMap[quest.icon]
                        ? (() => { const I = iconMap[quest.icon]; return <I className="w-16 h-16 text-primary" />; })()
                        : <TrendingUp className="w-16 h-16 text-primary" />
                      }
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <h3 className="text-2xl font-black tracking-tight uppercase leading-tight">{quest.title}</h3>
                    <div className="flex gap-3 flex-wrap">
                      <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${getDifficultyColor(quest.difficulty)}`}>
                        {quest.difficulty}
                      </div>
                      <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest text-yellow-500 italic">
                        +{quest.points} XP
                      </div>
                    </div>
                    <p className="text-white/40 text-sm font-medium leading-relaxed line-clamp-2">
                      {quest.description}
                    </p>
                  </div>

                  <div className="mt-10">
                    <Button
                      variant={isDone ? "outline" : "default"}
                      className={`w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                        isDone ? "border-white/10 bg-transparent text-white/40 hover:bg-white/5" : "bg-primary text-white hover:bg-primary/90 premium-shadow"
                      }`}
                    >
                      {isDone ? "Retake Lesson" : "Start Lesson"}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {literacyQuests.length === 0 && !isLoading && (
          <motion.div variants={item} className="p-20 text-center rounded-[60px] border-2 border-dashed border-white/5 bg-white/[0.02]">
            <Brain className="w-20 h-20 text-white/10 mx-auto mb-6 animate-pulse" />
            <h3 className="text-3xl font-black tracking-tight mb-2">No Lessons Found</h3>
            <p className="text-white/30 text-lg">Check back later for more educational content.</p>
          </motion.div>
        )}
      </main>
    </div>
  );

  // ── Main render: switch between views ──────────────────
  return activeQuest ? renderCourseView() : renderListView();
}
