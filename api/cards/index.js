import 'dotenv/config'
import pool from '../db.js'
import { verifyToken } from '../auth.js'

function sm2(easeFactor, intervalDays, rating) {
  const q = rating === 'easy' ? 5 : rating === 'medium' ? 3 : 1
  const newEase = Math.max(1.3, easeFactor + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const newInterval = q < 3 ? 1 : intervalDays <= 1 ? 6 : Math.round(intervalDays * newEase)
  return { easeFactor: newEase, intervalDays: newInterval }
}

export default async function handler(req, res) {
  try {
    const payload = await verifyToken(req)
    const userId = payload.sub

    if (req.method === 'GET') {
      const { languageId, limit = 200, all, mode } = req.query

      let modeFilter = ''
      if (all === 'true') modeFilter = ''
      else if (mode === 'learn') modeFilter = 'AND c.difficulty IS NULL'
      else if (mode === 'revise') modeFilter = 'AND c.difficulty IS NOT NULL AND cs.next_review <= NOW()'
      else modeFilter = 'AND (cs.next_review IS NULL OR cs.next_review <= NOW())'

      const { rows } = await pool.query(`
        SELECT c.id, c.difficulty, c.difficulty_set_at,
               e.field1, e.field2,
               cat.name AS category_name, cat.field1_label, cat.field2_label,
               cs.next_review, cs.interval_days, cs.ease_factor, cs.review_count,
               (SELECT COUNT(*) FROM card_attempts ca
                WHERE ca.card_id = c.id AND ca.user_id = $1 AND ca.correct = true AND ca.attempt_number = 1
               ) AS first_attempt_correct,
               (SELECT MIN(ca.solved_at) FROM card_attempts ca
                WHERE ca.card_id = c.id AND ca.user_id = $1 AND ca.correct = true
               ) AS first_solved_at
        FROM cards c
        JOIN entries e ON e.id = c.entry_id
        JOIN categories cat ON cat.id = e.category_id
        JOIN languages l ON l.id = cat.language_id
        LEFT JOIN card_schedule cs ON cs.card_id = c.id
        WHERE c.user_id = $1 AND l.id = $2 ${modeFilter}
        ORDER BY COALESCE(cs.next_review, NOW()) ASC
        LIMIT $3
      `, [userId, languageId, parseInt(limit)])

      const { rows: settings } = await pool.query(
        'SELECT * FROM sr_settings WHERE user_id = $1', [userId]
      )

      return res.status(200).json({ cards: rows, settings: settings[0] || null })
    }

    if (req.method === 'POST') {
      const { cardId, correct, attemptNumber, rating } = req.body

      await pool.query(
        `INSERT INTO card_attempts (card_id, user_id, attempt_number, correct) VALUES ($1,$2,$3,$4)`,
        [cardId, userId, attemptNumber, correct]
      )
      await pool.query(
        `INSERT INTO card_reviews (card_id, user_id, correct, attempt_number, rating) VALUES ($1,$2,$3,$4,$5)`,
        [cardId, userId, correct, attemptNumber, rating || null]
      )

      if (correct && rating) {
        await pool.query(
          `UPDATE cards SET difficulty=$1, difficulty_set_at=NOW() WHERE id=$2 AND difficulty IS NULL`,
          [rating, cardId]
        )
        const { rows: ex } = await pool.query('SELECT * FROM card_schedule WHERE card_id=$1', [cardId])
        if (!ex.length) {
          const { easeFactor, intervalDays } = sm2(2.5, 1, rating)
          await pool.query(
            `INSERT INTO card_schedule (card_id, next_review, interval_days, ease_factor, review_count) VALUES ($1,$2,$3,$4,1)`,
            [cardId, new Date(Date.now() + intervalDays * 86400000), intervalDays, easeFactor]
          )
        } else {
          const { easeFactor, intervalDays } = sm2(ex[0].ease_factor, ex[0].interval_days, rating)
          await pool.query(
            `UPDATE card_schedule SET next_review=$1, interval_days=$2, ease_factor=$3, review_count=review_count+1 WHERE card_id=$4`,
            [new Date(Date.now() + intervalDays * 86400000), intervalDays, easeFactor, cardId]
          )
        }
      }
      return res.status(200).json({ ok: true })
    }

    if (req.method === 'PATCH') {
      const { same_day_hours, end_of_day_hours, week_days, month_days } = req.body
      await pool.query(
        `INSERT INTO sr_settings (user_id, same_day_hours, end_of_day_hours, week_days, month_days)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (user_id) DO UPDATE SET same_day_hours=$2, end_of_day_hours=$3, week_days=$4, month_days=$5`,
        [userId, same_day_hours, end_of_day_hours, week_days, month_days]
      )
      return res.status(200).json({ ok: true })
    }

    res.status(405).end()
  } catch (e) {
    console.error('cards error:', e.message)
    res.status(500).json({ error: e.message })
  }
}
