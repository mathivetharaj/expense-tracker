import pg from 'pg';
const {Pool}=pg;
import 'dotenv/config.js';

//env.config();

const pool=new Pool({connectionString:process.env.DB_URL,ssl:{rejectUnauthorized:false}});
//const db = new sqlite.Database('./expenses.db');

// Create expenses table
pool.query(`
    CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        spend_mode TEXT NOT NULL,
        date TEXT NOT NULL
    )
`).catch(err => console.error('Error creating table:', err));



export default pool;