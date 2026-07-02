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
      <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
        
        <div className="flex flex-col items-center gap-8 relative z-10">
          <div className="relative">
            {/* Outer rotating ring */}
            <div className="w-20 h-20 rounded-full border-2 border-white/5 border-t-primary/80 border-r-primary/30 animate-[spin_3s_linear_infinite]" />
            {/* Inner counter-rotating ring */}
            <div className="absolute inset-2 rounded-full border-2 border-white/5 border-l-accent/80 border-b-accent/30 animate-[spin_2s_linear_infinite_reverse]" />
            {/* Center static diamond */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-white/80 rounded-sm rotate-45 animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <p className="text-white/60 text-xs font-black tracking-[0.4em] uppercase">Authenticating</p>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
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
