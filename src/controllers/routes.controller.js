const pool = require('../db');

const getStatus = (req, res) => {
  res.json({ status: 'ok' });
};

const getRoutes = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT route_id, route_short_name, route_long_name FROM routes ORDER BY route_short_name'
    );
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


const getRouteById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT route_id, route_short_name, route_long_name FROM routes WHERE route_id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Route not found' 
      });
    }
    res.json({ 
      success: true, 
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};


module.exports = {
  getStatus,
  getRoutes,
  getRouteById,
};
