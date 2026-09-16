import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import usersSync from './users/sync.js'
import languages from './languages/index.js'
import categories from './categories/index.js'
import entries from './entries/index.js'
import cards from './cards/index.js'

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.all('/api/users/sync', usersSync)
app.all('/api/languages', languages)
app.all('/api/categories', categories)
app.all('/api/entries', entries)
app.all('/api/cards', cards)

app.listen(3000, () => console.log('API running on http://localhost:3000'))
