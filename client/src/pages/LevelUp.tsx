import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Star } from "lucide-react";

export default function LevelUp() {
  const quests = [
    {
      id: "1",
      title: "The Subscription Slayer",
      description: "Learn to audit and cancel unnecessary subscriptions",
      difficulty: "Easy",
      points: 100,
      icon: "📱",
      content: "Subscriptions can drain your wallet without you noticing. Learn how to track, evaluate, and cancel subscriptions you don't need.",
    },
    {
      id: "2",
      title: "Credit Score 101",
      description: "Understanding your credit score and how to improve it",
      difficulty: "Medium",
      points: 250,
      icon: "📊",
      content: "Your credit score affects loan rates and approvals. Learn what impacts it and how to build a strong credit history.",
    },
    {
      id: "3",
      title: "Emergency Fund Master",
      description: "Build a safety net for unexpected expenses",
      difficulty: "Medium",
      points: 300,
      icon: "🛡️",
      content: "Financial emergencies happen. Learn how to build and maintain an emergency fund that gives you peace of mind.",
    },
    {
      id: "4",
      title: "Investment Basics",
      description: "Introduction to investing for beginners",
      difficulty: "Hard",
      points: 500,
      icon: "💰",
      content: "Make your money work for you. Learn about different investment options, risk management, and starting your investment journey.",
    },
    {
      id: "5",
      title: "Tax Optimization",
      description: "Legal ways to reduce your tax burden",
      difficulty: "Hard",
      points: 400,
      icon: "🧾",
      content: "Don't pay more tax than necessary. Learn about deductions, exemptions, and tax-saving investments available in India.",
    },
    {
      id: "6",
      title: "Budget Like a Boss",
      description: "Master the 50/30/20 budgeting rule",
      difficulty: "Easy",
      points: 150,
      icon: "📈",
      content: "The 50/30/20 rule makes budgeting simple: 50% needs, 30% wants, 20% savings. Learn how to apply it to your income.",
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-primary/10 text-primary";
      case "Medium":
        return "bg-secondary/10 text-secondary";
      case "Hard":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">Level Up</h1>
        <p className="text-muted-foreground">Complete quests to master financial literacy</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {quests.map((quest) => (
          <Card key={quest.id} className="group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/40 to-card/60 border border-primary/20 hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer" data-testid={`card-quest-${quest.id}`}>
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <div className="text-4xl">{quest.icon}</div>
                <div className="flex gap-2">
                  <Badge className={getDifficultyColor(quest.difficulty)}>
                    {quest.difficulty}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {quest.points}
                  </Badge>
                </div>
              </div>
              <CardTitle>{quest.title}</CardTitle>
              <CardDescription>{quest.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{quest.content}</p>
              <div className="flex items-center gap-2 text-sm text-primary">
                <BookOpen className="w-4 h-4" />
                <span>Coming Soon</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-8 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Interactive Quests Coming Soon</h3>
          <p className="text-muted-foreground">
            Complete bite-sized financial literacy lessons to earn badges and level up your money skills.
          </p>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
