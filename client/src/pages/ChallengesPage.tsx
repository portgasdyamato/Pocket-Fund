import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChallengeCard from "@/components/ChallengeCard";
import ThemeToggle from "@/components/ThemeToggle";
import StreakCounter from "@/components/StreakCounter";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function ChallengesPage() {
  const [activeTab, setActiveTab] = useState("active");

  // todo: remove mock functionality
  const activeChallenges = [
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
  ];

  // todo: remove mock functionality
  const availableChallenges = [
    {
      id: '3',
      title: 'Track Every Expense',
      difficulty: 'Hard' as const,
      points: 1000,
      progress: 0,
      timeRemaining: '1 week',
      isActive: false
    },
    {
      id: '4',
      title: 'Cook 5 Meals at Home',
      difficulty: 'Medium' as const,
      points: 400,
      progress: 0,
      timeRemaining: '1 week',
      isActive: false
    },
    {
      id: '5',
      title: 'No Impulse Buys',
      difficulty: 'Hard' as const,
      points: 750,
      progress: 0,
      timeRemaining: '3 days',
      isActive: false
    },
    {
      id: '6',
      title: 'Save $50 This Week',
      difficulty: 'Easy' as const,
      points: 200,
      progress: 0,
      timeRemaining: '1 week',
      isActive: false
    },
  ];

  // todo: remove mock functionality
  const completedChallenges = [
    {
      id: '7',
      title: 'First Week Logging',
      difficulty: 'Easy' as const,
      points: 100,
      progress: 100,
      isActive: false
    },
    {
      id: '8',
      title: 'Budget Setup Pro',
      difficulty: 'Medium' as const,
      points: 300,
      progress: 100,
      isActive: false
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Challenges</h1>
            <StreakCounter days={12} />
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Stats Card */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">2,450</p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-secondary">8</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent">2</p>
              <p className="text-sm text-muted-foreground">Active Now</p>
            </div>
          </div>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="active" data-testid="tab-active">Active</TabsTrigger>
            <TabsTrigger value="available" data-testid="tab-available">Available</TabsTrigger>
            <TabsTrigger value="completed" data-testid="tab-completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                {...challenge}
                onAction={() => console.log(`Continue challenge ${challenge.id}`)}
              />
            ))}
          </TabsContent>

          <TabsContent value="available" className="grid gap-4 sm:grid-cols-2">
            {availableChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                {...challenge}
                onAction={() => console.log(`Start challenge ${challenge.id}`)}
              />
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                {...challenge}
                onAction={() => console.log(`View challenge ${challenge.id}`)}
              />
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
