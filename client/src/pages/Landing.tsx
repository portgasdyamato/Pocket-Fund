import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, TrendingUp, Trophy, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            The Financial Glow-Up
          </h1>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-login"
          >
            Log In
          </Button>
        </header>

        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            Turn Savings Into Your Superpower
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            A gamified financial app designed for young adults in India. Transform the stress of saving into an engaging experience.
          </p>
          <Button 
            size="lg" 
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-get-started"
          >
            Get Started
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card data-testid="card-feature-track">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">TRACK</h3>
              <p className="text-sm text-muted-foreground">
                Connect your bank securely and get real-time transaction feeds
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-feature-fight">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">FIGHT</h3>
              <p className="text-sm text-muted-foreground">
                Categorize spending as Needs, Wants, or Icks and fight impulse buys
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-feature-stash">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">STASH</h3>
              <p className="text-sm text-muted-foreground">
                Move real money to your Locker with one tap and watch it grow
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-feature-grow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">GROW</h3>
              <p className="text-sm text-muted-foreground">
                Build streaks, unlock badges, and level up your financial journey
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Ready for Your Financial Glow-Up?</h3>
          <Button 
            size="lg" 
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-start-journey"
          >
            Start Your Journey
          </Button>
        </div>
      </div>
    </div>
  );
}
