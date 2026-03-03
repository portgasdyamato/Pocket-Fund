import "dotenv/config";
import { db } from "../server/db";
import { quests } from "../shared/schema";
import { eq } from "drizzle-orm";

async function checkAndSeed() {
  try {
    console.log("Checking DB connection...");
    const allQuests = await db.select().from(quests);
    console.log("Total current quests:", allQuests.length);
    
    console.log("Existing Titles:");
    allQuests.forEach(q => console.log(`- ${q.title} (${q.category})`));

    console.log("\nDeleting old literacy quests...");
    await db.delete(quests).where(eq(quests.category, "literacy"));
    console.log("Deleted old literacy quests.");

    const { seedLiteracyCourses } = await import("../server/seedCourses");
    console.log("Running seed function...");
    await seedLiteracyCourses();
    
    const finalQuests = await db.select().from(quests).where(eq(quests.category, "literacy"));
    console.log("\nFinal Literacy Quests in DB:", finalQuests.length);
    finalQuests.forEach(q => {
       const content = JSON.parse(q.content as string);
       console.log(`- ${q.title}: ${content.slides?.length} slides, ${content.quizzes?.length} quizzes`);
    });

    process.exit(0);
  } catch (err) {
    console.error("Critical error:", err);
    process.exit(1);
  }
}

checkAndSeed();
