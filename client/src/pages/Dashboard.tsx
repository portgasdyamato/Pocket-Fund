import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, Target, MessageCircle, TrendingUp } from "lucide-react";
import HealthScoreCard from "@/components/HealthScoreCard";
import QuickActionButton from "@/components/QuickActionButton";
import ChallengeCard from "@/components/ChallengeCard";
import ExpenseItem from "@/components/ExpenseItem";
import AchievementBadge from "@/components/AchievementBadge";
import StreakCounter from "@/components/StreakCounter";
import ThemeToggle from "@/components/ThemeToggle";
import AddExpenseModal from "@/components/AddExpenseModal";

export default function Dashboard() {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

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

  // todo: remove mock functionality
  const mockExpenses = [
    { id: '1', category: 'Food', description: 'Starbucks Latte', amount: 6.50, date: 'Today' },
    { id: '2', category: 'Transport', description: 'Uber to work', amount: 12.00, date: 'Today' },
    { id: '3', category: 'Shopping', description: 'New headphones', amount: 89.99, date: 'Yesterday' },
    { id: '4', category: 'Entertainment', description: 'Movie tickets', amount: 24.00, date: 'Yesterday' },
  ];

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
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-primary/20 bg-background/30 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/30 shadow-[0_8px_32px_rgba(139,92,246,0.1)]">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">The Glow-Up</h1>
            <StreakCounter days={12} />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" data-testid="button-notifications">
              <div className="relative">
                <MessageCircle className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
              </div>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 max-w-6xl">
        {/* Hero Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <HealthScoreCard 
            score={78} 
            message="You're crushing it! Keep up the momentum." 
          />
          
          <Card className="p-6 relative overflow-hidden backdrop-blur-xl bg-card/40 border-secondary/30 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
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
                onClick={() => console.log('Ask coach clicked')}
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
          <Card className="p-6 backdrop-blur-xl bg-card/40 border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Recent Expenses</h3>
              <Button variant="ghost" size="sm" data-testid="button-view-all-expenses">
                View All
              </Button>
            </div>
            <div className="space-y-1">
              {mockExpenses.map((expense) => (
                <ExpenseItem key={expense.id} {...expense} />
              ))}
            </div>
          </Card>

          <Card className="p-6 backdrop-blur-xl bg-card/40 border-border/50">
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
        onAdd={(expense) => {
          console.log('Expense added:', expense);
          // todo: remove mock functionality - In real app, this would save to backend
        }}
      />
    </div>
  );
}
