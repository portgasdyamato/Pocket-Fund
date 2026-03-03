
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;

async function check() {
  if (!DATABASE_URL) {
    console.error("DATABASE_URL not set");
    return;
  }
  const client = neon(DATABASE_URL);
  const db = drizzle(client);
  
  const result = await db.execute(sql`SELECT count(*) FROM quests`);
  console.log("Total count:", result.rows[0].count);
  
  const categories = await db.execute(sql`SELECT category, count(*) FROM quests GROUP BY category`);
  categories.rows.forEach(row => {
    console.log(`Category: ${row.category}, Count: ${row.count}`);
  });
}

check().catch(console.error);
