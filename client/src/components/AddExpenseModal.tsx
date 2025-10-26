import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coffee, Car, ShoppingBag, Ticket, FileText, Tag } from "lucide-react";

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd?: (expense: { amount: number; category: string; description: string }) => void;
}

const categories = [
  { name: 'Food', icon: Coffee, color: 'bg-chart-1/10 text-chart-1 border-chart-1/20' },
  { name: 'Transport', icon: Car, color: 'bg-chart-2/10 text-chart-2 border-chart-2/20' },
  { name: 'Shopping', icon: ShoppingBag, color: 'bg-chart-3/10 text-chart-3 border-chart-3/20' },
  { name: 'Entertainment', icon: Ticket, color: 'bg-chart-4/10 text-chart-4 border-chart-4/20' },
  { name: 'Bills', icon: FileText, color: 'bg-chart-5/10 text-chart-5 border-chart-5/20' },
  { name: 'Other', icon: Tag, color: 'bg-muted/50 text-muted-foreground border-border' },
];

export default function AddExpenseModal({ open, onOpenChange, onAdd }: AddExpenseModalProps) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && category) {
      onAdd?.({
        amount: parseFloat(amount),
        category,
        description: description || `${category} expense`
      });
      setAmount("");
      setCategory("");
      setDescription("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md backdrop-blur-2xl bg-card/80 border-primary/30 shadow-[0_0_40px_rgba(139,92,246,0.3)]" data-testid="modal-add-expense">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Log Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="amount" className="text-base font-semibold mb-2 block">Amount</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 text-3xl font-bold h-16 font-mono"
                data-testid="input-amount"
                autoFocus
              />
            </div>
          </div>

          <div>
            <Label className="text-base font-semibold mb-3 block">Category</Label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Button
                    key={cat.name}
                    type="button"
                    variant="outline"
                    className={`h-auto flex-col gap-2 p-3 ${category === cat.name ? cat.color : ''}`}
                    onClick={() => setCategory(cat.name)}
                    data-testid={`button-category-${cat.name.toLowerCase()}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-semibold">{cat.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-base font-semibold mb-2 block">
              Description (optional)
            </Label>
            <Input
              id="description"
              placeholder="What did you buy?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-testid="input-description"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-bold"
            disabled={!amount || !category}
            data-testid="button-submit-expense"
          >
            Add Expense
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
