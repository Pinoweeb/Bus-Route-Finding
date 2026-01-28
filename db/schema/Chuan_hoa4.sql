-- Bảng stops_merged chứa 1 dòng cho mỗi unified_stop_id
CREATE TABLE stops_merged AS
SELECT
    n.unified_stop_id AS stop_id,
    n.stop_name_sample AS stop_name,
    n.lat_rounded     AS stop_lat,
    n.lon_rounded     AS stop_lon
FROM stop_nodes n;
-- Đổi tên bảng cũ để backup
ALTER TABLE stops RENAME TO stops_backup;

-- Đổi bảng mới thành stops
ALTER TABLE stops_merged RENAME TO stops;
