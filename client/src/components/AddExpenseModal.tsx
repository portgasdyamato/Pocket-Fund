import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coffee, Car, ShoppingBag, Ticket, FileText, Tag, Zap } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertTransaction } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  { name: 'Food', icon: Coffee, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', shadow: 'shadow-orange-400/10' },
  { name: 'Transport', icon: Car, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', shadow: 'shadow-blue-400/10' },
  { name: 'Shopping', icon: ShoppingBag, color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-400/20', shadow: 'shadow-pink-400/10' },
  { name: 'Entertainment', icon: Ticket, color: 'text-[#64CEFB]', bg: 'bg-[#64CEFB]/10', border: 'border-[#64CEFB]/20', shadow: 'shadow-[#64CEFB]/10' },
  { name: 'Bills', icon: FileText, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', shadow: 'shadow-green-400/10' },
  { name: 'Other', icon: Tag, color: 'text-white/40', bg: 'bg-white/5', border: 'border-white/10', shadow: 'shadow-white/5' },
];

export default function AddExpenseModal({ open, onOpenChange }: AddExpenseModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const createExpenseMutation = useMutation({
    mutationFn: async (data: { amount: string; category: string; description: string; date: string }) => {
      return await apiRequest("/api/transactions", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions/untagged"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Transaction Added",
        description: "Your transaction has been recorded",
      });
      setAmount("");
      setCategory("");
      setDescription("");
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add expense. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && category && !createExpenseMutation.isPending) {
      const transactionData = {
        amount,
        category,
        description: description || `${category} expense`,
        date: new Date().toISOString(),
      };
      createExpenseMutation.mutate(transactionData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-black border-white/5 p-0 overflow-hidden rounded-[32px] shadow-[0_0_60px_rgba(0,0,0,0.5)]">
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 p-6 space-y-5">
          <DialogHeader className="pr-10">
            <div className="flex justify-between items-center w-full">
              <DialogTitle className="text-xl font-black tracking-tighter">New Entry</DialogTitle>
              <div className="flex flex-col items-end leading-none mr-2">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30">Vault</span>
                <span className="text-base font-black text-primary">₹{user?.walletBalance ? parseFloat(user.walletBalance.toString()).toLocaleString('en-IN') : '0'}</span>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Amount Input */}
            <div className="relative group">
              <div className="flex items-center justify-center gap-3 w-full bg-white/[0.03] rounded-2xl border border-white/5 p-4 focus-within:border-primary/30 transition-all">
                <span className="text-2xl font-black text-white/20 italic">₹</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent border-none text-4xl font-black h-12 text-center focus-visible:ring-0 placeholder:text-white/5 font-mono tracking-tighter w-full"
                  data-testid="input-amount"
                  autoFocus
                  disabled={createExpenseMutation.isPending}
                />
              </div>
            </div>

            {/* Compact Category Grid */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="w-3 h-3 text-primary" />
                <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Category</Label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.name;
                  return (
                    <motion.button
                      key={cat.name}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 overflow-hidden
                        ${isSelected 
                          ? `${cat.bg} ${cat.border} shadow-lg shadow-black/40` 
                          : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
                        }`}
                      onClick={() => setCategory(cat.name)}
                      disabled={createExpenseMutation.isPending}
                    >
                      <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-white' : cat.color}`} />
                      <span className={`text-[10px] font-black transition-colors ${isSelected ? 'text-white' : 'text-white/40'}`}>
                        {cat.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Compact Description Input */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="w-3 h-3 text-primary" />
                <Label htmlFor="description" className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Details</Label>
              </div>
              <Input
                id="description"
                placeholder="What was this for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white/5 border-white/10 h-11 px-4 text-xs font-bold rounded-xl focus:border-primary/50 transition-all"
                data-testid="input-description"
                disabled={createExpenseMutation.isPending}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 text-sm font-black bg-primary hover:bg-primary/90 text-white rounded-2xl premium-shadow click-scale transition-all"
              disabled={!amount || !category || createExpenseMutation.isPending}
              data-testid="button-submit-expense"
            >
              <div className="flex items-center gap-2">
                {createExpenseMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Confirm Transaction</span>
                  </>
                )}
              </div>
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
