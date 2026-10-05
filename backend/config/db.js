import mysql from 'mysql2/promise'

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: 'Z',
})

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params)
  return rows
}

export async function checkDatabase() {
  await pool.query('SELECT 1')
}

export function handleDatabaseError(error) {
  console.error('[kyk-api] Database error:', error.message)
  return new Error('A database operation failed.')
}
