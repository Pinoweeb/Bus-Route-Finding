CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS route_search_history (
  id              BIGSERIAL PRIMARY KEY,
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  from_stop_id    TEXT NOT NULL,
  to_stop_id      TEXT NOT NULL,
  mode            TEXT NOT NULL,          -- 'simple' | 'dijkstra' | ...
  found           BOOLEAN NOT NULL,       -- true nếu tìm được đường
  stops_count     INTEGER,                -- số điểm dừng trong kết quả
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE route_search_history
ADD COLUMN path_stops JSONB;
