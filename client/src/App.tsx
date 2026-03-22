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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stellar flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl border-4 border-blue-500/10 border-t-blue-500 animate-spin" />
            <div className="absolute inset-0 bg-blue-500/10 blur-xl opacity-50" />
          </div>
          <p className="text-blue-400 font-black text-[10px] tracking-[0.5em] uppercase">Initializing Engine...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Landing />;
  }

  return (
    <div className="bg-stellar min-h-screen">
      <NavigationBar />
      <main className="page-main relative z-10">
        {children}
      </main>
    </div>
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
