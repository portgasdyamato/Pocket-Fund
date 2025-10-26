import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Plus, Target, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import type { Goal, StashTransaction } from "@shared/schema";

export default function GlowUp() {
  const { toast } = useToast();
  const [isNewGoalOpen, setIsNewGoalOpen] = useState(false);
  const [isStashOpen, setIsStashOpen] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [stashAmount, setStashAmount] = useState("");
  const [selectedGoalId, setSelectedGoalId] = useState("");

  const { data: goals = [] } = useQuery<Goal[]>({
    queryKey: ["/api/goals"],
  });

  const { data: totalStashedData } = useQuery<{ total: number }>({
    queryKey: ["/api/stash/total"],
  });

  const { data: stashTransactions = [] } = useQuery<StashTransaction[]>({
    queryKey: ["/api/stash"],
  });

  const createGoalMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("/api/goals", "POST", {
        name: goalName,
        targetAmount: goalAmount,
        isMain: goals.length === 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/goals/main"] });
      setIsNewGoalOpen(false);
      setGoalName("");
      setGoalAmount("");
      toast({
        title: "Goal Created!",
        description: "Your new savings quest has begun.",
      });
    },
  });

  const stashMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("/api/stash", "POST", {
        amount: stashAmount,
        type: "stash",
        goalId: selectedGoalId || null,
        status: "completed",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stash"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stash/total"] });
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/streak"] });
      setIsStashOpen(false);
      setStashAmount("");
      setSelectedGoalId("");
      toast({
        title: "Stashed!",
        description: "Your money is now growing in your Locker.",
      });
    },
  });

  const totalStashed = totalStashedData?.total || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">The Glow-Up</h1>
          <p className="text-muted-foreground">Your Locker • Watch your money grow</p>
        </div>
        <Dialog open={isStashOpen} onOpenChange={setIsStashOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-stash-cash">
              <TrendingUp className="w-4 h-4 mr-2" />
              Stash Cash
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Stash Cash</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="stash-amount">Amount (₹)</Label>
                <Input
                  id="stash-amount"
                  type="number"
                  placeholder="500"
                  value={stashAmount}
                  onChange={(e) => setStashAmount(e.target.value)}
                  data-testid="input-stash-amount"
                />
              </div>
              <div>
                <Label htmlFor="goal-select">Allocate to Goal (Optional)</Label>
                <select
                  id="goal-select"
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                  value={selectedGoalId}
                  onChange={(e) => setSelectedGoalId(e.target.value)}
                  data-testid="select-goal"
                >
                  <option value="">General Savings</option>
                  {goals.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                onClick={() => stashMutation.mutate()}
                disabled={stashMutation.isPending || !stashAmount}
                className="w-full"
                data-testid="button-confirm-stash"
              >
                Stash ₹{stashAmount || 0}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card data-testid="card-locker-balance">
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Total in Locker</p>
            <p className="text-5xl font-bold mb-4" data-testid="text-locker-balance">
              ₹{totalStashed.toLocaleString('en-IN')}
            </p>
            <p className="text-sm text-muted-foreground">Growing in Liquid Mutual Fund</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Goals</h2>
        <Dialog open={isNewGoalOpen} onOpenChange={setIsNewGoalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" data-testid="button-new-goal">
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-goal-name">Goal Name</Label>
                <Input
                  id="new-goal-name"
                  placeholder="e.g., Dream Vacation"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  data-testid="input-new-goal-name"
                />
              </div>
              <div>
                <Label htmlFor="new-goal-amount">Target Amount (₹)</Label>
                <Input
                  id="new-goal-amount"
                  type="number"
                  placeholder="25000"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(e.target.value)}
                  data-testid="input-new-goal-amount"
                />
              </div>
              <Button
                onClick={() => createGoalMutation.mutate()}
                disabled={createGoalMutation.isPending || !goalName || !goalAmount}
                className="w-full"
                data-testid="button-create-goal"
              >
                Create Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const progress = (parseFloat(goal.currentAmount) / parseFloat(goal.targetAmount)) * 100;
          return (
            <Card key={goal.id} data-testid={`card-goal-${goal.id}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      {goal.name}
                      {goal.isMain && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          Main
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      ₹{parseFloat(goal.currentAmount).toLocaleString('en-IN')} of ₹{parseFloat(goal.targetAmount).toLocaleString('en-IN')}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{progress.toFixed(0)}%</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {goals.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No goals yet. Create your first savings quest!</p>
            <Button onClick={() => setIsNewGoalOpen(true)} data-testid="button-create-first-goal">
              Create Goal
            </Button>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-0">
            {stashTransactions.length > 0 ? (
              <div className="divide-y">
                {stashTransactions.slice(0, 10).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-4 flex justify-between items-center"
                    data-testid={`transaction-${transaction.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'stash' ? 'bg-primary/10' : 'bg-destructive/10'
                      }`}>
                        {transaction.type === 'stash' ? (
                          <ArrowUpCircle className="w-5 h-5 text-primary" />
                        ) : (
                          <ArrowDownCircle className="w-5 h-5 text-destructive" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {transaction.type === 'stash' ? 'Stashed' : 'Withdrawn'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${
                      transaction.type === 'stash' ? 'text-primary' : 'text-destructive'
                    }`}>
                      {transaction.type === 'stash' ? '+' : '-'}₹{parseFloat(transaction.amount).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-muted-foreground">
                No transactions yet. Start stashing to see your activity here!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
