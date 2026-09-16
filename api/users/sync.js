import 'dotenv/config'
import pool from '../db.js'
import { verifyToken } from '../auth.js'

export default async function handler(req, res) {
  try {
    const payload = await verifyToken(req)
    const userId = payload.sub
    const { email } = req.body || {}
    await pool.query(
      `INSERT INTO users (id, email) VALUES ($1, $2)
       ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email`,
      [userId, email || '']
    )
    res.status(200).json({ ok: true })
  } catch (e) {
    console.error('sync error:', e.message, e.code, e.detail)
    res.status(e.message === 'No token' ? 401 : 500).json({ error: e.message })
  }
}
