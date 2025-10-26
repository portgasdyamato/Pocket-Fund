import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Flame, Calendar } from "lucide-react";
import type { Streak } from "@shared/schema";

export default function TrophyCase() {
  const { data: streak } = useQuery<Streak>({
    queryKey: ["/api/streak"],
  });

  const achievements = [
    {
      id: "first-stash",
      icon: "🎯",
      title: "First Stash",
      description: "Saved your first ₹1,000",
      points: 100,
      unlocked: true,
    },
    {
      id: "week-streak",
      icon: "🔥",
      title: "Week Warrior",
      description: "Maintained a 7-day save streak",
      points: 250,
      unlocked: (streak?.saveStreak || 0) >= 7,
    },
    {
      id: "fight-master",
      icon: "⚔️",
      title: "Fight Master",
      description: "Categorized 100 transactions",
      points: 300,
      unlocked: false,
    },
    {
      id: "ick-slayer",
      icon: "💀",
      title: "Ick Slayer",
      description: "Identified 50 Icks",
      points: 200,
      unlocked: false,
    },
    {
      id: "goal-crusher",
      icon: "🏆",
      title: "Goal Crusher",
      description: "Completed your first savings goal",
      points: 500,
      unlocked: false,
    },
    {
      id: "month-master",
      icon: "📅",
      title: "Month Master",
      description: "Maintained a 30-day save streak",
      points: 1000,
      unlocked: (streak?.saveStreak || 0) >= 30,
    },
    {
      id: "ten-k-club",
      icon: "💎",
      title: "10K Club",
      description: "Stashed ₹10,000 total",
      points: 400,
      unlocked: false,
    },
    {
      id: "quest-complete",
      icon: "📚",
      title: "Knowledge Seeker",
      description: "Completed your first financial literacy quest",
      points: 150,
      unlocked: false,
    },
  ];

  const streakCalendar = Array.from({ length: 30 }, (_, i) => {
    const dayNumber = i + 1;
    const hasActivity = dayNumber <= (streak?.saveStreak || 0);
    return {
      day: dayNumber,
      hasActivity,
    };
  });

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">Trophy Case</h1>
        <p className="text-muted-foreground">Your badges, streaks, and achievements</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card data-testid="card-save-streak" className="group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/40 to-card/60 border border-destructive/20 hover:border-destructive/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-destructive" />
              Save Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-6xl font-bold mb-2" data-testid="text-save-streak">
                {streak?.saveStreak || 0}
              </div>
              <p className="text-muted-foreground">days in a row</p>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-fight-streak" className="group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/40 to-card/60 border border-primary/20 hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Fight Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-6xl font-bold mb-2" data-testid="text-fight-streak">
                {streak?.fightStreak || 0}
              </div>
              <p className="text-muted-foreground">days in a row</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/40 to-card/60 border border-secondary/20 hover:border-secondary/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <CardHeader>
          <CardTitle>Streak Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-2">
            {streakCalendar.map((day) => (
              <div
                key={day.day}
                className={`aspect-square rounded-md flex items-center justify-center text-xs font-medium ${
                  day.hasActivity
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
                data-testid={`calendar-day-${day.day}`}
              >
                {day.day}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">Achievements</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={`group relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-card/80 via-card/40 to-card/60 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${achievement.unlocked ? 'border-accent/20 hover:border-accent/60' : 'border-border/30 opacity-50'}`}
              data-testid={`card-achievement-${achievement.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {achievement.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{achievement.points} pts</span>
                      {achievement.unlocked && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded ml-auto">
                          Unlocked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
