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
import Assistant from "@/pages/Assistant";
import History from "@/pages/History";
import Profile from "@/pages/Profile";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/not-found";
import Vault from "@/pages/Vault";
import Learn from "@/pages/Learn";
import Achievements from "@/pages/Achievements";
import Analytics from "@/pages/Analytics";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loader during initial fetch AND during retries (post-OAuth session check)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <p className="text-white/40 text-sm font-medium tracking-widest uppercase">Authenticating...</p>
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
      <Route path="/analytics" component={() => (
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      )} />
      <Route path="/vault" component={() => (
        <ProtectedRoute>
          <Vault />
        </ProtectedRoute>
      )} />
      <Route path="/learn" component={() => (
        <ProtectedRoute>
          <Learn />
        </ProtectedRoute>
      )} />
      <Route path="/achievements" component={() => (
        <ProtectedRoute>
          <Achievements />
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
      <Route path="/assistant" component={() => (
        <ProtectedRoute>
          <Assistant />
        </ProtectedRoute>
      )} />
      <Route path="/history" component={() => (
        <ProtectedRoute>
          <History />
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
