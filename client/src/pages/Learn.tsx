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

  const { data: allQuests = [], isLoading, refetch: refetchQuests } = useQuery<Quest[]>({ 
    queryKey: ["/api/quests"],
    staleTime: 0, // Ensure we always check for fresh data on mount
  });
  const { data: userQuests = [], refetch: refetchUserQuests } = useQuery<UserQuest[]>({ queryKey: ["/api/user/quests"] });


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

  const { masteryPercentage, completedCount, totalEarnedXP } = useMemo(() => {
    if (literacyQuests.length === 0) return { masteryPercentage: 0, completedCount: 0, totalEarnedXP: 0 };
    const completedLiteracy = literacyQuests.filter(q => userQuests.some(uq => uq.questId === q.id && uq.completed));
    const done = completedLiteracy.length;
    const xp = completedLiteracy.reduce((sum, q) => sum + (q.points || 0), 0);
    return { 
      masteryPercentage: Math.round((done / literacyQuests.length) * 100), 
      completedCount: done,
      totalEarnedXP: xp
    };
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
                /* Completion Screen - THE WOW FACTOR */
                <motion.div key="done" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16 px-8 max-w-2xl mx-auto">
                  <div className="relative mb-12">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 10 }} className="w-32 h-32 rounded-[40px] bg-gradient-to-tr from-yellow-400 to-orange-500 mx-auto flex items-center justify-center premium-shadow relative z-10">
                      <Trophy className="w-16 h-16 text-black" />
                    </motion.div>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 w-44 h-44 -top-6 -left-6 mx-auto border-2 border-dashed border-yellow-500/20 rounded-full" />
                  </div>

                  <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-4">Mastery <span className="text-primary">Achieved!</span></h2>
                  <p className="text-white/50 text-xl font-medium mb-10 leading-relaxed">
                    You've successfully completed <span className="text-white">"{activeQuest.title}"</span>. 
                    Your financial intelligence is growing.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-12">
                    <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Knowledge</p>
                      <p className="text-3xl font-black italic">100%</p>
                    </div>
                    <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-yellow-400 mb-1">XP Earned</p>
                      <p className="text-3xl font-black italic">+{activeQuest.points}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Button onClick={closeQuest} className="h-16 rounded-2xl bg-primary text-white font-black text-lg uppercase tracking-widest premium-shadow hover:scale-[1.02] active:scale-[0.98] transition-all">
                      Collect Rewards & Continue
                    </Button>
                    <p className="text-white/20 text-xs font-bold uppercase tracking-[0.3em]">Module Verified by Financial GlowUp Academy</p>
                  </div>
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
                <motion.div key={`slide-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6 max-h-[75vh] overflow-y-auto pr-4 custom-scrollbar">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic">LESSON {step} OF {slides.length}</span>
                  </div>
                  <div className="rounded-[32px] bg-white/[0.02] border border-white/5 overflow-hidden shadow-2xl shadow-black/40">
                    {/* Slide header */}
                    <div className="bg-primary p-10 pb-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[22px] bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                          {currentSlide.icon && iconMap[currentSlide.icon]
                            ? (() => { const I = iconMap[currentSlide.icon]; return <I className="w-8 h-8 text-white shadow-sm" />; })()
                            : <BookOpen className="w-8 h-8 text-white" />
                          }
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/70 mb-2">Core Curriculum</p>
                          <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight uppercase italic text-white">{currentSlide.title}</h2>
                        </div>
                      </div>
                    </div>
                    {/* Slide body */}
                    <div className="p-10 space-y-10">
                      <div className="text-xl leading-[1.8] text-white/70 font-medium space-y-6">
                        {currentSlide.text.split('\n\n').map((paragraph: string, i: number) => (
                          <p key={i} className="whitespace-pre-wrap">{paragraph}</p>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                        {currentSlide.keyTakeaway && (
                          <div className="flex items-start gap-4 p-6 rounded-[24px] bg-yellow-500/[0.03] border border-yellow-500/10 hover:border-yellow-500/30 transition-colors">
                            <Lightbulb className="w-6 h-6 text-yellow-400 shrink-0 mt-1" />
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-yellow-400/60 mb-2">Key Strategy</p>
                              <p className="text-sm font-bold text-white/90 leading-relaxed">{currentSlide.keyTakeaway}</p>
                            </div>
                          </div>
                        )}
                        {currentSlide.example && (
                          <div className="flex items-start gap-4 p-6 rounded-[24px] bg-primary/[0.03] border border-primary/10 hover:border-primary/30 transition-colors">
                            <Zap className="w-6 h-6 text-primary shrink-0 mt-1" />
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Reality Check</p>
                              <p className="text-sm text-white/80 leading-relaxed">{currentSlide.example}</p>
                            </div>
                          </div>
                        )}
                      </div>
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

        {/* Compact Mastery Hub Header */}
        <div className="relative overflow-hidden rounded-[32px] p-6 md:p-10 ">
           {/* Abstract Decorative Background */}
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
           
           <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-center lg:items-center">
              
              {/* Left Column: Compact Branding & Intro */}
              <div className="flex-1 space-y-6 text-center lg:text-left">
                <div className="flex flex-col md:flex-row items-center gap-3 lg:justify-start justify-center">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <Brain className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Financial Academy</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-3 rounded-xl border border-white/5 text-[8px] font-black uppercase tracking-[0.2em] bg-white/[0.02] hover:bg-white/10 text-white/40 hover:text-white transition-all shadow-inner"
                    onClick={async () => {
                      try {
                        await apiRequest("/api/admin/seed-courses", "POST");
                        await refetchQuests();
                        await refetchUserQuests();
                        toast({ title: "Database Synchronized", description: "The latest course content has been downloaded." });
                      } catch (e: any) {
                        toast({ title: "Sync Failed", description: e.message || "Could not reach database.", variant: "destructive" });
                      }
                    }}
                  >
                    Sync Latest Content
                  </Button>
                </div>

                <div className="space-y-3">
                  <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase leading-[0.9] text-white">
                    Learn <span className="text-primary italic">& Earn Points</span>
                  </h1>
                  <p className="text-white/40 text-base md:text-lg max-w-lg font-medium leading-relaxed mx-auto lg:mx-0">
                    Master your capital through deep-dive courses. Level up your <span className="text-white/60">financial IQ</span> and unlock your ultimate earning potential.
                  </p>
                </div>
              </div>

              {/* Right Column: Compact Mastery Card */}
              <div className="w-full lg:w-[360px] shrink-0">
                 <div className="p-6 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl shadow-xl relative overflow-hidden group hover:border-primary/30 transition-all duration-500">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className="relative z-10 space-y-6">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic">Progress</p>
                          </div>
                          <div className="px-2.5 py-0.5 rounded-lg bg-primary text-[9px] font-black text-white">
                            LEVEL {Math.floor(completedCount / 3) + 1}
                          </div>
                       </div>

                       <div className="flex items-baseline gap-3">
                          <span className="text-6xl font-black italic tracking-tighter text-white">
                            {masteryPercentage}%
                          </span>
                          <div className="flex flex-col leading-none">
                             <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Mastery Hub</span>

                          </div>
                       </div>

                       {/* The Progress Track */}
                       <div className="space-y-3">
                          <div className="relative h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${masteryPercentage}%` }}
                              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                              className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full relative"
                            >
                               <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-shimmer" />
                            </motion.div>
                          </div>
                       </div>

                       {/* Compact Stats Grid */}
                       <div className="grid grid-cols-3 gap-2 pt-6 border-t border-white/5">
                          {[
                            { label: 'Done', val: completedCount, color: 'text-emerald-400' },
                            { label: 'Courses', val: literacyQuests.length, color: 'text-primary' },
                            { label: 'Total XP', val: totalEarnedXP, color: 'text-amber-400' }
                          ].map((stat) => (
                            <div key={stat.label} className="text-center">
                               <p className={`text-lg font-black italic mb-0.5 ${stat.color}`}>{stat.val}</p>
                               <p className="text-[8px] text-white/20 font-black uppercase tracking-widest">{stat.label}</p>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Course cards grid with improved spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    <h3 className="text-xl font-black tracking-tight mb-2 group-hover:text-primary transition-colors">{quest.title}</h3>
                    <p className="text-sm text-white/40 line-clamp-2 mb-6 leading-relaxed flex-1">{quest.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Duration</span>
                          <span className="text-[11px] font-black text-white/60">
                            ~{(content as any).duration || content.slides.length * 2} mins
                          </span>
                        </div>
                        <div className="w-px h-6 bg-white/5" />
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Questions</span>
                          <span className="text-[11px] font-black text-white/60">{content.quizzes.length} Checks</span>
                        </div>
                      </div>
                      
                      <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        isDone ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-primary text-white premium-shadow hover:scale-105 active:scale-95"
                      }`}>
                        {isDone ? "Review" : "Start Now"}
                      </div>
                    </div>
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
