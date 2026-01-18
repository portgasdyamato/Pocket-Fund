import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, Target, MessageCircle, TrendingUp, Wallet, Plus, Trophy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import HealthScoreCard from "@/components/HealthScoreCard";
import QuickActionButton from "@/components/QuickActionButton";
import ChallengeCard from "@/components/ChallengeCard";
import ExpenseItem from "@/components/ExpenseItem";
import AchievementBadge from "@/components/AchievementBadge";
import StreakCounter from "@/components/StreakCounter";
import AddExpenseModal from "@/components/AddExpenseModal";
import ChallengeDetailsModal from "@/components/ChallengeDetailsModal";
import type { Transaction, Quest, UserQuest, Badge, UserBadge } from "@shared/schema";
import { format } from "date-fns";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  
  // State for Challenge Details Modal
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);

  const { data: transactions = [], isLoading: isLoadingTransactions, isError: isTransactionsError } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    retry: false,
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");

  // Fetch Quests (Challenges)
  const { data: allQuests = [] } = useQuery<Quest[]>({
    queryKey: ["/api/quests"],
  });

  const { data: userQuests = [] } = useQuery<UserQuest[]>({
    queryKey: ["/api/user/quests"],
  });

  // Fetch Badges (Achievements)
  const { data: allBadges = [] } = useQuery<Badge[]>({
    queryKey: ["/api/badges"],
  });

  const { data: userBadges = [] } = useQuery<UserBadge[]>({
    queryKey: ["/api/user/badges"],
  });

  const topUpMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/wallet/add", "POST", {
        amount: topUpAmount,
      });
    },
    onSuccess: async (response) => {
      const data = await response.json();
      queryClient.setQueryData(["/api/auth/user"], (old: any) => ({
        ...old,
        walletBalance: data.newBalance
      }));
      setIsTopUpOpen(false);
      setTopUpAmount("");
      toast({
        title: "Wallet Top Up Successful",
        description: `Added ₹${topUpAmount} to your wallet`,
      });
    },
    onError: () => {
      toast({
        title: "Top Up Failed",
        variant: "destructive",
      });
    }
  });

  // Prepare Challenges Data
  const challenges = allQuests.slice(0, 3).map(quest => {
    const userQuest = userQuests.find(uq => uq.questId === quest.id);
    // Simple logic for determining progress/active state (can be refined based on backend logic)
    // For now assuming: if userQuest exists and not completed, it's active.
    
    // We need to parse quest content to get target/real progress logic if complex.
    // For MVP, if it's a "save" quest, we might check wallet? 
    // This part is tricky without backend logic returning progress.
    // We'll simulate progress or use what we have.
    
    // Assuming quest.content might contain target info like {"target": 1000, "type": "save"}
    let target = 100; // Default
    let type = 'count';
    try {
        const content = JSON.parse(quest.content);
        if (content.target) target = content.target;
        if (content.type) type = content.type;
    } catch (e) {
        // ignore
    }

    return {
      id: quest.id,
      title: quest.title,
      description: quest.description,
      difficulty: (quest.difficulty as "Easy" | "Medium" | "Hard") || "Medium",
      points: quest.points,
      progress: userQuest?.completed ? target : (userQuest ? 0 : 0), // Needs real progress from API
      target: target,
      timeRemaining: 'Ongoing', // Dynamic?
      isActive: !!userQuest && !userQuest.completed,
      isCompleted: !!userQuest?.completed,
      type: type
    };
  });

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (d.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return format(d, 'MMM d');
    }
  };

  const recentExpenses = transactions.slice(0, 4).map(t => ({
    id: t.id,
    category: t.category || 'Other',
    description: t.description,
    amount: parseFloat(t.amount),
    date: formatDate(t.date),
  }));

  // Prepare Achievements Data
  // Sort userBadges by earnedAt desc
  const sortedUserBadges = [...userBadges].sort((a, b) => 
    new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime()
  );
  
  const recentAchievements = sortedUserBadges.slice(0, 2).map(ub => {
    const badge = allBadges.find(b => b.id === ub.badgeId);
    return {
      id: ub.id,
      type: 'trophy' as const, // can use badge.icon logic
      title: badge?.name || 'Unknown Badge',
      description: badge?.description || '',
      points: 0 // Badges might not have points unless we add them to schema
    };
  });
  
  // If no recent achievements, maybe show some locked ones to encourage?
  // Or just empty state. For now let's just show earned ones.

  const openChallengeModal = (challenge: any) => {
    setSelectedChallenge(challenge);
    setIsChallengeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 space-y-6 max-w-6xl">
        {/* Hero Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Wallet Card */}
          <Card className="group p-6 relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-primary/20 via-card/40 to-card/60 border-primary/30 hover:border-primary/60 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
             <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-primary" />
                    My Wallet
                  </h3>
                  <p className="text-muted-foreground text-sm">Available Balance</p>
                </div>
                <Dialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="rounded-full" variant="outline">
                      <Plus className="w-4 h-4 mr-1" /> Add Money
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Top Up Wallet</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Amount (₹)</Label>
                        <Input 
                          type="number" 
                          placeholder="Example: 5000"
                          value={topUpAmount}
                          onChange={(e) => setTopUpAmount(e.target.value)}
                        />
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => topUpMutation.mutate()}
                        disabled={topUpMutation.isPending || !topUpAmount || parseFloat(topUpAmount) <= 0}
                      >
                        Add Funds
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
             </div>
             <div className="text-4xl font-bold">
               ₹{parseFloat(user?.walletBalance?.toString() || "0").toLocaleString('en-IN')}
             </div>
          </Card>

          <HealthScoreCard 
            score={78} 
            message="You're crushing it! Keep up the momentum." 
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          
          <Card className="group p-6 relative overflow-hidden backdrop-blur-xl bg-card/40 border-secondary/30 shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-secondary/60 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 animate-fadeIn">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-accent/10 pointer-events-none" />
            <h3 className="font-bold text-lg mb-4 relative z-10">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3 relative z-10">
              <QuickActionButton
                icon={PlusCircle}
                label="Log Expense"
                onClick={() => setIsAddExpenseOpen(true)}
              />
              <QuickActionButton
                icon={Target}
                label="Fight Plan"
                onClick={() => console.log('Fight plan clicked')}
              />
              <QuickActionButton
                icon={MessageCircle}
                label="Ask Coach"
                onClick={() => setLocation('/coach')}
              />
              <QuickActionButton
                icon={TrendingUp}
                label="View Stats"
                onClick={() => console.log('View stats clicked')}
              />
            </div>
          </Card>
        </div>

        {/* Active Challenges */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">This Week's Rounds</h2>
            <Button variant="ghost" size="sm" data-testid="button-view-all-challenges">
              View All
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {challenges.length > 0 ? (
                challenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    {...challenge}
                    onAction={() => openChallengeModal(challenge)}
                  />
                ))
            ) : (
                <div className="col-span-3 text-center py-8 text-muted-foreground">
                    No active challenges. Check back later!
                </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="group p-6 backdrop-blur-xl bg-card/40 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Recent Expenses</h3>
              <Button variant="ghost" size="sm" onClick={() => setLocation('/expenses')} data-testid="button-view-all-expenses">
                View All
              </Button>
            </div>
            <div className="space-y-1">
              {isLoadingTransactions ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Loading...
                </p>
              ) : isTransactionsError ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Please log in to view your expenses
                </p>
              ) : recentExpenses.length > 0 ? (
                recentExpenses.map((expense) => (
                  <ExpenseItem key={expense.id} {...expense} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No expenses logged yet
                </p>
              )}
            </div>
          </Card>

          <Card className="group p-6 backdrop-blur-xl bg-card/40 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fadeIn">
            <h3 className="font-bold text-lg mb-4">Recent Wins</h3>
            <div className="space-y-3">
              {recentAchievements.length > 0 ? (
                  recentAchievements.map((achievement) => (
                    <AchievementBadge key={achievement.id} {...achievement} />
                  ))
              ) : (
                  <div className="text-center py-8 flex flex-col items-center gap-2 text-muted-foreground">
                      <Trophy className="w-8 h-8 opacity-20" />
                      <p>No recent achievements.</p>
                      <p className="text-xs">Complete quests to earn badges!</p>
                  </div>
              )}
            </div>
          </Card>
        </div>
      </main>

      <AddExpenseModal
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
      />
      
      <ChallengeDetailsModal 
        isOpen={isChallengeModalOpen}
        onClose={() => setIsChallengeModalOpen(false)}
        challenge={selectedChallenge}
      />
    </div>
  );
}

