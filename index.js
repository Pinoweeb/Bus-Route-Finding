const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Cấu hình kết nối PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

// Kiểm tra kết nối Database khi khởi động
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Lỗi kết nối Database:', err.stack);
        console.error('👉 Gợi ý: Kiểm tra lại xem PostgreSQL đã bật chưa và thông tin trong file .env có đúng không.');
    } else {
        console.log('✅ Kết nối PostgreSQL thành công!');
        release();
    }
});

// Route kiểm tra server (Health check)
app.get('/', (req, res) => {
    res.json({ message: 'Server đang chạy trơn tru!', database: 'Đang kết nối...' });
});

// Route lấy thử ngày giờ từ DB để chắc chắn DB hoạt động
app.get('/db-test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi truy vấn Database' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
