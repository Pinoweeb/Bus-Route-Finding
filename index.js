const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 5432,
});

// Test kết nối DB
pool
    .query('SELECT 1')
    .then(() => console.log('✅ DB connected'))
    .catch((err) => console.error('❌ DB connection error:', err.message));

// ========== API STOPS ==========

// GET /stops?q=
app.get('/stops', async (req, res) => {
    try {
        const { q } = req.query;

        let query = `
      SELECT stop_id, stop_name, stop_lat, stop_lon
      FROM stops
    `;
        const params = [];

        if (q && q.trim() !== '') {
            // ILIKE: không phân biệt hoa/thường
            query += ' WHERE stop_name ILIKE $1';
            params.push(`%${q}%`);
        }

        query += ' ORDER BY stop_name ASC';

        const result = await pool.query(query, params);
        return res.json(result.rows);
    } catch (err) {
        console.error('getStops error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// GET /stops/:id
app.get('/stops/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
      SELECT stop_id, stop_name, stop_lat, stop_lon
      FROM stops
      WHERE stop_id = $1
      `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Stop not found' });
        }

        return res.json(result.rows[0]);
    } catch (err) {
        console.error('getStopById error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// GET /stops/nearby?lat=&lng=&radius=
app.get('/stops/nearby', async (req, res) => {
    try {
        const { lat, lng, radius } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ error: 'lat and lng are required' });
        }

        const radiusKm = radius ? Number(radius) : 0.5; // mặc định 0.5 km

        const query = `
      SELECT
        stop_id,
        stop_name,
        stop_lat,
        stop_lon,
        (
          6371 * acos(
            cos(radians($1)) * cos(radians(stop_lat)) *
            cos(radians(stop_lon) - radians($2)) +
            sin(radians($1)) * sin(radians(stop_lat))
          )
        ) AS distance_km
      FROM stops
      WHERE stop_lat IS NOT NULL
        AND stop_lon IS NOT NULL
      HAVING (
        6371 * acos(
          cos(radians($1)) * cos(radians(stop_lat)) *
          cos(radians(stop_lon) - radians($2)) +
          sin(radians($1)) * sin(radians(stop_lat))
        )
      ) <= $3
      ORDER BY distance_km ASC
      LIMIT 50;
    `;

        const result = await pool.query(query, [lat, lng, radiusKm]);

        const data = result.rows.map((row) => ({
            stop_id: row.stop_id,
            stop_name: row.stop_name,
            stop_lat: row.stop_lat,
            stop_lon: row.stop_lon,
            distance_m: Math.round(row.distance_km * 1000),
        }));

        return res.json(data);
    } catch (err) {
        console.error('getNearbyStops error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Server OK', docs: '/stops, /stops?q=, /stops/:id, /stops/nearby' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
