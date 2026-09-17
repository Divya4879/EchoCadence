import 'dotenv/config'
import pool from '../db.js'
import { verifyToken } from '../auth.js'

const BUILTIN = [
  { name: 'Words & Meanings',  field1_label: 'Word',    field2_label: 'Meaning'  },
  { name: 'Synonyms',          field1_label: 'Word',    field2_label: 'Synonym'  },
  { name: 'Antonyms',          field1_label: 'Word',    field2_label: 'Antonym'  },
  { name: 'Phrases',           field1_label: 'Phrase',  field2_label: 'Meaning'  },
  { name: 'Slangs & Meanings', field1_label: 'Slang',   field2_label: 'Meaning'  },
  { name: 'Grammar Rules',     field1_label: 'Rule',    field2_label: 'Example'  },
]

export default async function handler(req, res) {
  try {
    const payload = await verifyToken(req)
    const userId = payload.sub

    if (req.method === 'GET') {
      const { rows } = await pool.query(
        'SELECT * FROM languages WHERE user_id = $1 ORDER BY created_at',
        [userId]
      )
      return res.status(200).json(rows)
    }

    if (req.method === 'POST') {
      const { name } = req.body
      const normalized = name.trim().toLowerCase()
      const display = normalized.charAt(0).toUpperCase() + normalized.slice(1)

      const { rows: existing } = await pool.query(
        'SELECT id FROM languages WHERE user_id = $1', [userId]
      )
      if (existing.length >= 7) return res.status(400).json({ error: 'Max 7 languages' })

      const { rows: dupe } = await pool.query(
        'SELECT id FROM languages WHERE user_id = $1 AND LOWER(name) = $2', [userId, normalized]
      )
      if (dupe.length) return res.status(400).json({ error: `You already have ${display} added` })

      const { rows } = await pool.query(
        'INSERT INTO languages (user_id, name) VALUES ($1, $2) RETURNING *',
        [userId, display]
      )
      const langId = rows[0].id

      // seed built-in categories
      for (let i = 0; i < BUILTIN.length; i++) {
        const b = BUILTIN[i]
        await pool.query(
          `INSERT INTO categories (language_id, name, field1_label, field2_label, is_custom, position)
           VALUES ($1, $2, $3, $4, false, $5)`,
          [langId, b.name, b.field1_label, b.field2_label, i]
        )
      }
      return res.status(201).json(rows[0])
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      await pool.query('DELETE FROM languages WHERE id = $1 AND user_id = $2', [id, userId])
      return res.status(200).json({ ok: true })
    }

    res.status(405).end()
  } catch (e) {
    console.error('languages error:', e.message, e.code, e.detail)
    res.status(401).json({ error: e.message })
  }
}
