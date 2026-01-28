CREATE TABLE stop_nodes AS
SELECT
    MIN(stop_id) AS unified_stop_id,          -- chọn 1 id đại diện
    ROUND(stop_lat::numeric, 5) AS lat_rounded,
    ROUND(stop_lon::numeric, 5) AS lon_rounded,
    MIN(stop_name) AS stop_name_sample,
    COUNT(*) AS merged_stop_count
FROM stops
GROUP BY
    ROUND(stop_lat::numeric, 5),
    ROUND(stop_lon::numeric, 5);
