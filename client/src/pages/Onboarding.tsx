import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { Check, Target, Shield, Zap, Lock, Sparkles, ArrowRight, TrendingUp, Brain, ShieldCheck, BarChart3, Fingerprint, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Onboarding() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");

  const updateOnboardingMutation = useMutation({
    mutationFn: async (status: string) => {
      await apiRequest("/api/user/onboarding", "PATCH", { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  const createGoalMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("/api/goals", "POST", {
        name: goalName,
        targetAmount: goalAmount,
        isMain: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
    },
  });

  const handleStep1Complete = async () => {
    if (!goalName || !goalAmount) {
      toast({
        title: "Protocol Violation",
        description: "Please specify target name and capital objective.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createGoalMutation.mutateAsync();
      await updateOnboardingMutation.mutateAsync("step_2");
      setCurrentStep(2);
      toast({
        title: "Quest Initialized",
        description: `Mission ${goalName} is now in the registry.`,
      });
    } catch (error) {
      toast({
        title: "Link Error",
        description: "Failed to initialize mission parameters.",
        variant: "destructive",
      });
    }
  };

  const handleStep2Complete = async () => {
    await updateOnboardingMutation.mutateAsync("step_3");
    setCurrentStep(3);
    toast({
      title: "Data Link Deferred",
      description: "Neural bank integration pending update v2.1.",
    });
  };

  const handleStep3Complete = async () => {
    await updateOnboardingMutation.mutateAsync("step_4");
    setCurrentStep(4);
    toast({
      title: "Identity Verified",
      description: "Credentials cached. Moving to final sequence.",
    });
  };

  const handleStep4Complete = async () => {
    await updateOnboardingMutation.mutateAsync("completed");
    toast({
      title: "Systems Active",
      description: "Welcome to the elite financial operating system.",
    });
    window.location.href = "/";
  };

  const steps = [
    { number: 1, title: "Initialize Quest", description: "Define primary capital objective", icon: Target },
    { number: 2, title: "Link Intel", description: "Establish real-time data sync", icon: Zap },
    { number: 3, title: "Authorize Locker", description: "Decrypt sub-zero vaults", icon: Lock },
    { number: 4, title: "Deploy Stash", description: "Activate autonomous reserves", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-stellar flex items-center justify-center p-8 overflow-hidden relative">
      <div className="mouse-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[160px] rounded-full pointer-events-none z-0" />
      
      <div className="w-full max-w-4xl relative z-10">
        
        {/* Onboarding Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-blue-500/20 bg-blue-500/10 mb-10"
          >
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Bootcamp Protocol v4.0</span>
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black tracking-[-0.05em] leading-[0.8] mb-6 text-white uppercase italic">
            INITIATE <br /><span className="text-gradient-blue italic">ASCENSION.</span>
          </h1>
          <p className="text-white/30 text-xl font-medium tracking-tight max-w-2xl mx-auto italic">
            Configuring your financial architecture for high-velocity wealth generation.
          </p>
        </div>

        {/* Phase Indicators */}
        <div className="grid grid-cols-4 gap-4 mb-20">
          {steps.map((step) => {
            const isComplete = currentStep > step.number;
            const isActive = currentStep === step.number;
            return (
              <div key={step.number} className="flex flex-col items-center gap-4 group">
                <div
                  className={`relative w-24 h-24 rounded-[32px] flex items-center justify-center transition-all duration-700 shadow-2xl ${
                    isComplete
                      ? "bg-blue-600 text-white border-none scale-100 rotate-12"
                      : isActive
                      ? "bg-blue-600/10 border-blue-500/40 text-blue-500 scale-110"
                      : "bg-white/[0.02] border-white/5 text-white/10"
                  } border`}
                >
                  {isComplete ? (
                    <Check className="w-10 h-10" />
                  ) : (
                    <step.icon className={`w-10 h-10 ${isActive ? 'animate-pulse' : ''}`} />
                  )}
                  {isActive && <div className="absolute inset-0 rounded-[32px] border-4 border-blue-500/20 animate-pulse" />}
                </div>
                <div className="text-center space-y-1">
                   <p className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isActive || isComplete ? 'text-white' : 'text-white/10'}`}>{step.title}</p>
                   {isActive && <div className="h-1 w-8 bg-blue-500 rounded-full mx-auto" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Console Interface */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} key="step-1">
              <Card className="glass-frost p-16 rounded-[64px] border-white/5 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full -mr-32 -mt-32 pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
                <CardHeader className="p-0 mb-12">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-1.5 h-8 bg-blue-500 rounded-full" />
                      <CardTitle className="text-4xl font-black uppercase tracking-tight italic">Mission Parameters</CardTitle>
                   </div>
                   <CardDescription className="text-lg text-white/30 font-medium italic tracking-tight">Define the primary capital vector you are currently engineering.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-4">
                        <Label htmlFor="goal-name" className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] ml-2 italic">Objective Identity</Label>
                        <Input
                          id="goal-name"
                          placeholder="e.g., Institutional Reserves"
                          value={goalName}
                          onChange={(e) => setGoalName(e.target.value)}
                          className="h-20 text-2xl font-black bg-white/[0.03] border-white/10 rounded-[28px] px-8 focus:border-blue-500/50 transition-all placeholder:text-white/5 uppercase italic"
                        />
                     </div>
                     <div className="space-y-4">
                        <Label htmlFor="goal-amount" className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] ml-2 italic">Capital Threshold (₹)</Label>
                        <Input
                          id="goal-amount"
                          type="number"
                          placeholder="e.g., 500000"
                          value={goalAmount}
                          onChange={(e) => setGoalAmount(e.target.value)}
                          className="h-20 text-4xl font-black bg-white/[0.03] border-white/10 rounded-[28px] px-8 focus:border-blue-500/50 transition-all placeholder:text-white/5 tabular-nums"
                        />
                     </div>
                  </div>
                  <Button 
                    onClick={handleStep1Complete} 
                    className="w-full h-24 rounded-[32px] bg-blue-600 hover:bg-blue-500 text-white text-2xl font-black uppercase tracking-tighter click-scale shadow-2xl shadow-blue-600/20 border-none group"
                  >
                    Confirm Data Link
                    <ArrowRight className="w-8 h-8 ml-6 group-hover:translate-x-4 transition-transform duration-500" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} key="step-2">
              <Card className="glass-frost p-16 rounded-[64px] border-white/5 relative overflow-hidden group shadow-2xl">
                <CardHeader className="p-0 mb-12 text-center">
                   <div className="w-24 h-24 rounded-[36px] bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mx-auto mb-10 shadow-2xl">
                      <Zap className="w-12 h-12" />
                   </div>
                   <CardTitle className="text-4xl font-black uppercase tracking-tight italic">Link Data Streams</CardTitle>
                   <CardDescription className="text-lg text-white/30 font-medium italic mt-4">Integrate your institutional bank feeds for automated resource monitoring.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-10">
                  <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
                        <BarChart3 className="w-40 h-40 text-blue-500" />
                     </div>
                     <p className="text-xl font-medium text-white/40 leading-relaxed italic relative z-10">
                       "We leverage the Account Aggregator protocol for high-fidelity, read-only telemetry. Absolute visibility without compromising structural integrity."
                     </p>
                  </div>
                  <div className="bg-blue-500/5 p-8 rounded-[32px] border border-blue-500/10 text-center">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-3">Sync Protocol Offline</p>
                    <p className="text-sm font-black text-white/60 tracking-tight">Bank integration is targeting deployment in cycle v2.5. Proceed with manual logging sequence.</p>
                  </div>
                  <Button 
                    onClick={handleStep2Complete} 
                    className="w-full h-24 rounded-[32px] bg-white text-black hover:bg-white/90 text-2xl font-black uppercase tracking-tighter click-scale shadow-2xl border-none group"
                  >
                    Proceed with Manual Auth
                    <ArrowRight className="w-8 h-8 ml-6 group-hover:translate-x-4 transition-transform duration-500" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} key="step-3">
              <Card className="glass-frost p-16 rounded-[64px] border-white/5 relative overflow-hidden group shadow-2xl">
                <CardHeader className="p-0 mb-12 text-center">
                   <div className="w-24 h-24 rounded-[36px] bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mx-auto mb-10 shadow-2xl">
                      <Lock className="w-12 h-12" />
                   </div>
                   <CardTitle className="text-4xl font-black uppercase tracking-tight italic">Decrypt Global Vault</CardTitle>
                   <CardDescription className="text-lg text-white/30 font-medium italic mt-4">Initialize sub-zero identity verification for large-scale capital preservation.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-10">
                  <div className="p-10 rounded-[40px] bg-white/[0.02] border border-emerald-500/20 bg-emerald-500/[0.02] text-center">
                     <p className="text-base font-black text-emerald-400 uppercase tracking-[0.4em] mb-4">Encryption Level: 512-BIT</p>
                     <p className="text-white/40 text-lg font-medium italic leading-relaxed">
                        eKYC is pre-authorized for the next deployment phase. Your sub-zero locker is configured and awaiting final key issuance.
                     </p>
                  </div>
                  <Button 
                    onClick={handleStep3Complete} 
                    className="w-full h-24 rounded-[32px] bg-blue-600 hover:bg-blue-500 text-white text-2xl font-black uppercase tracking-tighter click-scale shadow-2xl shadow-blue-600/20 border-none group"
                  >
                    Commit Verification
                    <ArrowRight className="w-8 h-8 ml-6 group-hover:translate-x-4 transition-transform duration-500" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} key="step-4">
              <Card className="glass-frost p-16 rounded-[64px] border-white/5 relative overflow-hidden group shadow-2xl">
                <CardHeader className="p-0 mb-12 text-center">
                   <div className="w-24 h-24 rounded-[36px] bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mx-auto mb-10 shadow-2xl">
                      <Shield className="w-12 h-12" />
                   </div>
                   <CardTitle className="text-4xl font-black uppercase tracking-tight italic">Activate Reserve Node</CardTitle>
                   <CardDescription className="text-lg text-white/30 font-medium italic mt-4">Approve autonomous UPI mandate for frictionless capital accumulation.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-10">
                  <div className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 text-center">
                     <p className="text-white/30 text-lg font-medium italic leading-relaxed">
                        UPI AutoPay protocols are being calibrated by institutional partners. 
                        Initial deployment will support manual stash commands with one-tap execution.
                     </p>
                  </div>
                  <Button 
                    onClick={handleStep4Complete} 
                    className="w-full h-28 rounded-[40px] bg-white text-black hover:bg-white/90 text-3xl font-black uppercase tracking-tighter click-scale shadow-[0_40px_80px_-15px_rgba(255,255,255,0.2)] border-none group"
                  >
                    Finalize Deployment
                    <Check className="w-10 h-10 ml-8 group-hover:scale-125 transition-transform duration-500" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
