import 'dotenv/config'
import pool from '../db.js'
import { verifyToken } from '../auth.js'

export default async function handler(req, res) {
  try {
    await verifyToken(req)
    const { languageId } = req.query

    if (req.method === 'GET') {
      const { rows } = await pool.query(
        'SELECT * FROM categories WHERE language_id = $1 ORDER BY position, id',
        [languageId]
      )
      return res.status(200).json(rows)
    }

    if (req.method === 'POST') {
      const { name, field1_label, field2_label } = req.body
      const { rows: customs } = await pool.query(
        'SELECT id FROM categories WHERE language_id = $1 AND is_custom = true',
        [languageId]
      )
      if (customs.length >= 3) return res.status(400).json({ error: 'Max 3 custom categories' })

      const { rows } = await pool.query(
        `INSERT INTO categories (language_id, name, field1_label, field2_label, is_custom)
         VALUES ($1, $2, $3, $4, true) RETURNING *`,
        [languageId, name, field1_label, field2_label]
      )
      return res.status(201).json(rows[0])
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      await pool.query('DELETE FROM categories WHERE id = $1 AND is_custom = true', [id])
      return res.status(200).json({ ok: true })
    }

    res.status(405).end()
  } catch (e) {
    res.status(401).json({ error: e.message })
  }
}
