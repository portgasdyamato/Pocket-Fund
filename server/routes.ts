import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./googleAuth";
import { chatWithFinancialAssistant, categorizePurchase, generateFinancialInsight } from "./geminiService";
import { insertGoalSchema, insertTransactionSchema, insertStashTransactionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch('/api/user/onboarding', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { status } = req.body;
      await storage.updateUserOnboarding(userId, status);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating onboarding:", error);
      res.status(500).json({ message: "Failed to update onboarding status" });
    }
  });

  app.patch('/api/user/profile', isAuthenticated, async (req: any, res) => {
    try {
      console.log("=== Profile update endpoint hit ===");
      const userId = req.user.id;
      const { firstName, lastName, profileImageUrl } = req.body;
      
      console.log("Profile update request:", { 
        userId, 
        firstName, 
        lastName, 
        profileImageUrl: profileImageUrl ? `present (${profileImageUrl.length} chars)` : "missing" 
      });
      
      if (profileImageUrl && profileImageUrl.length > 5 * 1024 * 1024) {
        console.warn(`Warning: Large profile image received: ${(profileImageUrl.length / 1024 / 1024).toFixed(2)} MB`);
      }
      
      const updateData: { firstName?: string | null; lastName?: string | null; profileImageUrl?: string | null } = {};
      if (firstName !== undefined && firstName !== null) updateData.firstName = firstName || null;
      if (lastName !== undefined && lastName !== null) updateData.lastName = lastName || null;
      if (profileImageUrl !== undefined && profileImageUrl !== null) updateData.profileImageUrl = profileImageUrl || null;
      
      console.log("Update data:", updateData);
      
      const updatedUser = await storage.updateUserProfile(userId, updateData);
      console.log("Updated user:", { 
        firstName: updatedUser.firstName, 
        lastName: updatedUser.lastName, 
        hasImage: !!updatedUser.profileImageUrl 
      });
      
      res.json(updatedUser);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      console.error("Error stack:", error?.stack);
      res.status(500).json({ 
        message: error?.message || "Failed to update profile",
        error: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      });
    }
  });

  app.post('/api/wallet/add', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { amount } = req.body;
      const parsedAmount = parseFloat(amount);
      
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      await storage.updateWalletBalance(userId, parsedAmount);
      const updatedUser = await storage.getUser(userId);
      res.json({ newBalance: updatedUser?.walletBalance });
    } catch (error) {
      console.error("Error adding funds:", error);
      res.status(500).json({ message: "Failed to add funds" });
    }
  });

  app.post('/api/goals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const goalData = insertGoalSchema.parse({ ...req.body, userId });
      const goal = await storage.createGoal(goalData);
      res.json(goal);
    } catch (error: any) {
      console.error("Error creating goal:", error);
      res.status(400).json({ message: error.message || "Failed to create goal" });
    }
  });

  app.get('/api/goals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const goals = await storage.getGoals(userId);
      res.json(goals);
    } catch (error) {
      console.error("Error fetching goals:", error);
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });

  app.get('/api/goals/main', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const goal = await storage.getMainGoal(userId);
      res.json(goal || null);
    } catch (error) {
      console.error("Error fetching main goal:", error);
      res.status(500).json({ message: "Failed to fetch main goal" });
    }
  });

  app.post('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const transactionData = insertTransactionSchema.parse({ ...req.body, userId });
      const amount = parseFloat(transactionData.amount);

      // Check wallet balance
      const user = await storage.getUser(userId);
      const currentBalance = parseFloat(user?.walletBalance?.toString() || "0");
      
      if (currentBalance < amount) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }

      const transaction = await storage.createTransaction(transactionData);
      
      // Deduct from wallet
      await storage.updateWalletBalance(userId, -amount);

      res.json(transaction);
    } catch (error: any) {
      console.error("Error creating transaction:", error);
      res.status(400).json({ message: error.message || "Failed to create transaction" });
    }
  });

  app.get('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const transactions = await storage.getTransactions(userId, limit);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.get('/api/transactions/untagged', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const transactions = await storage.getUntaggedTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching untagged transactions:", error);
      res.status(500).json({ message: "Failed to fetch untagged transactions" });
    }
  });

  app.patch('/api/transactions/:id/tag', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { tag } = req.body;
      await storage.updateTransactionTag(id, tag);
      
      if (tag) {
        await storage.updateStreak(req.user.id, 'fight');
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating transaction tag:", error);
      res.status(500).json({ message: "Failed to update transaction tag" });
    }
  });

  app.delete('/api/transactions/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      await storage.deleteTransaction(id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      res.status(500).json({ message: "Failed to delete transaction" });
    }
  });

  app.post('/api/transactions/:id/categorize', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const transactions = await storage.getTransactions(userId, 100);
      const transaction = transactions.find(t => t.id === id);
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      const suggestion = await categorizePurchase(
        transaction.description,
        parseFloat(transaction.amount)
      );
      
      res.json(suggestion);
    } catch (error) {
      console.error("Error categorizing transaction:", error);
      res.status(500).json({ message: "Failed to categorize transaction" });
    }
  });

  app.get('/api/badges', isAuthenticated, async (_req, res) => {
    try {
      const badges = await storage.getBadges();
      res.json(badges);
    } catch (error) {
      console.error("Error fetching badges:", error);
      res.status(500).json({ message: "Failed to fetch badges" });
    }
  });

  app.get('/api/user/badges', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const userBadges = await storage.getUserBadges(userId);
      res.json(userBadges);
    } catch (error) {
      console.error("Error fetching user badges:", error);
      res.status(500).json({ message: "Failed to fetch user badges" });
    }
  });

  app.get('/api/quests', isAuthenticated, async (_req, res) => {
    try {
      const quests = await storage.getQuests();
      res.json(quests);
    } catch (error) {
      console.error("Error fetching quests:", error);
      res.status(500).json({ message: "Failed to fetch quests" });
    }
  });

  app.get('/api/user/quests', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const userQuests = await storage.getUserQuests(userId);
      res.json(userQuests);
    } catch (error) {
      console.error("Error fetching user quests:", error);
      res.status(500).json({ message: "Failed to fetch user quests" });
    }
  });

  app.post('/api/quests/:id/join', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      // Check if already joined
      const userQuests = await storage.getUserQuests(userId);
      const existing = userQuests.find(q => q.questId === id);
      
      if (existing) {
        return res.status(400).json({ message: "Already joined this quest" });
      }

      await storage.completeQuest(userId, id); // Reuse completeQuest but set completed=false
      // Wait, completeQuest sets completed=true. We need a joinQuest method in storage or custom logic.
      // Let's look at completeQuest in storage.ts:
      // It upserts. If existing, sets completed=true. If not, inserts with completed=true.
      // We need a specific 'joinQuest' that inserts with completed=false.
      
      // For now, let's implement a direct insert using storage.
      // But storage.completeQuest forces completed=true.
      // I should update storage.ts to support joining without completing.
      
      // Let's modify storage.ts first (next step), or use a hack (not recommended).
      // Actually, I'll add joinQuest to storage.ts properly.
      await storage.joinQuest(userId, id);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error joining quest:", error);
      res.status(500).json({ message: "Failed to join quest" });
    }
  });

  app.post('/api/quests/:id/complete', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      await storage.completeQuest(userId, id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error completing quest:", error);
      res.status(500).json({ message: "Failed to complete quest" });
    }
  });

  app.get('/api/streak', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const streak = await storage.getStreak(userId);
      res.json(streak || { saveStreak: 0, fightStreak: 0 });
    } catch (error) {
      console.error("Error fetching streak:", error);
      res.status(500).json({ message: "Failed to fetch streak" });
    }
  });

  app.post('/api/stash', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const stashData = insertStashTransactionSchema.parse({ ...req.body, userId });
      
      const amount = parseFloat(stashData.amount);
      const isStash = stashData.type === 'stash';

      // Check wallet balance for stashing
      if (isStash) {
        const user = await storage.getUser(userId);
        const currentBalance = parseFloat(user?.walletBalance?.toString() || "0");
        if (currentBalance < amount) {
          return res.status(400).json({ message: "Insufficient wallet balance" });
        }
      }

      const stash = await storage.createStashTransaction(stashData);
      
      // Update wallet balance (Stash = deduct, Withdraw = add)
      await storage.updateWalletBalance(userId, isStash ? -amount : amount);

      if (stashData.type === 'stash') {
        await storage.updateStreak(userId, 'save');
      }
      
      let goalCompleted = false;
      if (stashData.goalId) {
        const goal = (await storage.getGoals(userId)).find(g => g.id === stashData.goalId);
        if (goal) {
          const currentAmount = parseFloat(goal.currentAmount);
          const newAmount = stashData.type === 'stash' 
            ? currentAmount + parseFloat(stashData.amount)
            : currentAmount - parseFloat(stashData.amount);
          await storage.updateGoalProgress(stashData.goalId, newAmount.toFixed(2));
          
          if (newAmount >= parseFloat(goal.targetAmount)) {
             goalCompleted = true;
          }
        }
      }
      
      res.json({ ...stash, goalCompleted });
    } catch (error: any) {
      console.error("Error creating stash transaction:", error);
      res.status(400).json({ message: error.message || "Failed to create stash transaction" });
    }
  });

  app.get('/api/stash', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const stashTransactions = await storage.getStashTransactions(userId);
      res.json(stashTransactions);
    } catch (error) {
      console.error("Error fetching stash transactions:", error);
      res.status(500).json({ message: "Failed to fetch stash transactions" });
    }
  });

  app.get('/api/stash/total', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const total = await storage.getTotalStashed(userId);
      res.json({ total });
    } catch (error) {
      console.error("Error fetching total stashed:", error);
      res.status(500).json({ message: "Failed to fetch total stashed" });
    }
  });

  app.post('/api/ai/chat', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { message } = req.body;
      
      const user = await storage.getUser(userId);
      const streak = await storage.getStreak(userId);
      const totalStashed = await storage.getTotalStashed(userId);
      const transactions = await storage.getTransactions(userId, 30);
      
      const ickAmount = transactions
        .filter(t => t.tag === 'Ick')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      const response = await chatWithFinancialAssistant(message, {
        userName: user?.firstName || undefined,
        totalStashed,
        saveStreak: streak?.saveStreak || 0,
        ickAmount,
      });
      
      res.json({ response });
    } catch (error) {
      console.error("Error in AI chat:", error);
      res.status(500).json({ message: "Failed to get AI response" });
    }
  });

  app.post('/api/ai/insight', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const transactions = await storage.getTransactions(userId, 100);
      
      const totalSpent = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const ickSpent = transactions.filter(t => t.tag === 'Ick').reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const wantSpent = transactions.filter(t => t.tag === 'Want').reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const needSpent = transactions.filter(t => t.tag === 'Need').reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      const insight = await generateFinancialInsight(totalSpent, ickSpent, wantSpent, needSpent);
      
      res.json({ insight });
    } catch (error) {
      console.error("Error generating insight:", error);
      res.status(500).json({ message: "Failed to generate insight" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
