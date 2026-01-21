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
  ArrowLeft,
  Cpu,
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
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function LevelUp() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [step, setStep] = useState(0);
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
      case "Easy": return "text-green-400 bg-green-400/10";
      case "Medium": return "text-orange-400 bg-orange-400/10";
      case "Hard": return "text-red-400 bg-red-400/10";
      default: return "text-white/40 bg-white/5";
    }
  };

  if (activeQuest) {
    const content = JSON.parse(activeQuest.content);
    const slides = content.slides || [];
    const quiz = content.quiz;
    const totalSteps = slides.length + 2; 

    const isLastStep = step === totalSteps - 1;
    const currentSlide = step > 0 && step <= slides.length ? slides[step - 1] : null;

    const handleNext = () => {
      if (step < totalSteps - 1) {
        setStep(step + 1);
      } else if (selectedOption === quiz.answer) {
        completeMutation.mutate(activeQuest.id);
      } else if (selectedOption !== null) {
        toast({
          title: "Neural Mismatch",
          description: "Data integrity check failed. Try another logic path.",
          variant: "destructive"
        });
      }
    };

    const handleBack = () => {
      if (step > 0) setStep(step - 1);
    };

    return (
      <div className="min-h-screen bg-[#050505] p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
        {isCompleted && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.1} colors={['#8B5CF6', '#D946EF', '#2DD4BF']} />}
        
        {/* Background Decorative Rings */}
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
            <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
              <motion.div 
                 className="h-full bg-gradient-to-r from-primary to-accent"
                 initial={{ width: 0 }}
                 animate={{ width: `${(step / (totalSteps - 1)) * 100}%` }}
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
                {isCompleted ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    className="text-center space-y-8 flex flex-col items-center justify-center h-full py-12"
                  >
                    <div className="relative">
                       <div className="absolute inset-0 bg-primary blur-3xl rounded-full opacity-30 animate-pulse" />
                       <div className="w-24 h-24 bg-primary text-white rounded-[32%] flex items-center justify-center relative shadow-2xl">
                          <Trophy className="w-12 h-12" />
                       </div>
                    </div>
                    <div>
                      <h2 className="text-4xl font-black tracking-tighter mb-4 uppercase italic">Neural Uplink Successful</h2>
                      <p className="text-white/40 font-medium text-lg max-w-md mx-auto">
                        Your cognitive matrix has been updated with <span className="text-primary font-black">{activeQuest.points} neurological credits</span>.
                      </p>
                    </div>
                    <Button size="lg" className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xl premium-shadow" onClick={closeQuest}>
                      Commit Data
                    </Button>
                  </motion.div>
                ) : step === 0 ? (
                  <motion.div 
                    key="intro"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10 py-10"
                  >
                    <div className="flex flex-col items-center text-center space-y-6">
                       <div className="text-[120px] p-8 relative">
                          <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full" />
                          <div className="relative filter drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                            {activeQuest.icon.length > 5 ? <TrendingUp className="w-32 h-32 text-primary" /> : activeQuest.icon}
                          </div>
                       </div>
                       <div className="space-y-3">
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Mission Briefing</p>
                          <h2 className="text-5xl font-black tracking-tighter uppercase italic">{activeQuest.title}</h2>
                          <p className="text-xl text-white/50 font-medium leading-relaxed max-w-xl">{activeQuest.description}</p>
                       </div>
                    </div>
                  </motion.div>
                ) : currentSlide ? (
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
                        {currentSlide.icon && iconMap[currentSlide.icon] ? (
                          (() => {
                            const IconComp = iconMap[currentSlide.icon];
                            return <IconComp className="w-10 h-10 text-primary relative z-10" />;
                          })()
                        ) : (
                          <BookOpen className="w-10 h-10 text-primary relative z-10" />
                        )}
                      </div>
                      <div className="space-y-4">
                        <h2 className="text-3xl font-black tracking-tight">{currentSlide.title}</h2>
                        <p className="text-xl leading-relaxed text-white/60 font-medium max-w-2xl">
                          {currentSlide.text}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : isLastStep ? (
                  <motion.div 
                     key="quiz"
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="space-y-8 py-4"
                  >
                    <div className="text-center space-y-4">
                      <div className="inline-flex px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent text-[10px] font-black uppercase tracking-widest">Logic Validation</div>
                      <h2 className="text-3xl font-black tracking-tight leading-tight">{quiz.question}</h2>
                    </div>
                    <div className="space-y-4">
                      {quiz.options.map((option: string, index: number) => (
                        <Button
                          key={index}
                          variant="outline"
                          className={`w-full justify-start h-auto py-5 px-6 text-left rounded-2xl border-white/5 bg-white/5 transition-all relative overflow-hidden group ${
                            selectedOption === index ? 'border-primary bg-primary/10 ring-1 ring-primary/50' : 'hover:bg-white/10 hover:border-white/20'
                          }`}
                          onClick={() => setSelectedOption(index)}
                        >
                          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mr-5 shrink-0 font-black text-xs transition-colors ${
                            selectedOption === index ? 'bg-primary text-white border-transparent' : 'border-white/10 text-white/40'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className={`font-bold transition-colors ${selectedOption === index ? 'text-white' : 'text-white/60'}`}>{option}</span>
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {!isCompleted && (
                <div className="flex gap-4 pt-10">
                  {step > 0 && (
                    <Button variant="outline" onClick={handleBack} className="flex-1 h-14 rounded-2xl border-white/5 bg-white/5 font-black uppercase tracking-widest text-[10px]">
                      <ChevronLeft className="w-4 h-4 mr-2" /> REWIND
                    </Button>
                  )}
                  <Button onClick={handleNext} className="flex-[2] h-14 rounded-2xl bg-white text-black hover:bg-white/90 font-black uppercase tracking-tighter text-sm premium-shadow-white group">
                    {isLastStep ? "EXECUTE VALIDATION" : "PROCEED"} 
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <main className="max-w-7xl mx-auto px-6 py-20 space-y-16">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-12"
        >
          <div className="space-y-4">
            <h1 className="text-6xl font-black tracking-tighter italic uppercase">Level <span className="text-primary">Up</span></h1>
            <p className="text-white/40 text-2xl font-medium max-w-2xl leading-relaxed">
              Ascend the financial hierarchy through <span className="text-white italic">Neural Link Training Missions</span>.
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
              <p className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-2">Current Tier</p>
              <p className="text-3xl font-black tracking-tight">VANGUARD ELITE</p>
              <div className="flex items-center gap-2 mt-2">
                 <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-primary" />
                 </div>
                 <span className="text-[10px] font-bold text-primary italic">65% to Master</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Quests Grid */}
        <motion.div 
           variants={container}
           initial="hidden"
           animate="show"
           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {literacyQuests.map((quest) => {
            const userQuest = userQuests.find(uq => uq.questId === quest.id);
            const isDone = !!userQuest?.completed;

            return (
              <motion.div key={quest.id} variants={item}>
                <Card 
                  className={`group h-full flex flex-col p-8 rounded-[40px] glass-morphism border-white/5 hover:border-primary/20 transition-all duration-500 cursor-pointer overflow-hidden relative ${
                    isDone ? 'opacity-60' : ''
                  }`} 
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
                        {iconMap[quest.icon] ? (
                          (() => {
                            const IconComp = iconMap[quest.icon];
                            return <IconComp className="w-16 h-16 text-primary" />;
                          })()
                        ) : (
                          quest.icon.length > 5 ? <TrendingUp className="w-16 h-16 text-primary" /> : quest.icon
                        )}
                     </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <h3 className="text-2xl font-black tracking-tight uppercase leading-tight">{quest.title}</h3>
                    <div className="flex gap-3">
                      <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${getDifficultyColor(quest.difficulty)}`}>
                        {quest.difficulty}
                      </div>
                      <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest text-primary italic">
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
                        isDone ? 'border-white/10 bg-transparent text-white/40 hover:bg-white/5' : 'bg-primary text-white hover:bg-primary/90 premium-shadow'
                      }`}
                    >
                      {isDone ? "REPEAT SIMULATION" : "INITIATE TRAINING"}
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
            <h3 className="text-3xl font-black tracking-tight mb-2">DATA TRANSMISSION PENDING</h3>
            <p className="text-white/30 text-lg">New training modules are being synthesized by the core engine.</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
