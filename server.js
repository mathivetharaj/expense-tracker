import express from "express";
import db from "./database.js";

const app=express();
const port= 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/api/expenses', (req, res) => {
    db.all('SELECT * FROM expenses', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
}   
);

app.post('/api/expenses', (req, res) => {
    const { amount, category, spend_mode, date } = req.body;
    db.run('INSERT INTO expenses (amount, category, spend_mode, date) VALUES (?, ?, ?, ?)', [amount, category, spend_mode, date], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID });
    });
}
);
app.delete('/api/expenses/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM expenses WHERE id = ?', id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(204).end();
    });
}
);
app.put('/api/expenses/:id', (req, res) => {
    const id = req.params.id;
    const { amount, category, spend_mode, date } = req.body;
    db.run('UPDATE expenses SET amount = ?, category = ?, spend_mode = ?, date = ? WHERE id = ?', [amount, category, spend_mode, date, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json({ changes: this.changes });
    });
}
);
app.get('/api/expenses/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM expenses WHERE id = ?', id, (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(row);
    });
}
);
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
}
);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});