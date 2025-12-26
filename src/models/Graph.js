class Edge {
  constructor(toStopId, routeId, weight = 1) {
    this.toStopId = toStopId;
    this.routeId = routeId;
    this.weight = weight;
  }
}

class Graph {
  constructor() {
    this.adjList = new Map(); // stopId -> Edge[]
  }

  addEdge(fromStopId, toStopId, routeId, weight = 1) {
    if (!this.adjList.has(fromStopId)) {
      this.adjList.set(fromStopId, []);
    }
    this.adjList.get(fromStopId).push(new Edge(toStopId, routeId, weight));
  }

  getNeighbors(stopId) {
    return this.adjList.get(stopId) || [];
  }
}

module.exports = { Graph, Edge };
