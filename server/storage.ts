import {
  users,
  goals,
  transactions,
  badges,
  userBadges,
  quests,
  userQuests,
  streaks,
  stashTransactions,
  type User,
  type UpsertUser,
  type Goal,
  type InsertGoal,
  type Transaction,
  type InsertTransaction,
  type Badge,
  type UserBadge,
  type Quest,
  type UserQuest,
  type Streak,
  type StashTransaction,
  type InsertStashTransaction,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, isNull, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (Replit Auth compatible)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserOnboarding(id: string, status: string): Promise<void>;
  updateUserProfile(id: string, data: { firstName?: string | null; lastName?: string | null; profileImageUrl?: string | null }): Promise<User>;
  
  // Goal operations
  createGoal(goal: InsertGoal): Promise<Goal>;
  getGoals(userId: string): Promise<Goal[]>;
  getMainGoal(userId: string): Promise<Goal | undefined>;
  updateGoalProgress(id: string, amount: string): Promise<void>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactions(userId: string, limit?: number): Promise<Transaction[]>;
  getUntaggedTransactions(userId: string): Promise<Transaction[]>;
  updateTransactionTag(id: string, tag: string): Promise<void>;
  deleteTransaction(id: string, userId: string): Promise<void>;
  
  // Badge operations
  getBadges(): Promise<Badge[]>;
  getUserBadges(userId: string): Promise<UserBadge[]>;
  awardBadge(userId: string, badgeId: string): Promise<void>;
  
  // Quest operations
  getQuests(): Promise<Quest[]>;
  getUserQuests(userId: string): Promise<UserQuest[]>;
  getActiveQuests(userId: string): Promise<UserQuest[]>;
  completeQuest(userId: string, questId: string): Promise<void>;
  joinQuest(userId: string, questId: string): Promise<void>;
  
  // Streak operations
  getStreak(userId: string): Promise<Streak | undefined>;
  updateStreak(userId: string, type: 'save' | 'fight'): Promise<void>;
  
  // Stash operations
  createStashTransaction(stash: InsertStashTransaction): Promise<StashTransaction>;
  getStashTransactions(userId: string): Promise<StashTransaction[]>;
  getTotalStashed(userId: string): Promise<number>;
  updateWalletBalance(userId: string, amount: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserOnboarding(id: string, status: string): Promise<void> {
    await db.update(users).set({ onboardingStatus: status }).where(eq(users.id, id));
  }

  async updateUserProfile(id: string, data: { firstName?: string | null; lastName?: string | null; profileImageUrl?: string | null }): Promise<User> {
    const updateFields: any = {
      updatedAt: new Date(),
    };
    
    // Only include fields that are explicitly provided (not undefined)
    if (data.firstName !== undefined) updateFields.firstName = data.firstName;
    if (data.lastName !== undefined) updateFields.lastName = data.lastName;
    if (data.profileImageUrl !== undefined) updateFields.profileImageUrl = data.profileImageUrl;
    
    const [updated] = await db
      .update(users)
      .set(updateFields)
      .where(eq(users.id, id))
      .returning();
    if (!updated) throw new Error("User not found");
    return updated;
  }

  // Goal operations
  async createGoal(goal: InsertGoal): Promise<Goal> {
    const [newGoal] = await db.insert(goals).values(goal).returning();
    return newGoal;
  }

  async getGoals(userId: string): Promise<Goal[]> {
    return await db.select().from(goals).where(eq(goals.userId, userId));
  }

  async getMainGoal(userId: string): Promise<Goal | undefined> {
    const [goal] = await db
      .select()
      .from(goals)
      .where(and(eq(goals.userId, userId), eq(goals.isMain, true)));
    return goal;
  }

  async updateGoalProgress(id: string, amount: string): Promise<void> {
    await db.update(goals).set({ currentAmount: amount }).where(eq(goals.id, id));
  }

  // Transaction operations
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions).values(transaction).returning();
    return newTransaction;
  }

  async getTransactions(userId: string, limit = 10): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.date))
      .limit(limit);
  }

  async getUntaggedTransactions(userId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(and(eq(transactions.userId, userId), isNull(transactions.tag)))
      .orderBy(desc(transactions.date));
  }

  async updateTransactionTag(id: string, tag: string): Promise<void> {
    await db.update(transactions).set({ tag }).where(eq(transactions.id, id));
  }

  async deleteTransaction(id: string, userId: string): Promise<void> {
    await db.delete(transactions).where(and(eq(transactions.id, id), eq(transactions.userId, userId)));
  }

  // Badge operations
  async getBadges(): Promise<Badge[]> {
    return await db.select().from(badges);
  }

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    return await db.select().from(userBadges).where(eq(userBadges.userId, userId));
  }

  async awardBadge(userId: string, badgeId: string): Promise<void> {
    await db.insert(userBadges).values({ userId, badgeId });
  }

  // Quest operations
  async getQuests(): Promise<Quest[]> {
    return await db.select().from(quests);
  }

  async getUserQuests(userId: string): Promise<UserQuest[]> {
    return await db.select().from(userQuests).where(eq(userQuests.userId, userId));
  }

  async getActiveQuests(userId: string): Promise<UserQuest[]> {
    return await db
      .select()
      .from(userQuests)
      .where(and(eq(userQuests.userId, userId), eq(userQuests.completed, false)));
  }

  async completeQuest(userId: string, questId: string): Promise<void> {
    const [existing] = await db
      .select()
      .from(userQuests)
      .where(and(eq(userQuests.userId, userId), eq(userQuests.questId, questId)));

    if (existing) {
      await db
        .update(userQuests)
        .set({ completed: true, completedAt: new Date() })
        .where(eq(userQuests.id, existing.id));
    } else {
      await db.insert(userQuests).values({
        userId,
        questId,
        completed: true,
        completedAt: new Date(),
      });
    }
  }

  async joinQuest(userId: string, questId: string): Promise<void> {
    const [existing] = await db
      .select()
      .from(userQuests)
      .where(and(eq(userQuests.userId, userId), eq(userQuests.questId, questId)));

    if (!existing) {
      await db.insert(userQuests).values({
        userId,
        questId,
        completed: false, // Not completed yet
        completedAt: null,
      });
    }
  }

  // Streak operations
  async getStreak(userId: string): Promise<Streak | undefined> {
    const [streak] = await db.select().from(streaks).where(eq(streaks.userId, userId));
    return streak;
  }

  async updateStreak(userId: string, type: 'save' | 'fight'): Promise<void> {
    const existingStreak = await this.getStreak(userId);
    
    if (!existingStreak) {
      await db.insert(streaks).values({
        userId,
        saveStreak: type === 'save' ? 1 : 0,
        fightStreak: type === 'fight' ? 1 : 0,
        lastSaveDate: type === 'save' ? new Date() : null,
        lastFightDate: type === 'fight' ? new Date() : null,
      });
    } else {
      const updates: any = {};
      if (type === 'save') {
        updates.saveStreak = existingStreak.saveStreak + 1;
        updates.lastSaveDate = new Date();
      } else {
        updates.fightStreak = existingStreak.fightStreak + 1;
        updates.lastFightDate = new Date();
      }
      await db.update(streaks).set(updates).where(eq(streaks.userId, userId));
    }
  }

  // Stash operations
  async createStashTransaction(stash: InsertStashTransaction): Promise<StashTransaction> {
    const [newStash] = await db.insert(stashTransactions).values(stash).returning();
    return newStash;
  }

  async getStashTransactions(userId: string): Promise<StashTransaction[]> {
    return await db
      .select()
      .from(stashTransactions)
      .where(eq(stashTransactions.userId, userId))
      .orderBy(desc(stashTransactions.createdAt));
  }

  async getTotalStashed(userId: string): Promise<number> {
    const transactions = await this.getStashTransactions(userId);
    return transactions.reduce((total, t) => {
      const amount = parseFloat(t.amount);
      return t.type === 'stash' ? total + amount : total - amount;
    }, 0);
  }

  async updateWalletBalance(userId: string, amount: number): Promise<void> {
    await db
      .update(users)
      .set({ 
        walletBalance: sql`${users.walletBalance} + ${amount}`
      })
      .where(eq(users.id, userId));
  }
}

export const storage = new DatabaseStorage();
