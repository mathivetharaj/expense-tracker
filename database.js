import sqlite3 from 'sqlite3';
const sqlite=sqlite3.verbose();

const db = new sqlite.Database('./expenses.db');

// Create expenses table
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            spend_mode TEXT NOT NULL,
            date TEXT NOT NULL
        )
    `);
});

export default db;