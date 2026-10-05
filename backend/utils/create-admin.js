import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { query, pool } from '../config/db.js'

const args = Object.fromEntries(process.argv.slice(2).reduce((all, value, index, values) => value.startsWith('--') ? [...all, [value.slice(2), values[index + 1]]] : all, []))
if (!args.name || !args.email || !args.password) { console.error('Usage: pnpm create-admin --name "KYK Admin" --email admin@example.com --password "strong-password"'); process.exit(1) }
const passwordHash = await bcrypt.hash(args.password, 12)
await query('INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,\'admin\')', [args.name, args.email.toLowerCase(), passwordHash])
console.log(`Admin created for ${args.email}`)
await pool.end()
