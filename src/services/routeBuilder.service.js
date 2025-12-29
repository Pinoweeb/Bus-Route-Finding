// src/services/routeFinding.service.js
const pool = require('../config/db');
const { buildGraph } = require('./graphBuilder.service'); // dùng graph đã build

/**
 * Tìm đường đơn giản: cùng tuyến
 */
async function findSimplePathSameRoute(routeId, fromStopId, toStopId) {
  const query = `
    SELECT route_id, stop_id, stop_sequence
    FROM route_stops
    WHERE route_id = $1
    ORDER BY stop_sequence
  `;

  const { rows } = await pool.query(query, [routeId]);

  if (rows.length === 0) {
    throw new Error(`Route ${routeId} not found`);
  }

  let fromIdx = -1;
  let toIdx = -1;

  for (let i = 0; i < rows.length; i++) {
    if (rows[i].stop_id === fromStopId) fromIdx = i;
    if (rows[i].stop_id === toStopId) toIdx = i;
  }

  if (fromIdx === -1 || toIdx === -1) {
    throw new Error(
      `One or both stops not found on route ${routeId}`
    );
  }

  if (fromIdx > toIdx) {
    [fromIdx, toIdx] = [toIdx, fromIdx];
  }

  const stopIds = [];
  for (let i = fromIdx; i <= toIdx; i++) {
    stopIds.push(rows[i].stop_id);
  }

  return {
    stopIds,
    totalWeight: stopIds.length - 1,
    routeId,
  };
}

/**
 * Tìm đường tối ưu toàn mạng lưới bằng Dijkstra
 * Input: fromStopId, toStopId
 * Output: danh sách stopId + tổng weight
 */
async function findOptimalPath(fromStopId, toStopId) {
  // 1. Build graph từ DB
  const graph = await buildGraph();
  const adj = graph.adj; // giả sử class Graph có thuộc tính adj = { stopId: [ { to, routeId, weight }, ... ] }

  if (!adj[fromStopId]) {
    throw new Error(`Start stop ${fromStopId} not found in graph`);
  }
  if (!adj[toStopId]) {
    throw new Error(`End stop ${toStopId} not found in graph`);
  }

  // 2. Khởi tạo Dijkstra
  const dist = {};
  const prev = {};
  const visited = new Set();

  for (const node of Object.keys(adj)) {
    dist[node] = Infinity;
    prev[node] = null;
  }
  dist[fromStopId] = 0;

  // 3. Vòng lặp chính Dijkstra (version đơn giản, không PQ)
  while (true) {
    let u = null;
    let best = Infinity;

    for (const node of Object.keys(adj)) {
      if (!visited.has(node) && dist[node] < best) {
        best = dist[node];
        u = node;
      }
    }

    if (u === null || u === toStopId) break;
    visited.add(u);

    for (const edge of adj[u]) {
      const v = edge.to;
      const w = edge.weight;

      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        prev[v] = u;
      }
    }
  }

  if (dist[toStopId] === Infinity) {
    throw new Error(`No path from ${fromStopId} to ${toStopId}`);
  }

  // 4. Dựng lại đường đi
  const path = [];
  let cur = toStopId;
  while (cur) {
    path.push(cur);
    cur = prev[cur];
  }
  path.reverse();

  return {
    stopIds: path,
    totalWeight: dist[toStopId],
  };
}

module.exports = {
  findSimplePathSameRoute,
  findOptimalPath,
};
