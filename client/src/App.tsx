import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { NavigationBar } from "@/components/NavigationBar";
import Dashboard from "@/pages/Dashboard";
import BudgetPage from "@/pages/BudgetPage";
import ChallengesPage from "@/pages/ChallengesPage";
import AskCoach from "@/pages/AskCoach";
import ExpenseLog from "@/pages/ExpenseLog";
import Profile from "@/pages/Profile";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/not-found";
import Fight from "@/pages/Fight";
import GlowUp from "@/pages/GlowUp";
import LevelUp from "@/pages/LevelUp";
import TrophyCase from "@/pages/TrophyCase";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Landing />;
  }

  return (
    <>
      <NavigationBar />
      {children}
    </>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      )} />
      <Route path="/fight" component={() => (
        <ProtectedRoute>
          <Fight />
        </ProtectedRoute>
      )} />
      <Route path="/glow-up" component={() => (
        <ProtectedRoute>
          <GlowUp />
        </ProtectedRoute>
      )} />
      <Route path="/level-up" component={() => (
        <ProtectedRoute>
          <LevelUp />
        </ProtectedRoute>
      )} />
      <Route path="/trophy-case" component={() => (
        <ProtectedRoute>
          <TrophyCase />
        </ProtectedRoute>
      )} />
      <Route path="/budget" component={() => (
        <ProtectedRoute>
          <BudgetPage />
        </ProtectedRoute>
      )} />
      <Route path="/challenges" component={() => (
        <ProtectedRoute>
          <ChallengesPage />
        </ProtectedRoute>
      )} />
      <Route path="/coach" component={() => (
        <ProtectedRoute>
          <AskCoach />
        </ProtectedRoute>
      )} />
      <Route path="/expenses" component={() => (
        <ProtectedRoute>
          <ExpenseLog />
        </ProtectedRoute>
      )} />
      <Route path="/profile" component={() => (
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      )} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
