import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen, Star, ChevronRight, ChevronLeft, CheckCircle2,
  Trophy, Home, ShoppingBag, Shield, HelpCircle, Calculator,
  Lock, TrendingUp, ArrowLeft, Brain, Zap, Globe, Lightbulb,
  Target, Clock, Award, BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Quest, UserQuest } from "@shared/schema";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const iconMap: Record<string, any> = {
  "star": Star, "home": Home, "shopping-bag": ShoppingBag,
  "shield": Shield, "help-circle": HelpCircle, "calculator": Calculator,
  "lock": Lock, "trending-up": TrendingUp, "zap": Zap,
  "globe": Globe, "brain": Brain, "target": Target,
};

export default function LearnPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { width, height } = useWindowSize();

  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [step, setStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const { data: allQuests = [], isLoading } = useQuery<Quest[]>({ queryKey: ["/api/quests"] });
  const { data: userQuests = [] } = useQuery<UserQuest[]>({ queryKey: ["/api/user/quests"] });

  const literacyQuests = useMemo(() =>
    allQuests.filter(q => q.category === "literacy"), [allQuests]);

  const completeMutation = useMutation({
    mutationFn: async (questId: string) => {
      return await apiRequest(`/api/quests/${questId}/complete`, "POST", { completionNote: "Literacy Quest Completed!" });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/quests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/quests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/streak"] });
      setIsCompleted(true);
      if (data?.pointsEarned) {
        toast({ title: `+${data.pointsEarned} XP Earned! 🎉`, description: `"${data.questTitle}" completed!` });
      }
    },
  });

  const { masteryPercentage, completedCount } = useMemo(() => {
    if (literacyQuests.length === 0) return { masteryPercentage: 0, completedCount: 0 };
    const done = literacyQuests.filter(q => userQuests.some(uq => uq.questId === q.id && uq.completed)).length;
    return { masteryPercentage: Math.round((done / literacyQuests.length) * 100), completedCount: done };
  }, [literacyQuests, userQuests]);

  const courseData = useMemo(() => {
    if (!activeQuest) return null;
    try {
      const content = JSON.parse(activeQuest.content);
      const slides = content.slides || [];
      const quizzes = content.quizzes || (content.quiz ? [content.quiz] : []);
      return { slides, quizzes, totalSteps: slides.length + quizzes.length + 1 };
    } catch { return null; }
  }, [activeQuest]);

  const startQuest = (quest: Quest) => {
    setActiveQuest(quest); setStep(0);
    setSelectedOption(null); setIsCompleted(false); setShowSolution(false);
  };
  const closeQuest = () => {
    setActiveQuest(null); setStep(0);
    setIsCompleted(false); setShowSolution(false); setSelectedOption(null);
  };

  const handleNext = () => {
    if (!courseData || !activeQuest) return;
    const { slides, quizzes, totalSteps } = courseData;
    const isOnQuiz = step > slides.length;
    if (!isOnQuiz) { setStep(s => s + 1); setSelectedOption(null); setShowSolution(false); return; }

    const quizIdx = step - slides.length - 1;
    const currentQuiz = quizzes[quizIdx];
    if (selectedOption === null) { toast({ title: "Select an answer to continue." }); return; }

    if (selectedOption === currentQuiz.answer) {
      if (step === totalSteps - 1) { completeMutation.mutate(activeQuest.id); }
      else { setStep(s => s + 1); setSelectedOption(null); setShowSolution(false); }
    } else {
      setShowSolution(true);
      toast({ title: "Not quite!", description: "The correct answer is highlighted. Retry or move on.", variant: "destructive" });
    }
  };

  const handleBack = () => {
    if (step > 0) { setStep(s => s - 1); setSelectedOption(null); setShowSolution(false); }
  };

  const getDifficultyColor = (d: string) =>
    d === "Easy" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
    : d === "Medium" ? "text-amber-400 bg-amber-400/10 border-amberald-400/20"
    : "text-red-400 bg-red-400/10 border-red-400/20";

  // ── COURSE VIEW ──────────────────────────────────────────
  if (activeQuest && courseData) {
    const { slides, quizzes, totalSteps } = courseData;
    const isOnQuiz = step > slides.length;
    const quizIdx = isOnQuiz ? step - slides.length - 1 : null;
    const currentQuiz = quizIdx !== null ? quizzes[quizIdx] : null;
    const currentSlide = step > 0 && step <= slides.length ? slides[step - 1] : null;
    const isLastStep = step === totalSteps - 1;
    const progressPct = totalSteps > 1 ? Math.round((step / (totalSteps - 1)) * 100) : 0;
    const IconComp = iconMap[activeQuest.icon] || TrendingUp;

    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col">
        {isCompleted && <Confetti width={width} height={height} recycle={false} numberOfPieces={400} gravity={0.12} colors={["#8B5CF6","#D946EF","#F59E0B","#2DD4BF"]} />}

        {/* Top bar */}
        <div className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={closeQuest} className="hover:bg-white/5 rounded-xl shrink-0">
              <ArrowLeft className="w-5 h-5 text-white/50" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{activeQuest.title}</span>
                <span className="text-xs font-black text-primary">{progressPct}%</span>
              </div>
              <Progress value={progressPct} className="h-2 bg-white/5" />
            </div>
            <div className="shrink-0 px-3 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-black flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-yellow-500" />
              {activeQuest.points} XP
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-6xl mx-auto w-full flex gap-0 md:gap-8 px-4 py-8">
          {/* Sidebar */}
          <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-2">
            <div className="sticky top-24">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3 px-2">Course Outline</p>
              {/* Intro */}
              <button
                onClick={() => { setStep(0); setSelectedOption(null); setShowSolution(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 text-sm font-bold transition-all ${step === 0 ? "bg-primary/15 text-white border border-primary/30" : "text-white/40 hover:text-white/70 hover:bg-white/5"}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${step === 0 ? "bg-primary text-white" : step > 0 ? "bg-green-500 text-white" : "bg-white/10 text-white/40"}`}>
                  {step > 0 ? <CheckCircle2 className="w-3.5 h-3.5" /> : "✦"}
                </div>
                Introduction
              </button>
              {/* Slides */}
              {slides.map((_: any, i: number) => (
                <button key={i} onClick={() => { setStep(i + 1); setSelectedOption(null); setShowSolution(false); }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 text-sm font-bold transition-all ${step === i + 1 ? "bg-primary/15 text-white border border-primary/30" : "text-white/40 hover:text-white/70 hover:bg-white/5"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${step === i + 1 ? "bg-primary text-white" : step > i + 1 ? "bg-green-500 text-white" : "bg-white/10 text-white/40"}`}>
                    {step > i + 1 ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className="truncate">{slides[i]?.title || `Lesson ${i + 1}`}</span>
                </button>
              ))}
              {/* Quiz steps */}
              {quizzes.map((_: any, i: number) => (
                <button key={`quiz-${i}`} onClick={() => { if (step >= slides.length + i + 1) { setStep(slides.length + i + 1); setSelectedOption(null); setShowSolution(false); }}}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 text-sm font-bold transition-all ${step === slides.length + i + 1 ? "bg-accent/15 text-white border border-accent/30" : "text-white/40 hover:text-white/70 hover:bg-white/5"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${step === slides.length + i + 1 ? "bg-accent text-white" : step > slides.length + i + 1 ? "bg-green-500 text-white" : "bg-white/10 text-white/40"}`}>
                    {step > slides.length + i + 1 ? <CheckCircle2 className="w-3.5 h-3.5" /> : `Q${i + 1}`}
                  </div>
                  Quiz {i + 1}
                </button>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {/* Completed */}
              {isCompleted ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-20 space-y-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary blur-3xl opacity-20 rounded-full" />
                    <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-[32%] flex items-center justify-center relative shadow-2xl">
                      <Trophy className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-3">Course Complete</p>
                    <h2 className="text-5xl font-black tracking-tighter mb-4">{activeQuest.title}</h2>
                    <p className="text-xl text-white/50 max-w-lg mx-auto">You've mastered this lesson and earned <span className="text-yellow-400 font-black">{activeQuest.points} XP</span> toward your financial education.</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                    {[{label: "Slides Read", val: slides.length}, {label: "Questions", val: quizzes.length}, {label: "XP Earned", val: `+${activeQuest.points}`}].map(s => (
                      <div key={s.label} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <p className="text-2xl font-black text-primary">{s.val}</p>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <Button size="lg" onClick={closeQuest} className="h-14 px-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-base premium-shadow">
                    Back to Courses
                  </Button>
                </motion.div>

              ) : step === 0 ? (
                /* Intro */
                <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                  <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-primary/10 to-accent/5 border border-white/10 p-10">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                      <IconComp className="w-48 h-48 text-white" />
                    </div>
                    <div className="relative">
                      <div className={`inline-flex px-3 py-1 rounded-xl border text-[10px] font-black uppercase tracking-widest mb-6 ${getDifficultyColor(activeQuest.difficulty)}`}>{activeQuest.difficulty}</div>
                      <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 leading-tight">{activeQuest.title}</h1>
                      <p className="text-lg text-white/60 leading-relaxed max-w-2xl mb-8">{activeQuest.description}</p>
                      <div className="flex flex-wrap gap-6">
                        {[{icon: BookOpen, label: `${slides.length} Lessons`},{icon: Target, label: `${quizzes.length} Quiz Questions`},{icon: Award, label: `${activeQuest.points} XP Reward`},{icon: Clock, label: "~10 min read"}].map(({icon: Icon, label}) => (
                          <div key={label} className="flex items-center gap-2 text-sm text-white/50 font-bold">
                            <Icon className="w-4 h-4 text-primary" />{label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {slides.slice(0, 4).map((s: any, i: number) => (
                      <div key={i} className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-xs font-black text-primary">{i+1}</div>
                        <div>
                          <p className="font-bold text-sm text-white mb-1">{s.title}</p>
                          <p className="text-xs text-white/40 line-clamp-2">{s.text?.substring(0, 80)}...</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

              ) : currentSlide ? (
                /* Slide */
                <motion.div key={`slide-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Lesson {step} of {slides.length}</span>
                  </div>
                  <div className="rounded-[28px] bg-white/[0.03] border border-white/10 overflow-hidden">
                    {/* Slide header */}
                    <div className="bg-gradient-to-r from-primary/10 to-transparent border-b border-white/5 p-8 pb-6">
                      <div className="flex items-start gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          {currentSlide.icon && iconMap[currentSlide.icon]
                            ? (() => { const I = iconMap[currentSlide.icon]; return <I className="w-7 h-7 text-primary" />; })()
                            : <BookOpen className="w-7 h-7 text-primary" />
                          }
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Key Concept</p>
                          <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-snug">{currentSlide.title}</h2>
                        </div>
                      </div>
                    </div>
                    {/* Slide body */}
                    <div className="p-8 space-y-8">
                      <div className="text-lg leading-relaxed text-white/70 font-medium space-y-4">
                        {currentSlide.text.split('\n\n').map((paragraph: string, i: number) => (
                          <p key={i} className="whitespace-pre-wrap">{paragraph}</p>
                        ))}
                      </div>
                      {currentSlide.keyTakeaway && (
                        <div className="flex items-start gap-4 p-5 rounded-2xl bg-yellow-500/5 border border-yellow-500/20">
                          <Lightbulb className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-yellow-400 mb-1.5">Key Takeaway</p>
                            <p className="text-sm font-bold text-white/80 leading-relaxed">{currentSlide.keyTakeaway}</p>
                          </div>
                        </div>
                      )}
                      {currentSlide.example && (
                        <div className="flex items-start gap-4 p-5 rounded-2xl bg-primary/5 border border-primary/20">
                          <BarChart3 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1.5">Real Example</p>
                            <p className="text-sm text-white/70 leading-relaxed">{currentSlide.example}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

              ) : currentQuiz ? (
                /* Quiz */
                <motion.div key={`quiz-${step}`} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                        <Target className="w-4 h-4 text-accent" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-accent">Knowledge Check</span>
                    </div>
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Question {(quizIdx ?? 0) + 1} / {quizzes.length}</span>
                  </div>

                  <div className="rounded-[28px] bg-white/[0.03] border border-white/10 overflow-hidden">
                    <div className="p-8 border-b border-white/5">
                      <h2 className="text-xl md:text-2xl font-black leading-snug">{currentQuiz.question}</h2>
                    </div>
                    <div className="p-6 space-y-3">
                      {currentQuiz.options.map((option: string, index: number) => {
                        const isCorrect = index === currentQuiz.answer;
                        const isSelected = selectedOption === index;
                        const isWrong = isSelected && !isCorrect && showSolution;
                        const showCorrect = showSolution && isCorrect;

                        return (
                          <button key={index}
                            className={`w-full text-left p-5 rounded-2xl border transition-all flex items-start gap-4 group ${
                              isWrong ? "border-red-500/50 bg-red-500/10"
                              : showCorrect ? "border-green-500/50 bg-green-500/10"
                              : isSelected && !showSolution ? "border-primary/50 bg-primary/10"
                              : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20"
                            }`}
                            onClick={() => !showSolution && setSelectedOption(index)}
                            disabled={showSolution && !isCorrect && !isSelected}
                          >
                            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 font-black text-sm transition-all ${
                              isWrong ? "bg-red-500 border-red-500 text-white"
                              : showCorrect ? "bg-green-500 border-green-500 text-white"
                              : isSelected && !showSolution ? "bg-primary border-primary text-white"
                              : "border-white/15 text-white/30 group-hover:border-white/30"
                            }`}>
                              {String.fromCharCode(65 + index)}
                            </div>
                            <div className="flex-1 pt-0.5">
                              <p className={`font-bold leading-snug ${(isSelected || showCorrect) ? "text-white" : "text-white/60"}`}>{option}</p>
                              {isWrong && <p className="text-xs text-red-400 mt-1 font-black uppercase tracking-widest">✗ Incorrect</p>}
                              {showCorrect && <p className="text-xs text-green-400 mt-1 font-black uppercase tracking-widest">✓ Correct Answer</p>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {showSolution && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="mx-6 mb-6 p-5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
                        <Lightbulb className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-white/80 mb-3">Review the correct answer highlighted above, then retry or continue.</p>
                          <Button size="sm" variant="outline"
                            className="h-9 px-5 rounded-xl border-white/10 text-xs font-black uppercase tracking-widest"
                            onClick={() => { setShowSolution(false); setSelectedOption(null); }}>
                            Retry
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Nav buttons */}
            {!isCompleted && (
              <div className="flex gap-3 mt-8">
                {step > 0 && (
                  <Button variant="outline" onClick={handleBack} className="h-14 px-6 rounded-2xl border-white/10 bg-white/5 font-black uppercase tracking-widest text-xs">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                )}
                <Button onClick={handleNext} disabled={completeMutation.isPending}
                  className="flex-1 h-14 rounded-2xl bg-white text-black hover:bg-white/90 font-black uppercase tracking-tighter text-sm premium-shadow-white group">
                  {showSolution ? "Continue Anyway"
                    : isLastStep ? (completeMutation.isPending ? "Saving…" : "Complete Course")
                    : "Next"}
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }

  // ── LIST VIEW ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <main className="max-w-7xl mx-auto px-6 py-16 space-y-12">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-3">Financial Academy</p>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter italic uppercase">Learn <span className="text-primary">& Earn</span></h1>
            <p className="text-white/40 text-lg mt-3 max-w-xl">Master money basics through bite-sized lessons designed for complete beginners.</p>
          </div>
          {/* Progress overview */}
          <div className="flex gap-4 shrink-0">
            {[{label: "Completed", val: completedCount, icon: CheckCircle2, color: "text-green-400"},
              {label: "Total Courses", val: literacyQuests.length, icon: BookOpen, color: "text-primary"},
              {label: "Progress", val: `${masteryPercentage}%`, icon: BarChart3, color: "text-yellow-400"},
            ].map(({label, val, icon: Icon, color}) => (
              <div key={label} className="p-4 glass-morphism border-white/5 rounded-2xl text-center min-w-[90px]">
                <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
                <p className={`text-2xl font-black ${color}`}>{val}</p>
                <p className="text-[9px] text-white/30 uppercase tracking-widest mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="p-6 glass-morphism border-white/5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-black text-white/60">Overall Mastery</span>
            <span className="text-sm font-black text-primary">{masteryPercentage}% Complete</span>
          </div>
          <Progress value={masteryPercentage} className="h-3 bg-white/5" />
        </div>

        {/* Course cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {literacyQuests.map((quest, idx) => {
            const isDone = userQuests.some(uq => uq.questId === quest.id && uq.completed);
            const Icon = iconMap[quest.icon] || TrendingUp;
            let content = { slides: [] as any[], quizzes: [] as any[] };
            try { const c = JSON.parse(quest.content); content = { slides: c.slides || [], quizzes: c.quizzes || (c.quiz ? [c.quiz] : []) }; } catch {}

            return (
              <motion.div key={quest.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <div
                  onClick={() => startQuest(quest)}
                  className={`group h-full flex flex-col rounded-[28px] border cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 ${
                    isDone ? "bg-white/[0.03] border-green-500/20" : "bg-white/[0.03] border-white/10 hover:border-primary/30"
                  }`}
                >
                  {/* Card top colour strip */}
                  <div className={`h-1.5 w-full ${isDone ? "bg-gradient-to-r from-green-500 to-emerald-400" : "bg-gradient-to-r from-primary to-accent"}`} />

                  <div className="p-6 flex flex-col flex-1">
                    {/* Icon + done badge */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      {isDone && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-green-500/10 border border-green-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                          <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Done</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getDifficultyColor(quest.difficulty)}`}>{quest.difficulty}</span>
                      </div>
                      <h3 className="text-xl font-black tracking-tight leading-snug mb-2">{quest.title}</h3>
                      <p className="text-sm text-white/40 leading-relaxed line-clamp-2">{quest.description}</p>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-white/30 font-bold">{content.slides.length} lessons</span>
                        <span className="text-white/10">·</span>
                        <span className="text-[10px] text-white/30 font-bold">{content.quizzes.length} quiz</span>
                      </div>
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-[10px] font-black text-yellow-400">+{quest.points} XP</span>
                      </div>
                    </div>

                    <Button className={`w-full mt-4 h-11 rounded-xl font-black text-xs uppercase tracking-widest ${isDone ? "bg-white/5 border border-white/10 text-white/40 hover:bg-white/10" : "bg-primary hover:bg-primary/90 text-white"}`}>
                      {isDone ? "Review Again" : "Start Learning"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {literacyQuests.length === 0 && !isLoading && (
          <div className="p-20 text-center rounded-[40px] border-2 border-dashed border-white/5">
            <Brain className="w-16 h-16 text-white/10 mx-auto mb-4 animate-pulse" />
            <h3 className="text-2xl font-black mb-2">Courses Loading…</h3>
            <p className="text-white/30">Content is being prepared. Please refresh in a moment.</p>
          </div>
        )}
      </main>
    </div>
  );
}
