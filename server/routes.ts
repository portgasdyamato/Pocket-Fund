import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { chatWithFinancialAssistant, categorizePurchase, generateFinancialInsight } from "./geminiService";
import { insertGoalSchema, insertTransactionSchema, insertStashTransactionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch('/api/user/onboarding', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { status } = req.body;
      await storage.updateUserOnboarding(userId, status);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating onboarding:", error);
      res.status(500).json({ message: "Failed to update onboarding status" });
    }
  });

  app.post('/api/goals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      const goals = await storage.getGoals(userId);
      res.json(goals);
    } catch (error) {
      console.error("Error fetching goals:", error);
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });

  app.get('/api/goals/main', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const goal = await storage.getMainGoal(userId);
      res.json(goal || null);
    } catch (error) {
      console.error("Error fetching main goal:", error);
      res.status(500).json({ message: "Failed to fetch main goal" });
    }
  });

  app.post('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactionData = insertTransactionSchema.parse({ ...req.body, userId });
      const transaction = await storage.createTransaction(transactionData);
      res.json(transaction);
    } catch (error: any) {
      console.error("Error creating transaction:", error);
      res.status(400).json({ message: error.message || "Failed to create transaction" });
    }
  });

  app.get('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
        await storage.updateStreak(req.user.claims.sub, 'fight');
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating transaction tag:", error);
      res.status(500).json({ message: "Failed to update transaction tag" });
    }
  });

  app.delete('/api/transactions/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      const userQuests = await storage.getUserQuests(userId);
      res.json(userQuests);
    } catch (error) {
      console.error("Error fetching user quests:", error);
      res.status(500).json({ message: "Failed to fetch user quests" });
    }
  });

  app.post('/api/quests/:id/complete', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      const streak = await storage.getStreak(userId);
      res.json(streak || { saveStreak: 0, fightStreak: 0 });
    } catch (error) {
      console.error("Error fetching streak:", error);
      res.status(500).json({ message: "Failed to fetch streak" });
    }
  });

  app.post('/api/stash', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stashData = insertStashTransactionSchema.parse({ ...req.body, userId });
      const stash = await storage.createStashTransaction(stashData);
      
      if (stashData.type === 'stash') {
        await storage.updateStreak(userId, 'save');
      }
      
      if (stashData.goalId) {
        const goal = (await storage.getGoals(userId)).find(g => g.id === stashData.goalId);
        if (goal) {
          const currentAmount = parseFloat(goal.currentAmount);
          const newAmount = stashData.type === 'stash' 
            ? currentAmount + parseFloat(stashData.amount)
            : currentAmount - parseFloat(stashData.amount);
          await storage.updateGoalProgress(stashData.goalId, newAmount.toFixed(2));
        }
      }
      
      res.json(stash);
    } catch (error: any) {
      console.error("Error creating stash transaction:", error);
      res.status(400).json({ message: error.message || "Failed to create stash transaction" });
    }
  });

  app.get('/api/stash', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stashTransactions = await storage.getStashTransactions(userId);
      res.json(stashTransactions);
    } catch (error) {
      console.error("Error fetching stash transactions:", error);
      res.status(500).json({ message: "Failed to fetch stash transactions" });
    }
  });

  app.get('/api/stash/total', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const total = await storage.getTotalStashed(userId);
      res.json({ total });
    } catch (error) {
      console.error("Error fetching total stashed:", error);
      res.status(500).json({ message: "Failed to fetch total stashed" });
    }
  });

  app.post('/api/ai/chat', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
