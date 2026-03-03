const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function check() {
  const res = await pool.query('SELECT id, first_name, vault_pin, vault_pin_updated_at FROM users');
  console.log(JSON.stringify(res.rows, null, 2));
  await pool.end();
}

check().catch(console.error);
