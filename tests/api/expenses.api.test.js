import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../server.js';
import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DB_URL, ssl: { rejectUnauthorized: false } });

describe('Expense API', () => {
    beforeEach(async () => {
        await pool.query('DELETE FROM expenses'); // Reset per test
    });

    afterAll(async () => {
        await pool.end();
    });

    it('POST /api/expenses - adds an expense', async () => {
        const response = await request(app)
            .post('/api/expenses')
            .send({ amount: 50.25, category: 'Food', spend_mode:'Cash',date: '2025-04-12' });
        expect(response.status).toBe(200); // Match server.js behavior
        expect(response.body).toHaveProperty('id');
    });

    it('GET /api/expenses - returns expenses', async () => {
        await request(app)
            .post('/api/expenses')
            .send({ amount: 10, category: 'Utilities',spend_mode:'Card', date: '2025-04-12' });
        const response = await request(app).get('/api/expenses');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
    });

    it('DELETE /api/expenses/:id - deletes an expense', async () => {
        const postResponse = await request(app)
            .post('/api/expenses')
            .send({ amount: 10, category: 'Utilities', spend_mode:'Cash',date: '2025-04-12' });
        const id = postResponse.body.id;
        const deleteResponse = await request(app).delete(`/api/expenses/${id}`);
        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body).toEqual({ deleted: 1 });
    });
});