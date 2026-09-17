import 'dotenv/config'
import pool from '../db.js'
import { verifyToken } from '../auth.js'

export default async function handler(req, res) {
  try {
    const payload = await verifyToken(req)
    const userId = payload.sub
    const { email, username } = req.body || {}

    if (username) {
      // check username taken by another user
      const { rows: taken } = await pool.query(
        'SELECT id FROM users WHERE username = $1 AND id != $2', [username, userId]
      )
      if (taken.length) return res.status(400).json({ error: 'Username already taken' })
    }

    await pool.query(
      `INSERT INTO users (id, email, username) VALUES ($1, $2, $3)
       ON CONFLICT (id) DO UPDATE SET
         email = EXCLUDED.email,
         username = COALESCE($3, users.username)`,
      [userId, email || '', username || null]
    )

    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId])
    res.status(200).json(rows[0])
  } catch (e) {
    console.error('sync error:', e.message, e.code)
    res.status(e.message === 'No token' ? 401 : 500).json({ error: e.message })
  }
}
