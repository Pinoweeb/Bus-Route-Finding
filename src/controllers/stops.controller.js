const db = require('../config/db');


const sendResponse = (res, status, data, message = '') => {
    res.status(status).json({
        success: status >= 200 && status < 300,
        message,
        data
    });
};


const getAllStops = async (req, res) => {
    try {
        const { q, limit = 50, offset = 0 } = req.query;


        let queryText = 'SELECT * FROM stops';
        let queryParams = [];


        if (q) {

            queryText += ' WHERE stop_name ILIKE $1';
            queryParams.push(`%${q}%`);
        }


        queryText += ` ORDER BY stop_name LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
        queryParams.push(limit, offset);

        const result = await db.query(queryText, queryParams);

        sendResponse(res, 200, result.rows, 'Lấy danh sách điểm dừng thành công');
    } catch (error) {
        console.error('Error in getAllStops:', error);
        sendResponse(res, 500, null, 'Lỗi Server khi lấy danh sách điểm dừng');
    }
};


const getStopsNearby = async (req, res) => {
    try {
        const { lat, lng, radius = 1 } = req.query;

        if (!lat || !lng) {
            return sendResponse(res, 400, null, 'Vui lòng cung cấp tọa độ lat và lng');
        }


        const queryText = `
      SELECT *,
        (6371 * acos(
          cos(radians($1)) * cos(radians(stop_lat)) *
          cos(radians(stop_lon) - radians($2)) +
          sin(radians($1)) * sin(radians(stop_lat))
        )) AS distance
      FROM stops
      WHERE (6371 * acos(
          cos(radians($1)) * cos(radians(stop_lat)) *
          cos(radians(stop_lon) - radians($2)) +
          sin(radians($1)) * sin(radians(stop_lat))
        )) < $3
      ORDER BY distance ASC
      LIMIT 20;
    `;

        const result = await db.query(queryText, [lat, lng, radius]);

        sendResponse(res, 200, result.rows, `Tìm thấy ${result.rows.length} điểm dừng trong bán kính ${radius}km`);
    } catch (error) {
        console.error('Error in getStopsNearby:', error);
        sendResponse(res, 500, null, 'Lỗi Server khi tìm điểm dừng gần nhất');
    }
};


const getStopById = async (req, res) => {
    try {
        const { id } = req.params;


        const queryText = 'SELECT * FROM stops WHERE stop_id = $1';
        const result = await db.query(queryText, [id]);

        if (result.rows.length === 0) {
            return sendResponse(res, 404, null, 'Không tìm thấy điểm dừng với ID này');
        }

        sendResponse(res, 200, result.rows[0], 'Lấy thông tin điểm dừng thành công');
    } catch (error) {
        console.error('Error in getStopById:', error);
        sendResponse(res, 500, null, 'Lỗi Server khi lấy chi tiết điểm dừng');
    }
};

module.exports = {
    getAllStops,
    getStopById,
    getStopsNearby
};