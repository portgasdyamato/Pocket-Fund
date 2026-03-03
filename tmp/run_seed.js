
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, varchar, text, integer, decimal, boolean, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;

// Re-define tables locally for the script
const questsTable = pgTable("quests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(),
  points: integer("points").notNull(),
  content: text("content").notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull().default("challenge"),
});

const userQuestsTable = pgTable("user_quests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  questId: varchar("quest_id").notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
});

async function runSeed() {
  if (!DATABASE_URL) {
    console.error("DATABASE_URL not set");
    return;
  }
  const client = neon(DATABASE_URL);
  const db = drizzle(client);
  
  console.log("Loading seed data...");
  const seed = await import('../server/seedCourses.js');
  
  const CHALLENGE_QUESTS = seed.CHALLENGE_QUESTS;
  const ALL_COURSES = [
    ...seed.EASY_SHORT_COURSES, 
    ...seed.MEDIUM_COURSES, 
    ...seed.HARD_LONG_COURSES
  ];

  console.log(`Preparing to seed ${CHALLENGE_QUESTS.length} challenges and ${ALL_COURSES.length} courses...`);

  try {
    console.log("Clearing existing quests...");
    await db.delete(userQuestsTable);
    await db.delete(questsTable);
    
    console.log("Inserting challenges...");
    // Chunking to be safe
    for (const c of CHALLENGE_QUESTS) {
        await db.insert(questsTable).values(c);
        console.log(`  Inserted challenge: ${c.title}`);
    }

    console.log("Inserting courses...");
    for (const c of ALL_COURSES) {
        await db.insert(questsTable).values(c);
        console.log(`  Inserted course: ${c.title}`);
    }

    console.log("Seed successful!");
  } catch (err) {
    console.error("Seed failed:", err);
  }
}

runSeed().catch(console.error);
