import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, ThumbsDown, ShoppingBag, Check } from "lucide-react";
import type { Transaction } from "@shared/schema";

export default function Fight() {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions/untagged"],
  });

  const tagMutation = useMutation({
    mutationFn: async ({ id, tag }: { id: string; tag: string }) => {
      await apiRequest(`/api/transactions/${id}/tag`, "PATCH", { tag });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions/untagged"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/streak"] });
      setCurrentIndex(0);
    },
  });

  const handleTag = async (tag: 'Need' | 'Want' | 'Ick') => {
    const transaction = transactions[currentIndex];
    if (!transaction) return;

    await tagMutation.mutateAsync({ id: transaction.id, tag });

    let message = "";
    if (tag === "Need") {
      message = "Essential purchase tagged!";
    } else if (tag === "Want") {
      message = "Reasonable want noted.";
    } else {
      message = "Ick identified! Fight back by stashing some cash.";
    }

    toast({
      title: "Tagged!",
      description: message,
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto text-center py-12">
          <Check className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">All Caught Up!</h2>
          <p className="text-muted-foreground">
            No transactions to categorize right now. Check back later!
          </p>
        </div>
      </div>
    );
  }

  const currentTransaction = transactions[currentIndex];

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2" data-testid="text-page-title">The Fight</h1>
          <p className="text-muted-foreground">
            Categorize your spending • {currentIndex + 1} of {transactions.length}
          </p>
        </div>

        <Card data-testid="card-transaction">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2" data-testid="text-transaction-description">
                  {currentTransaction.description}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {new Date(currentTransaction.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold" data-testid="text-transaction-amount">
                  ₹{parseFloat(currentTransaction.amount).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button
                onClick={() => handleTag('Need')}
                variant="outline"
                className="w-full justify-start text-left h-auto py-4"
                disabled={tagMutation.isPending}
                data-testid="button-tag-need"
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Need</div>
                    <div className="text-sm text-muted-foreground">
                      Essential expenses like rent, groceries, bills, transportation
                    </div>
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => handleTag('Want')}
                variant="outline"
                className="w-full justify-start text-left h-auto py-4"
                disabled={tagMutation.isPending}
                data-testid="button-tag-want"
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Want</div>
                    <div className="text-sm text-muted-foreground">
                      Non-essential but reasonable like dining out, entertainment
                    </div>
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => handleTag('Ick')}
                variant="outline"
                className="w-full justify-start text-left h-auto py-4"
                disabled={tagMutation.isPending}
                data-testid="button-tag-ick"
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center shrink-0">
                    <ThumbsDown className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Ick</div>
                    <div className="text-sm text-muted-foreground">
                      Impulse buys, wasteful spending, unnecessary subscriptions
                    </div>
                  </div>
                </div>
              </Button>
            </div>

            {currentTransaction.category && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Original Category:</p>
                <Badge variant="secondary">{currentTransaction.category}</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
