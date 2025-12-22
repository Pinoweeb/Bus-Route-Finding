const pool = require('../db');

const getStatus = (req, res) => {
  res.json({ status: 'ok' });
};

const getRoutes = async (req, res) => {
  // tạm để trống hoặc giữ code SELECT routes
};

const getRouteById = async (req, res) => {
  // tạm để trống hoặc giữ code SELECT routes WHERE route_id = $1
};

module.exports = {
  getStatus,
  getRoutes,
  getRouteById,
};
