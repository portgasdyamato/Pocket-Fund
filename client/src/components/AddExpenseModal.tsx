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
  { name: 'Entertainment', icon: Ticket, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20', shadow: 'shadow-purple-400/10' },
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
      <DialogContent className="sm:max-w-xl bg-black border-white/5 p-0 overflow-hidden rounded-[40px] shadow-[0_0_80px_rgba(0,0,0,0.5)]">
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 space-y-8 sm:space-y-10 max-h-[85vh] overflow-y-auto">
          <DialogHeader className="mb-4 sm:mb-8">
            <div className="flex justify-between items-center w-full">
              <DialogTitle className="text-2xl sm:text-4xl font-black tracking-tighter">Add Entry</DialogTitle>
              <div className="flex flex-col items-end">
                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Vault</span>
                <span className="text-lg sm:text-xl font-black text-primary">₹{user?.walletBalance ? parseFloat(user.walletBalance.toString()).toLocaleString('en-IN') : '0'}</span>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Large Amount Input Section */}
            <div className="space-y-4">
              <div className="relative flex flex-col items-center">
                <div className="flex items-center justify-center gap-4 w-full">
                  <span className="text-4xl sm:text-6xl font-black text-white/20 italic">₹</span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-transparent border-none text-5xl sm:text-7xl font-black h-20 sm:h-28 text-center focus-visible:ring-0 placeholder:text-white/5 font-mono tracking-tighter w-full"
                    data-testid="input-amount"
                    autoFocus
                    disabled={createExpenseMutation.isPending}
                  />
                </div>
                <div className="h-0.5 w-[80%] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30 rounded-full mx-auto" />
              </div>
            </div>

            {/* Premium Category Grid */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" />
                <Label className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Select Category</Label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.name;
                  return (
                    <motion.button
                      key={cat.name}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative flex flex-col items-start p-5 rounded-3xl border transition-all duration-500 text-left overflow-hidden group
                        ${isSelected 
                          ? `${cat.bg} ${cat.border} ${cat.shadow} shadow-2xl` 
                          : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'
                        }`}
                      onClick={() => setCategory(cat.name)}
                      disabled={createExpenseMutation.isPending}
                    >
                      {/* Selection Glow */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute top-0 right-0 w-12 h-12 bg-white/20 blur-2xl rounded-full -mr-6 -mt-6"
                          />
                        )}
                      </AnimatePresence>

                      <div className={`p-3 rounded-2xl mb-4 transition-all duration-500 ${isSelected ? 'bg-white text-black' : `${cat.bg} ${cat.color}`}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-sm font-black transition-colors ${isSelected ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                        {cat.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <FileText className="w-4 h-4 text-primary" />
                <Label htmlFor="description" className="text-xs font-black uppercase tracking-[0.2em] text-white/40">Description</Label>
              </div>
              <Input
                id="description"
                placeholder="What was this entry for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white/5 border-white/10 h-16 px-6 text-lg font-bold rounded-2xl focus:border-primary/50 transition-all"
                data-testid="input-description"
                disabled={createExpenseMutation.isPending}
              />
            </div>

            <div className="pt-6 pb-4">
              <Button
                type="submit"
                className="w-full h-16 sm:h-20 text-lg sm:text-xl font-black bg-primary hover:bg-primary/90 text-white rounded-[24px] premium-shadow click-scale transition-all"
                disabled={!amount || !category || createExpenseMutation.isPending}
                data-testid="button-submit-expense"
              >
                <div className="flex items-center gap-3">
                  {createExpenseMutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Processing Entry...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-6 h-6 fill-white" />
                      <span>Confirm Transaction</span>
                    </>
                  )}
                </div>
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
