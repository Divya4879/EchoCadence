import 'dotenv/config'
import pool from '../db.js'
import { verifyToken } from '../auth.js'

export default async function handler(req, res) {
  try {
    const payload = await verifyToken(req)
    const userId = payload.sub
    const { categoryId, id } = req.query

    if (req.method === 'GET') {
      const { rows } = await pool.query(
        'SELECT * FROM entries WHERE category_id = $1 ORDER BY created_at DESC',
        [categoryId]
      )
      return res.status(200).json(rows)
    }

    if (req.method === 'POST') {
      const { field1, field2 } = req.body
      const { rows } = await pool.query(
        'INSERT INTO entries (category_id, field1, field2) VALUES ($1, $2, $3) RETURNING *',
        [categoryId, field1, field2]
      )
      // create card for this user
      await pool.query(
        `INSERT INTO cards (entry_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [rows[0].id, userId]
      )
      return res.status(201).json(rows[0])
    }

    if (req.method === 'PUT') {
      const { field1, field2 } = req.body
      const { rows } = await pool.query(
        'UPDATE entries SET field1 = $1, field2 = $2 WHERE id = $3 RETURNING *',
        [field1, field2, id]
      )
      return res.status(200).json(rows[0])
    }

    if (req.method === 'DELETE') {
      await pool.query('DELETE FROM entries WHERE id = $1', [id])
      return res.status(200).json({ ok: true })
    }

    res.status(405).end()
  } catch (e) {
    res.status(401).json({ error: e.message })
  }
}
