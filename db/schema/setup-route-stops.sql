CREATE TABLE route_stops (
  route_id TEXT NOT NULL,
  stop_id TEXT NOT NULL,
  stop_sequence INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (route_id, stop_id, stop_sequence)
);

INSERT INTO route_stops (route_id, stop_id, stop_sequence)
SELECT DISTINCT 
  t.route_id,
  st.stop_id,
  st.stop_sequence
FROM trips t
INNER JOIN stop_times st ON t.trip_id = st.trip_id
INNER JOIN (
  SELECT route_id, MIN(trip_id) as first_trip_id
  FROM trips
  GROUP BY route_id
) first_trip ON t.route_id = first_trip.route_id AND t.trip_id = first_trip.first_trip_id
ORDER BY t.route_id, st.stop_sequence;
