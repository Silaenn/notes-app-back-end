-- Create notes table for CyberNote Y2K
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  tags TEXT DEFAULT '[]',
  body TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Create index untuk faster queries by creation date
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);

-- Create index untuk searching by title
CREATE INDEX IF NOT EXISTS idx_notes_title ON notes(title);
