import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import BudgetCategoryCard from "@/components/BudgetCategoryCard";
import ThemeToggle from "@/components/ThemeToggle";
import StreakCounter from "@/components/StreakCounter";
import { Coffee, Car, ShoppingBag, Ticket, FileText, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function BudgetPage() {
  // todo: remove mock functionality
  const totalBudget = 2000;
  const totalSpent = 1456;
  const percentageUsed = (totalSpent / totalBudget) * 100;

  // todo: remove mock functionality
  const categories = [
    { id: '1', category: 'Food & Dining', icon: Coffee, spent: 380, budget: 400, color: 'bg-chart-1/10 text-chart-1' },
    { id: '2', category: 'Transport', icon: Car, spent: 150, budget: 200, color: 'bg-chart-2/10 text-chart-2' },
    { id: '3', category: 'Shopping', icon: ShoppingBag, spent: 520, budget: 500, color: 'bg-chart-3/10 text-chart-3' },
    { id: '4', category: 'Entertainment', icon: Ticket, spent: 200, budget: 300, color: 'bg-chart-4/10 text-chart-4' },
    { id: '5', category: 'Bills', icon: FileText, spent: 206, budget: 600, color: 'bg-chart-5/10 text-chart-5' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-primary/20 bg-background/30 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/30 shadow-[0_8px_32px_rgba(139,92,246,0.1)]">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">The Fight Plan</h1>
            <StreakCounter days={12} />
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
        {/* Overview Card */}
        <Card className="p-6 backdrop-blur-xl bg-card/40 border-primary/20 shadow-[0_0_30px_rgba(139,92,246,0.12)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
          <h2 className="text-2xl font-bold mb-6 relative z-10">Monthly Budget Overview</h2>
          <div className="space-y-4 relative z-10">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                <p className="text-4xl font-bold font-mono">${totalSpent}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Budget</p>
                <p className="text-2xl font-bold font-mono text-muted-foreground">${totalBudget}</p>
              </div>
            </div>
            <Progress value={percentageUsed} className="h-3" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {percentageUsed.toFixed(0)}% of budget used
              </span>
              <span className="font-bold text-secondary">
                ${(totalBudget - totalSpent).toFixed(0)} remaining
              </span>
            </div>
          </div>
        </Card>

        {/* Categories */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Categories</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {categories.map((cat) => (
              <BudgetCategoryCard key={cat.id} {...cat} />
            ))}
          </div>
        </div>

        {/* Tips Card */}
        <Card className="p-6 backdrop-blur-xl bg-primary/10 border-primary/30 shadow-[0_0_25px_rgba(139,92,246,0.2)]">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            <span>💪</span>
            <span>Coach's Tip</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            You're over budget on Shopping but crushing it on Bills! Try moving some of that shopping energy to savings. You got this!
          </p>
        </Card>
      </main>
    </div>
  );
}
