CREATE TABLE responses (
  response_id TEXT PRIMARY KEY,
  answers JSONB,
  tailored_result JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
