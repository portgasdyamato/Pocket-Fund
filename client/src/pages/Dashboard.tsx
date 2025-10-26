import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, Target, MessageCircle, TrendingUp } from "lucide-react";
import HealthScoreCard from "@/components/HealthScoreCard";
import QuickActionButton from "@/components/QuickActionButton";
import ChallengeCard from "@/components/ChallengeCard";
import ExpenseItem from "@/components/ExpenseItem";
import AchievementBadge from "@/components/AchievementBadge";
import StreakCounter from "@/components/StreakCounter";
import AddExpenseModal from "@/components/AddExpenseModal";
import type { Transaction } from "@shared/schema";
import { format } from "date-fns";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const { data: transactions = [], isLoading: isLoadingTransactions, isError: isTransactionsError } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    retry: false,
  });

  // todo: remove mock functionality
  const mockChallenges = [
    {
      id: '1',
      title: 'No Coffee Shop Week',
      difficulty: 'Medium' as const,
      points: 500,
      progress: 42,
      timeRemaining: '3 days left',
      isActive: true
    },
    {
      id: '2',
      title: 'Save $100 This Week',
      difficulty: 'Easy' as const,
      points: 250,
      progress: 65,
      timeRemaining: '2 days left',
      isActive: true
    },
    {
      id: '3',
      title: 'Track Every Expense',
      difficulty: 'Hard' as const,
      points: 1000,
      progress: 28,
      timeRemaining: '1 week left',
      isActive: false
    }
  ];

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

  // todo: remove mock functionality
  const mockAchievements = [
    {
      id: '1',
      type: 'trophy' as const,
      title: 'First Week Complete!',
      description: 'Logged expenses for 7 days straight',
      points: 100
    },
    {
      id: '2',
      type: 'zap' as const,
      title: 'Quick Saver',
      description: 'Saved $50 in one day',
      points: 50
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 space-y-6 max-w-6xl">
        {/* Hero Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <HealthScoreCard 
            score={78} 
            message="You're crushing it! Keep up the momentum." 
          />
          
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
            {mockChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                {...challenge}
                onAction={() => console.log(`Challenge ${challenge.id} action`)}
              />
            ))}
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
              {mockAchievements.map((achievement) => (
                <AchievementBadge key={achievement.id} {...achievement} />
              ))}
            </div>
          </Card>
        </div>
      </main>

      <AddExpenseModal
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
      />
    </div>
  );
}
