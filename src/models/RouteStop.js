class RouteStop {
  constructor(routeId, stopId, stopSequence) {
    this.routeId = routeId;           // route_id
    this.stopId = stopId;             // stop_id
    this.stopSequence = stopSequence; // stop_sequence
  }
}

module.exports = RouteStop;
