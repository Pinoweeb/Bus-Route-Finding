const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import thư viện CORS
require('dotenv').config();

// Import các file routes
const routesRoutes = require('./routes/routes.routes');
const stopsRoutes = require('./routes/stops.routes'); // <-- Đã thêm: Import route cho Stops

const app = express();
const port = process.env.PORT || 3000;

// Cấu hình Middleware
app.use(cors()); // Cho phép Frontend gọi API mà không bị lỗi Cross-Origin
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route kiểm tra server sống hay chết
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Hanoi Bus API',
    status: 'Running'
  });
});

// --- ĐĂNG KÝ CÁC API ROUTES ---

// 1. Route cũ cho tuyến xe (Routes)
app.use('/api/routes', routesRoutes);

// 2. Route mới cho điểm dừng (Stops) --> Thêm phần này
app.use('/api/stops', stopsRoutes);


// Middleware xử lý lỗi chung (Error Handling)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message
  });
});

// Khởi chạy server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`API Stops endpoint: http://localhost:${port}/api/stops`);
});