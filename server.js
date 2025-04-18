import express from "express";
import cors from "cors";
import helmet from "helmet";
import pool from "./database.js";
import 'dotenv/config.js';

//update to trigger the github action

const app=express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/api/expenses', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM expenses');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/expenses', async (req, res) => {
    const { amount, category,spend_mode, date } = req.body;
    if (!amount || !category || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO expenses (amount, category,spend_mode, date) VALUES ($1, $2, $3, $4) RETURNING id',
            [amount, category,spend_mode, date]
        );
        res.json({ id: result.rows[0].id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/api/expenses/:id', async (req, res) => {
    const id = req.params.id;
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }
    try {
        const result = await pool.query('DELETE FROM expenses WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.json({ deleted: result.rowCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

if (import.meta.url === `file://${process.argv[1]}`) {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

export default app;