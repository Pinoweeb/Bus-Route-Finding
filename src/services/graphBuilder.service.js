// src/services/graphBuilder.service.js
const pool = require('../config/db');
const { Graph } = require('../models/Graph');

async function buildGraph() {
  const graph = new Graph();

  // Lấy toàn bộ route_stops, sort theo route_id + stop_sequence
  const query = `
    SELECT route_id, stop_id, stop_sequence
    FROM route_stops
    ORDER BY route_id, stop_sequence
  `;

  const { rows } = await pool.query(query);

  // group theo route_id
  const byRoute = new Map();
  for (const row of rows) {
    if (!byRoute.has(row.route_id)) {
      byRoute.set(row.route_id, []);
    }
    byRoute.get(row.route_id).push(row);
  }

  // với mỗi tuyến, tạo cạnh giữa các điểm dừng liên tiếp
  for (const [routeId, list] of byRoute.entries()) {
    for (let i = 0; i < list.length - 1; i++) {
      const curr = list[i];
      const next = list[i + 1];

      const from = curr.stop_id;
      const to = next.stop_id;

      // bản đơn giản: mỗi đoạn weight = 1, hai chiều
      graph.addEdge(from, to, routeId, 1);
      graph.addEdge(to, from, routeId, 1);
    }
  }

  return graph;
}

module.exports = {
  buildGraph,
};
