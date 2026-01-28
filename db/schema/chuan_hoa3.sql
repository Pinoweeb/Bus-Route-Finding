-- 1. Bảng mapping từ stop gốc -> unified_stop_id
CREATE TABLE stop_merge_map AS
SELECT
    s.stop_id,
    n.unified_stop_id
FROM stops s
JOIN stop_nodes n
  ON ROUND(s.stop_lat::numeric, 5) = n.lat_rounded
 AND ROUND(s.stop_lon::numeric, 5) = n.lon_rounded;

-- 2. Tạo stop_times_unified dùng unified_stop_id
CREATE TABLE stop_times_unified AS
SELECT
    st.trip_id,
    st.arrival_time,
    st.departure_time,
    m.unified_stop_id AS stop_id,
    st.stop_sequence
FROM stop_times st
JOIN stop_merge_map m
  ON st.stop_id = m.stop_id;
