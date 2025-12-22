SELECT COUNT(*) as total_routes FROM routes;
SELECT COUNT(*) as total_stops FROM stops;
SELECT COUNT(*) as total_trips FROM trips;
SELECT COUNT(*) as total_stop_times FROM stop_times;

-- Phân bố AM/MD/PM
SELECT 
  CASE 
    WHEN trip_id LIKE '%_AM_%' THEN 'AM'
    WHEN trip_id LIKE '%_MD_%' THEN 'MD'
    WHEN trip_id LIKE '%_PM_%' THEN 'PM'
    ELSE 'OTHER'
  END as time_of_day,
  COUNT(*) as trip_count
FROM trips
GROUP BY time_of_day
ORDER BY time_of_day;
