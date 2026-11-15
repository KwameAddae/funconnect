CREATE TABLE IF NOT EXISTS messages (
  id          SERIAL PRIMARY KEY,
  sender_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  read_at     TIMESTAMPTZ DEFAULT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_pair
  ON messages (LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id), created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_receiver_unread
  ON messages (receiver_id) WHERE read_at IS NULL;
