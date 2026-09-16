import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
  host: '54.80.244.253',
  port: 36348,
  database: 'tsdb',
  user: 'tsdbadmin',
  password: 'nontsnzzkmygozc0',
  ssl: { rejectUnauthorized: false },
  max: 5,
})

export default pool
