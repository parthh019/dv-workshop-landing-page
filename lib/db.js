const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || process.env.VERCEL_POSTGRES_URL;

let pool = null;

if (DATABASE_URL) {
  pool = new Pool({ connectionString: DATABASE_URL });
}

async function insertRegistration(entry, ip = '', userAgent = '') {
  if (!pool) {
    throw new Error('Database not configured');
  }

  const text = `INSERT INTO registrations(id, full_name, email, phone, created_at, workshop_starts_at, ip, user_agent)
  VALUES($1,$2,$3,$4,$5,$6,$7,$8)`;
  const values = [
    entry.id,
    entry.fullName,
    entry.email,
    entry.phone,
    entry.createdAt,
    entry.workshopStartsAt,
    ip,
    userAgent
  ];

  await pool.query(text, values);
}

function isDbConfigured() {
  return Boolean(pool);
}

module.exports = { insertRegistration, isDbConfigured };
