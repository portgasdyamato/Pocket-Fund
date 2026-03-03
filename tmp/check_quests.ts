import { db } from "../server/db";
import { quests } from "../shared/schema";

async function checkQuests() {
  const allQuests = await db.select().from(quests);
  console.log("Total Quests:", allQuests.length);
  allQuests.forEach(q => {
    console.log(`- [${q.category}] ${q.title} (ID: ${q.id})`);
    const content = JSON.parse(q.content as string);
    console.log(`  Slides: ${content.slides?.length || 0}, Quizzes: ${content.quizzes?.length || 0}`);
  });
  process.exit(0);
}

checkQuests();
