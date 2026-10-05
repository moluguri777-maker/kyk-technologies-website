import jwt from 'jsonwebtoken'
import { query } from '../config/db.js'

export async function authenticateToken(req, res, next) {
  try {
    const token = req.cookies?.kyk_token || req.headers.authorization?.replace('Bearer ', '')
    if (!token) return res.status(401).json({ message: 'Authentication required.' })
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const users = await query('SELECT id, name, email, phone, role, is_active FROM users WHERE id = ? LIMIT 1', [payload.id])
    if (!users[0] || !users[0].is_active) return res.status(401).json({ message: 'Account is inactive or unavailable.' })
    req.user = users[0]
    next()
  } catch { return res.status(401).json({ message: 'Invalid or expired authentication.' }) }
}

export const requireRole = (...roles) => (req, res, next) => roles.includes(req.user?.role) ? next() : res.status(403).json({ message: 'You do not have permission to perform this action.' })
export const requireAdmin = requireRole('admin')
export const requireEmployee = requireRole('employee')
export const requireCandidate = requireRole('candidate')
