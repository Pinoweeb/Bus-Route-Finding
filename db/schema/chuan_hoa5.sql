CREATE TABLE stop_times_merged AS
SELECT
    st.trip_id,
    st.arrival_time,
    st.departure_time,
    m.unified_stop_id AS stop_id,
    st.stop_sequence
FROM stop_times st
JOIN stop_merge_map m
  ON st.stop_id = m.stop_id;

ALTER TABLE stop_times RENAME TO stop_times_backup;
ALTER TABLE stop_times_merged RENAME TO stop_times;
