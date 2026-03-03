import { db } from "../server/db";
import { quests, userQuests } from "../shared/schema";
// @ts-ignore
import { seedLiteracyCourses } from "../server/seedCourses";

async function forceSync() {
  console.log("🚀 Starting Force Sync of 6+ Courses...");
  try {
    // 1. Clear everything that might block
    console.log("🧹 Clearing user progress to avoid foreign key issues...");
    await db.delete(userQuests);
    
    console.log("🧹 Clearing all quests...");
    await db.delete(quests);
    
    // 2. Run the detailed seed
    console.log("🌱 Running detailed seed from seedCourses.ts...");
    await seedLiteracyCourses();
    
    // 3. Verification
    const count = await db.select().from(quests);
    console.log(`✅ Success! Total Quests in DB: ${count.length}`);
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Force sync failed:", err);
    process.exit(1);
  }
}

forceSync();
