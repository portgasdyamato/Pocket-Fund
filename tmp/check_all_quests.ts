import "dotenv/config";
import { db } from "../server/db";
import { quests } from "../shared/schema";

async function checkAll() {
  const all = await db.select().from(quests);
  console.log("ALL QUESTS IN DB:");
  all.forEach(q => console.log(`- [${q.category}] "${q.title}" (ID: ${q.id})`));
  process.exit(0);
}
checkAll();
