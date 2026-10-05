import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import api from './routes/api.js'
import { checkDatabase } from './config/db.js'

const app = express()
const port = process.env.PORT || 5000
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use('/api/contact', rateLimit({ windowMs: 15 * 60 * 1000, limit: 60, standardHeaders: true, legacyHeaders: false }))
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'kyk-api' }))
app.use('/api', api)
app.use((req, res) => res.status(404).json({ message: 'Route not found.' }))
app.use((error, req, res, next) => { console.error('[kyk-api]', error.message); res.status(500).json({ message: 'Something went wrong. Please try again.' }) })

app.listen(port, async () => { console.log(`[kyk-api] listening on http://localhost:${port}`); try { await checkDatabase(); console.log('[kyk-api] MySQL connected') } catch (error) { console.error('[kyk-api] MySQL unavailable:', error.message) } })
