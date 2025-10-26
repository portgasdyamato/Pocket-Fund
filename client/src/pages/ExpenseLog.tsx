import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Coffee, Car, ShoppingBag, Ticket, FileText, Tag, 
  Trash2, PlusCircle, Calendar
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ThemeToggle";
import AddExpenseModal from "@/components/AddExpenseModal";
import { format } from "date-fns";
import type { Transaction } from "@shared/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ExpenseLog() {
  const { toast } = useToast();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: transactions = [], isLoading, isError } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/transactions/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions/untagged"] });
      toast({
        title: "Deleted",
        description: "Expense deleted successfully",
      });
      setDeleteId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
    },
  });

  const getCategoryIcon = (cat: string | null) => {
    const iconClass = "w-5 h-5";
    if (!cat) return <Tag className={iconClass} />;
    
    switch (cat.toLowerCase()) {
      case 'food': return <Coffee className={iconClass} />;
      case 'transport': return <Car className={iconClass} />;
      case 'shopping': return <ShoppingBag className={iconClass} />;
      case 'entertainment': return <Ticket className={iconClass} />;
      case 'bills': return <FileText className={iconClass} />;
      default: return <Tag className={iconClass} />;
    }
  };

  const getCategoryColor = (cat: string | null) => {
    if (!cat) return 'bg-muted text-muted-foreground';
    
    switch (cat.toLowerCase()) {
      case 'food': return 'bg-chart-1/10 text-chart-1';
      case 'transport': return 'bg-chart-2/10 text-chart-2';
      case 'shopping': return 'bg-chart-3/10 text-chart-3';
      case 'entertainment': return 'bg-chart-4/10 text-chart-4';
      case 'bills': return 'bg-chart-5/10 text-chart-5';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTagColor = (tag: string | null) => {
    if (!tag) return 'secondary';
    
    switch (tag) {
      case 'Need': return 'default';
      case 'Want': return 'secondary';
      case 'Ick': return 'destructive';
      default: return 'secondary';
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (d.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return format(d, 'MMM d, yyyy');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-primary/20 bg-background/30 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/30 shadow-[0_8px_32px_rgba(139,92,246,0.1)]">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold" data-testid="text-page-title">Expense Log</h1>
            <Badge variant="secondary">{transactions.length} expenses</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsAddExpenseOpen(true)}
              data-testid="button-add-expense"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {isLoading ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Loading expenses...</p>
          </Card>
        ) : isError ? (
          <Card className="p-12 text-center backdrop-blur-xl bg-card/40 border-border/50">
            <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground mb-6">
              Please log in to view and manage your expenses
            </p>
            <Button onClick={() => window.location.href = '/api/login'}>
              Log In
            </Button>
          </Card>
        ) : transactions.length === 0 ? (
          <Card className="p-12 text-center backdrop-blur-xl bg-card/40 border-border/50">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">No expenses yet</h2>
            <p className="text-muted-foreground mb-6">
              Start logging your expenses to track your spending
            </p>
            <Button
              onClick={() => setIsAddExpenseOpen(true)}
              data-testid="button-add-first-expense"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Your First Expense
            </Button>
          </Card>
        ) : (
          <Card className="backdrop-blur-xl bg-card/40 border-border/50">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="p-4 space-y-2">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center gap-3 p-4 rounded-lg hover-elevate group"
                    data-testid={`item-expense-${transaction.id}`}
                  >
                    <div className={`p-2 rounded-full ${getCategoryColor(transaction.category)}`}>
                      {getCategoryIcon(transaction.category)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate" data-testid={`text-description-${transaction.id}`}>
                        {transaction.description}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {transaction.category && (
                          <Badge variant="secondary" className="text-xs" data-testid={`badge-category-${transaction.id}`}>
                            {transaction.category}
                          </Badge>
                        )}
                        {transaction.tag && (
                          <Badge variant={getTagColor(transaction.tag)} className="text-xs" data-testid={`badge-tag-${transaction.id}`}>
                            {transaction.tag}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground" data-testid={`text-date-${transaction.id}`}>
                          {formatDate(transaction.date)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-base font-mono" data-testid={`text-amount-${transaction.id}`}>
                          ₹{parseFloat(transaction.amount).toFixed(2)}
                        </p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setDeleteId(transaction.id)}
                        data-testid={`button-delete-${transaction.id}`}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        )}
      </main>

      <AddExpenseModal
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
      />

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this expense from your log.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
