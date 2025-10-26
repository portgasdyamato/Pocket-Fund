import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, Flame, Zap, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import type { Goal, Streak } from "@shared/schema";

export default function HQ() {
  const { data: mainGoal } = useQuery<Goal | null>({
    queryKey: ["/api/goals/main"],
  });

  const { data: streak } = useQuery<Streak>({
    queryKey: ["/api/streak"],
  });

  const { data: untaggedTransactions } = useQuery<any[]>({
    queryKey: ["/api/transactions/untagged"],
  });

  const { data: totalStashedData } = useQuery<{ total: number }>({
    queryKey: ["/api/stash/total"],
  });

  const progress = mainGoal
    ? (parseFloat(mainGoal.currentAmount) / parseFloat(mainGoal.targetAmount)) * 100
    : 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">HQ</h1>
        <p className="text-muted-foreground">Your command center for financial domination</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card data-testid="card-main-quest">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Main Quest
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mainGoal ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-lg" data-testid="text-goal-name">
                      {mainGoal.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-3" data-testid="progress-goal" />
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-muted-foreground">
                      ₹{parseFloat(mainGoal.currentAmount).toLocaleString('en-IN')}
                    </span>
                    <span className="font-medium" data-testid="text-goal-target">
                      ₹{parseFloat(mainGoal.targetAmount).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                <Link href="/glow-up">
                  <Button className="w-full" data-testid="button-stash-now">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Stash Now
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No main quest set yet</p>
                <Link href="/glow-up">
                  <Button data-testid="button-create-goal">Create Your First Goal</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-save-streak">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-destructive" />
              Save Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="text-6xl font-bold mb-2" data-testid="text-save-streak">
                {streak?.saveStreak || 0}
              </div>
              <p className="text-muted-foreground">days in a row</p>
              <p className="text-sm text-muted-foreground mt-4">
                Keep stashing daily to build your streak!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card data-testid="card-daily-fight">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            Daily Fight
          </CardTitle>
        </CardHeader>
        <CardContent>
          {untaggedTransactions && untaggedTransactions.length > 0 ? (
            <div className="space-y-4">
              <p className="text-lg">
                You have <span className="font-bold text-accent" data-testid="text-untagged-count">{untaggedTransactions.length}</span> transactions waiting to be categorized
              </p>
              <Link href="/fight">
                <Button data-testid="button-start-fight">
                  Start The Fight
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-2">All caught up!</p>
              <p className="text-sm text-muted-foreground">
                No new transactions to categorize. Check back later.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card data-testid="card-total-stashed">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Total Stashed</div>
            <div className="text-3xl font-bold" data-testid="text-total-stashed">
              ₹{(totalStashedData?.total || 0).toLocaleString('en-IN')}
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-fight-streak">
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Fight Streak</div>
            <div className="text-3xl font-bold" data-testid="text-fight-streak">
              {streak?.fightStreak || 0} days
            </div>
          </CardContent>
        </Card>

        <Link href="/level-up">
          <Card className="hover-elevate cursor-pointer" data-testid="card-quests-link">
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Complete Quests</div>
              <div className="text-xl font-bold">Level Up →</div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
