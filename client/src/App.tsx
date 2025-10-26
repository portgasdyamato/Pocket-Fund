import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/Dashboard";
import BudgetPage from "@/pages/BudgetPage";
import ChallengesPage from "@/pages/ChallengesPage";
import AskCoach from "@/pages/AskCoach";
import ExpenseLog from "@/pages/ExpenseLog";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/budget" component={BudgetPage} />
      <Route path="/challenges" component={ChallengesPage} />
      <Route path="/coach" component={AskCoach} />
      <Route path="/expenses" component={ExpenseLog} />
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
