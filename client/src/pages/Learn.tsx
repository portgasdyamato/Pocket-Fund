import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen, Star, ChevronRight, ChevronLeft, CheckCircle2,
  Trophy, Home, ShoppingBag, Shield, HelpCircle, Calculator,
  Lock, TrendingUp, ArrowLeft, Brain, Zap, Globe, Lightbulb,
  Target, Clock, Award, BarChart3, Sparkles, BookCheck
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
    staleTime: 0,
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
    : d === "Medium" ? "text-blue-400 bg-blue-400/10 border-blue-400/20"
    : "text-rose-400 bg-rose-400/10 border-rose-400/20";

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
      <div className="flex flex-col h-full">
        {isCompleted && <Confetti width={width} height={height} recycle={false} numberOfPieces={400} gravity={0.12} colors={["#2563EB","#3B82F6","#60A5FA","#93C5FD"]} />}

        {/* Tactical Course Header */}
        <div className="sticky top-0 z-50 glass-frost border-b border-white/10 px-6 py-5">
          <div className="max-w-7xl mx-auto flex items-center gap-8">
            <Button variant="ghost" size="icon" onClick={closeQuest} className="w-12 h-12 rounded-2xl hover:bg-white/5 border border-white/5 shadow-xl">
              <ArrowLeft className="w-6 h-6 text-white/50" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic">{activeQuest.title}</span>
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{progressPct}% Sync</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                 <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 1, ease: "circOut" }} className="h-full bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]" />
              </div>
            </div>
            <div className="px-5 py-2.5 rounded-[18px] bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black flex items-center gap-3 uppercase tracking-widest">
              <Star className="w-4 h-4 fill-blue-500" />
              {activeQuest.points} XP
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-7xl mx-auto w-full flex gap-10 py-12">
          {/* Tactical Outline Sidebar */}
          <aside className="hidden lg:flex w-72 shrink-0 flex-col gap-6">
            <div className="sticky top-32">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-6 px-4">Satellite Outline</p>
              <div className="space-y-2">
                <button onClick={() => { setStep(0); setSelectedOption(null); setShowSolution(false); }}
                  className={`w-full text-left px-5 py-4 rounded-[22px] flex items-center gap-4 text-xs font-black uppercase tracking-widest transition-all ${step === 0 ? "bg-blue-600/10 text-white border border-blue-500/30" : "text-white/30 hover:text-white/70 hover:bg-white/5 border border-transparent"}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 ${step === 0 ? "bg-blue-600 text-white shadow-xl" : step > 0 ? "bg-emerald-500 text-white" : "bg-white/5 text-white/20"}`}>
                    {step > 0 ? <CheckCircle2 className="w-4 h-4" /> : "00"}
                  </div>
                  Intel Briefing
                </button>
                {slides.map((s: any, i: number) => (
                  <button key={i} onClick={() => { setStep(i + 1); setSelectedOption(null); setShowSolution(false); }}
                    className={`w-full text-left px-5 py-4 rounded-[22px] flex items-center gap-4 text-xs font-black uppercase tracking-widest transition-all ${step === i + 1 ? "bg-blue-600/10 text-white border border-blue-500/30" : "text-white/30 hover:text-white/70 hover:bg-white/5 border border-transparent"}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 ${step === i + 1 ? "bg-blue-600 text-white shadow-xl" : step > i + 1 ? "bg-emerald-500 text-white" : "bg-white/5 text-white/20"}`}>
                      {step > i + 1 ? <CheckCircle2 className="w-4 h-4" /> : `${(i + 1).toString().padStart(2, '0')}`}
                    </div>
                    <span className="truncate">{s.title || `Module ${i + 1}`}</span>
                  </button>
                ))}
                {quizzes.map((_: any, i: number) => (
                  <button key={`quiz-${i}`} onClick={() => { if (step >= slides.length + i + 1) { setStep(slides.length + i + 1); setSelectedOption(null); setShowSolution(false); }}}
                    className={`w-full text-left px-5 py-4 rounded-[22px] flex items-center gap-4 text-xs font-black uppercase tracking-widest transition-all ${step === slides.length + i + 1 ? "bg-blue-600/10 text-white border border-blue-500/30" : "text-white/30 hover:text-white/70 hover:bg-white/5 border border-transparent"}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 ${step === slides.length + i + 1 ? "bg-blue-500 text-white shadow-xl" : step > slides.length + i + 1 ? "bg-emerald-500 text-white" : "bg-white/5 text-white/20"}`}>
                      {step > slides.length + i + 1 ? <CheckCircle2 className="w-4 h-4" /> : `Q${i + 1}`}
                    </div>
                    Knowledge Gate {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Precision Terminal Display */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {isCompleted ? (
                <motion.div key="done" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20 px-10 max-w-3xl mx-auto glass-frost rounded-[64px] border-white/5 shadow-2xl relative overflow-hidden">
                   <div className="absolute inset-0 bg-blue-600/5 blur-[100px] pointer-events-none" />
                   <div className="relative mb-16">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 100, damping: 12 }} className="w-40 h-40 rounded-[48px] bg-gradient-to-tr from-blue-600 to-indigo-600 mx-auto flex items-center justify-center shadow-[0_40px_80px_-15px_rgba(37,99,235,0.4)] relative z-10 border border-white/20">
                      <Trophy className="w-20 h-20 text-white" />
                    </motion.div>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 w-56 h-56 -top-8 -left-8 mx-auto border-2 border-dashed border-blue-500/20 rounded-full" />
                  </div>

                  <h2 className="text-6xl font-black uppercase tracking-tighter mb-6 bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">MASTERY <span className="text-blue-500">LOCKED.</span></h2>
                  <p className="text-white/40 text-xl font-medium mb-12 leading-relaxed max-w-xl mx-auto">
                    Global de-serialization of <span className="text-white">"{activeQuest.title}"</span> is complete. 
                    Your cognitive capital has been successfully upgraded.
                  </p>

                  <div className="grid grid-cols-2 gap-8 mb-16">
                    <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/10 shadow-xl">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-3">Retention</p>
                      <p className="text-5xl font-black italic tabular-nums text-white">100%</p>
                    </div>
                    <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/10 shadow-xl">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-3">Yield Signal</p>
                      <p className="text-5xl font-black italic tabular-nums text-white">+{activeQuest.points}<span className="text-xl">XP</span></p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6 max-w-md mx-auto">
                    <Button onClick={closeQuest} className="h-20 rounded-[32px] bg-white text-black hover:bg-white/90 font-black text-xl uppercase tracking-tighter click-scale shadow-2xl border-none group">
                      Initialize Continuity
                      <ChevronRight className="w-6 h-6 ml-4 group-hover:translate-x-2 transition-transform" />
                    </Button>
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.5em] border-t border-white/5 pt-8">AUTHENTICATED BY GLOW OS V2.0 ENGINE</p>
                  </div>
                </motion.div>

              ) : step === 0 ? (
                <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
                  <Card className="relative rounded-[56px] overflow-hidden glass-frost border-white/10 p-16 shadow-2xl">
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
                      <IconComp className="w-64 h-64 text-white" />
                    </div>
                    <div className="relative z-10">
                      <div className={`inline-flex px-5 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-[0.4em] mb-10 shadow-xl ${getDifficultyColor(activeQuest.difficulty)}`}>{activeQuest.difficulty} MISSION</div>
                      <h1 className="text-5xl md:text-7xl font-black tracking-[-0.04em] mb-6 leading-none text-white uppercase italic">{activeQuest.title}</h1>
                      <p className="text-xl text-white/40 leading-[1.8] max-w-3xl mb-12 font-medium tracking-tight">{activeQuest.description}</p>
                      <div className="flex flex-wrap gap-10">
                        {[{icon: BookOpen, label: `${slides.length} NODES`},{icon: Target, label: `${quizzes.length} GATES`},{icon: Award, label: `${activeQuest.points} XP REWARD`},{icon: Clock, label: "~10 MIN DURATION"}].map(({icon: Icon, label}) => (
                          <div key={label} className="flex items-center gap-3 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                            <Icon className="w-5 h-5 text-blue-500" />{label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {slides.slice(0, 4).map((s: any, i: number) => (
                      <div key={i} className="flex items-start gap-6 p-8 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all shadow-xl group">
                        <div className="w-12 h-12 rounded-[18px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-xs font-black text-blue-500 group-hover:scale-110 transition-transform">{i+1}</div>
                        <div>
                          <p className="font-black text-xs text-white/80 mb-2 uppercase tracking-tight">{s.title}</p>
                          <p className="text-sm text-white/30 leading-relaxed max-w-xs">{s.text?.substring(0, 100)}...</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

              ) : currentSlide ? (
                <motion.div key={`slide-${step}`} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-10">
                  <div className="flex items-center gap-4">
                    <span className="h-0.5 w-12 bg-blue-500/20 rounded-full" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 italic">MISSION PHASE {step.toString().padStart(2, '0')} / {slides.length.toString().padStart(2, '0')}</span>
                  </div>
                  <Card className="rounded-[64px] glass-frost border-white/5 overflow-hidden shadow-[0_60px_120px_-30px_rgba(0,0,0,0.8)]">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-16 pb-12">
                      <div className="flex items-center gap-10">
                        <div className="w-24 h-24 rounded-[32px] bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-2xl backdrop-blur-3xl group hover:rotate-6 transition-all">
                          {currentSlide.icon && iconMap[currentSlide.icon]
                            ? (() => { const I = iconMap[currentSlide.icon]; return <I className="w-10 h-10 text-white" />; })()
                            : <BookCheck className="w-12 h-12 text-white" />
                          }
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60 mb-3">Core Intelligence</p>
                          <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none uppercase italic text-white">{currentSlide.title}</h2>
                        </div>
                      </div>
                    </div>
                    <div className="p-16 space-y-12">
                      <div className="text-2xl leading-[1.8] text-white/60 font-medium tracking-tight space-y-10">
                        {currentSlide.text.split('\n\n').map((paragraph: string, i: number) => (
                          <p key={i} className="whitespace-pre-wrap">{paragraph}</p>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-12 border-t border-white/5">
                        {currentSlide.keyTakeaway && (
                          <div className="flex items-start gap-6 p-8 rounded-[40px] bg-blue-500/5 border border-blue-500/10 hover:border-blue-400/30 transition-all shadow-xl group">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-110 transition-transform shadow-lg"><Lightbulb className="w-6 h-6" /></div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-3 italic">Tactical Edge</p>
                              <p className="text-base font-bold text-white/90 leading-relaxed tracking-tight">{currentSlide.keyTakeaway}</p>
                            </div>
                          </div>
                        )}
                        {currentSlide.example && (
                          <div className="flex items-start gap-6 p-8 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all shadow-xl group">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/30 shrink-0 group-hover:scale-110 transition-transform shadow-lg"><Zap className="w-6 h-6" /></div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-3 italic">Live Variable</p>
                              <p className="text-base font-bold text-white/60 leading-relaxed tracking-tight">{currentSlide.example}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>

              ) : currentQuiz ? (
                <motion.div key={`quiz-${step}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 px-4 md:px-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-xl">
                        <Target className="w-5 h-5 text-blue-500" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 italic">Satellite Verification Gate</span>
                    </div>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Index {(quizIdx ?? 0) + 1} OF {quizzes.length}</span>
                  </div>

                  <div className="rounded-[56px] glass-frost border-white/10 overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
                    <div className="p-16 border-b border-white/5 bg-white/[0.02]">
                      <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight uppercase italic">{currentQuiz.question}</h2>
                    </div>
                    <div className="p-10 space-y-4">
                      {currentQuiz.options.map((option: string, index: number) => {
                        const isCorrect = index === currentQuiz.answer;
                        const isSelected = selectedOption === index;
                        const isWrong = isSelected && !isCorrect && showSolution;
                        const showCorrect = showSolution && isCorrect;

                        return (
                          <button key={index}
                            className={`w-full text-left p-8 rounded-[32px] border transition-all flex items-center gap-8 group ${
                              isWrong ? "border-rose-500/50 bg-rose-500/10"
                              : showCorrect ? "border-emerald-500/50 bg-emerald-500/10"
                              : isSelected && !showSolution ? "border-blue-500/50 bg-blue-500/10"
                              : "border-white/5 bg-white/5 hover:bg-white/[0.08] hover:border-white/20"
                            }`}
                            onClick={() => !showSolution && setSelectedOption(index)}
                            disabled={showSolution && !isCorrect && !isSelected}
                          >
                            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 font-black text-sm transition-all shadow-xl ${
                              isWrong ? "bg-rose-500 border-rose-500 text-white"
                              : showCorrect ? "bg-emerald-500 border-emerald-500 text-white"
                              : isSelected && !showSolution ? "bg-blue-600 border-blue-600 text-white"
                              : "border-white/10 text-white/30 group-hover:border-white/30"
                            }`}>
                              {String.fromCharCode(65 + index)}
                            </div>
                            <div className="flex-1">
                              <p className={`text-xl font-bold tracking-tight ${(isSelected || showCorrect) ? "text-white" : "text-white/40 group-hover:text-white/60 transition-colors"}`}>{option}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {showSolution && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="mx-10 mb-10 p-8 rounded-[40px] bg-blue-600/5 border border-blue-500/10 flex items-start gap-6 shadow-2xl">
                        <Lightbulb className="w-8 h-8 text-blue-400 shrink-0 mt-1" />
                        <div className="flex-1">
                          <p className="text-lg font-bold text-white/80 mb-6 leading-relaxed">Verification sequence failed. Re-evaluate the core logic highlighted above.</p>
                          <Button size="lg" variant="outline"
                            className="h-14 px-10 rounded-[20px] border-white/10 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 click-scale"
                            onClick={() => { setShowSolution(false); setSelectedOption(null); }}>
                            Override & Retry
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {!isCompleted && (
              <div className="flex gap-6 mt-16 max-w-4xl mx-auto md:mx-0">
                {step > 0 && (
                  <Button variant="outline" onClick={handleBack} className="h-16 px-10 rounded-[28px] border-white/10 bg-white/5 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white/10 click-scale">
                    <ChevronLeft className="w-5 h-5 mr-3" /> Previous Phase
                  </Button>
                )}
                <Button onClick={handleNext} disabled={completeMutation.isPending}
                  className="flex-1 h-16 rounded-[28px] bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest text-xs click-scale shadow-2xl border-none group">
                  {showSolution ? "Force Next Sequence"
                    : isLastStep ? (completeMutation.isPending ? "FINALIZING SYNC..." : "INITIALIZE COMPLETION")
                    : "Authorize Next Phase"}
                  <ChevronRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container py-20">
      <div className="flex flex-col gap-12">
        {/* Cinematic Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
                Knowledge Matrix
              </div>
              <div className="h-[1px] w-20 bg-white/5" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-[-0.05em] leading-[0.8] mb-4 text-white uppercase italic">
              CENTRAL <br />
              <span className="text-gradient-blue">ACADEMY.</span>
            </h1>
            <p className="text-white/30 text-lg font-medium tracking-tight max-w-xl">
              De-serializing complex financial logic into executable behavioral patterns.
            </p>
          </div>
          
          <div className="w-full lg:w-auto">
             <Button 
               variant="outline" 
               className="h-16 w-full lg:w-auto px-10 rounded-[32px] border-white/5 bg-white/[0.02] text-white/40 font-black hover:bg-white/[0.05] hover:text-white flex items-center gap-4 text-[10px] uppercase tracking-widest click-scale shadow-xl"
               onClick={async () => {
                 try {
                   await apiRequest("/api/admin/seed-courses", "POST");
                   await refetchQuests();
                   await refetchUserQuests();
                   toast({ title: "OS Update Synchronized", description: "New academy modules are now online." });
                 } catch (e: any) {
                   toast({ title: "Signal Lost", description: "Database handshake failed.", variant: "destructive" });
                 }
               }}
             >
               <Zap className="w-5 h-5 text-blue-500" />
               Sync Intel Nodes
             </Button>
          </div>
        </motion.div>

        {/* Global Mastery Hub Header */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="relative overflow-hidden rounded-[64px] glass-frost border-white/5 p-10 md:p-16 shadow-2xl group">
           <div className="absolute inset-0 bg-blue-600/[0.03] pointer-events-none" />
           <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
           
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 shadow-xl mb-4">
                   <Brain className="w-5 h-5 text-blue-500" />
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Neural Progression Hub</span>
                </div>
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] text-white">
                  OPTIMIZE <br /> <span className="text-gradient-blue italic">COGNITION.</span>
                </h2>
                <p className="text-white/30 text-xl max-w-xl font-medium tracking-tight mx-auto lg:mx-0 leading-relaxed">
                  Master the architecture of wealth through deep-stream modules. Level up your <span className="text-white/60">Operational IQ</span> to unlock peak capital performance.
                </p>
              </div>

              <div className="lg:col-span-5">
                 <div className="p-12 rounded-[48px] bg-white/[0.01] border border-white/5 relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
                    <div className="relative z-10 flex flex-col gap-10">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-flicker" />
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Operational Tier</p>
                          </div>
                          <div className="px-5 py-1.5 rounded-xl bg-blue-600/20 text-blue-400 text-[10px] font-black border border-blue-500/20 shadow-xl tracking-widest uppercase">
                            LEVEL {Math.floor(completedCount / 3) + 1}
                          </div>
                       </div>

                       <div>
                          <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.4em] mb-4">Satellite Mastery</p>
                          <div className="flex items-baseline gap-4 mb-6">
                             <span className="text-8xl font-black italic tracking-tighter text-white tabular-nums drop-shadow-2xl">
                               {masteryPercentage}<span className="text-3xl text-blue-500 tracking-normal">%</span>
                             </span>
                          </div>
                          <div className="relative h-4 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/5 p-1 shadow-inner">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${masteryPercentage}%` }} transition={{ duration: 2, ease: "circOut" }} className="h-full bg-gradient-to-r from-blue-700 to-blue-500 rounded-full relative shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                               <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-shimmer" />
                            </motion.div>
                          </div>
                       </div>

                       <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/5">
                          {[
                            { label: 'SOLVED', val: completedCount, color: 'text-blue-400' },
                            { label: 'MODULES', val: literacyQuests.length, color: 'text-white' },
                            { label: 'INTEL XP', val: totalEarnedXP, color: 'text-blue-500' }
                          ].map((stat) => (
                            <div key={stat.label} className="text-center">
                               <p className={`text-2xl font-black italic mb-2 ${stat.color} tabular-nums`}>{stat.val}</p>
                               <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.4em]">{stat.label}</p>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </motion.div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {literacyQuests.map((quest, idx) => {
            const isDone = userQuests.some(uq => uq.questId === quest.id && uq.completed);
            const Icon = iconMap[quest.icon] || TrendingUp;
            let content = { slides: [] as any[], quizzes: [] as any[] };
            try { const c = JSON.parse(quest.content); content = { slides: c.slides || [], quizzes: c.quizzes || (c.quiz ? [c.quiz] : []) }; } catch {}

            return (
              <motion.div key={quest.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <div onClick={() => startQuest(quest)} className={`group h-[500px] flex flex-col rounded-[48px] border cursor-pointer overflow-hidden transition-all duration-700 hover-lift shadow-2xl relative ${isDone ? "glass-frost border-emerald-500/20 bg-emerald-500/[0.01]" : "glass-frost border-white/5 bg-white/[0.01] hover:border-blue-500/30"}`}>
                  <div className={`h-2 w-full ${isDone ? "bg-emerald-500" : "bg-blue-600"}`} />
                  <div className="p-12 flex flex-col flex-1 relative z-10">
                    <div className="flex items-start justify-between mb-10">
                      <div className={`w-18 h-18 rounded-[28px] ${isDone ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-blue-600/10 border-blue-500/20 text-blue-500'} border flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-2xl`}>
                        <Icon className="w-9 h-9" />
                      </div>
                      {isDone && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-xl">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">SOLVED</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-xl border text-[9px] font-black uppercase tracking-[0.3em] shadow-lg ${getDifficultyColor(quest.difficulty)}`}>{quest.difficulty}</span>
                        <div className="h-[1px] flex-1 bg-white/5" />
                      </div>
                      <h3 className="text-3xl font-black tracking-tight mb-4 group-hover:text-blue-500 transition-colors uppercase italic leading-[1.1]">{quest.title}</h3>
                      <p className="text-lg text-white/30 font-medium tracking-tight line-clamp-3 leading-relaxed">{quest.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-10 border-t border-white/5 mt-auto">
                      <div className="flex items-center gap-8">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 mb-2">Duration</span>
                          <span className="text-sm font-black text-white/40 tabular-nums">
                            ~{(content as any).duration || content.slides.length * 2} MINS
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 mb-2">XP Yield</span>
                          <span className="text-sm font-black text-blue-500 tabular-nums">{quest.points} XP</span>
                        </div>
                      </div>
                      
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${isDone ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-white text-black shadow-2xl group-hover:scale-110"}`}>
                        <ChevronRight className="w-7 h-7" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {literacyQuests.length === 0 && !isLoading && (
          <div className="p-40 text-center rounded-[64px] border-2 border-dashed border-white/5 opacity-20">
            <Brain className="w-24 h-24 text-blue-500 mx-auto mb-10 animate-pulse" />
            <h3 className="text-4xl font-black mb-4 uppercase tracking-tighter">Satellite Disconnected</h3>
            <p className="text-lg font-bold">Waiting for academy sync signal. Refresh modules in a moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
