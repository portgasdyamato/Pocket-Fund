import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { Check } from "lucide-react";

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
        title: "Hold up!",
        description: "Please name your goal and set a target amount.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createGoalMutation.mutateAsync();
      await updateOnboardingMutation.mutateAsync("step_2");
      setCurrentStep(2);
      toast({
        title: "Quest Set!",
        description: `Your ${goalName} journey begins now.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create your goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStep2Complete = async () => {
    await updateOnboardingMutation.mutateAsync("step_3");
    setCurrentStep(3);
    toast({
      title: "Coming Soon!",
      description: "Bank connection will be available soon. Moving to next step.",
    });
  };

  const handleStep3Complete = async () => {
    await updateOnboardingMutation.mutateAsync("step_4");
    setCurrentStep(4);
    toast({
      title: "Almost There!",
      description: "KYC integration coming soon. Moving to final step.",
    });
  };

  const handleStep4Complete = async () => {
    await updateOnboardingMutation.mutateAsync("completed");
    toast({
      title: "Welcome to The Fight!",
      description: "Your financial glow-up starts now!",
    });
    window.location.href = "/";
  };

  const steps = [
    { number: 1, title: "Set Quest", description: "Name your first savings goal" },
    { number: 2, title: "Connect Intel", description: "Link your bank account" },
    { number: 3, title: "Unlock Locker", description: "Complete eKYC" },
    { number: 4, title: "Enable Stash", description: "Approve UPI Mandate" },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome to Bootcamp</h1>
          <p className="text-muted-foreground">Let's get you ready for The Fight</p>
        </div>

        <div className="flex justify-between mb-8">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold mb-2 ${
                  currentStep > step.number
                    ? "bg-primary text-primary-foreground"
                    : currentStep === step.number
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
                data-testid={`step-indicator-${step.number}`}
              >
                {currentStep > step.number ? <Check className="w-6 h-6" /> : step.number}
              </div>
              <p className="text-xs font-medium text-center">{step.title}</p>
            </div>
          ))}
        </div>

        {currentStep === 1 && (
          <Card data-testid="card-step-1">
            <CardHeader>
              <CardTitle>Set Your Quest</CardTitle>
              <CardDescription>What are you saving for? Give it a name and a target.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="goal-name">Goal Name</Label>
                <Input
                  id="goal-name"
                  placeholder="e.g., Europe Trip, New Laptop"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  data-testid="input-goal-name"
                />
              </div>
              <div>
                <Label htmlFor="goal-amount">Target Amount (₹)</Label>
                <Input
                  id="goal-amount"
                  type="number"
                  placeholder="e.g., 50000"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(e.target.value)}
                  data-testid="input-goal-amount"
                />
              </div>
              <Button 
                onClick={handleStep1Complete} 
                className="w-full"
                data-testid="button-step-1-continue"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card data-testid="card-step-2">
            <CardHeader>
              <CardTitle>Connect Intel</CardTitle>
              <CardDescription>Link your bank account to track transactions automatically.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We use Account Aggregator framework for secure, read-only access to your transactions.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Coming Soon</p>
                <p className="text-sm text-muted-foreground">
                  Bank integration will be available in the next update. For now, you can manually add transactions.
                </p>
              </div>
              <Button 
                onClick={handleStep2Complete} 
                className="w-full"
                data-testid="button-step-2-continue"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card data-testid="card-step-3">
            <CardHeader>
              <CardTitle>Unlock Locker</CardTitle>
              <CardDescription>Complete quick eKYC to create your Liquid Fund account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Coming Soon</p>
                <p className="text-sm text-muted-foreground">
                  eKYC integration will be available soon. Your Locker feature is ready to track your savings!
                </p>
              </div>
              <Button 
                onClick={handleStep3Complete} 
                className="w-full"
                data-testid="button-step-3-continue"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <Card data-testid="card-step-4">
            <CardHeader>
              <CardTitle>Enable Stash</CardTitle>
              <CardDescription>Approve UPI mandate for one-tap savings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Coming Soon</p>
                <p className="text-sm text-muted-foreground">
                  UPI AutoPay integration will be available soon. You can still manually track your stash transactions!
                </p>
              </div>
              <Button 
                onClick={handleStep4Complete} 
                className="w-full"
                data-testid="button-step-4-complete"
              >
                Complete Setup
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
