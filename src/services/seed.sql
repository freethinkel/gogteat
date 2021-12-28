CREATE TABLE IF NOT EXISTS projects (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(200) NOT NULL,
  is_draft BOOLEAN DEFAULT FALSE,
  is_removed BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS project_doc (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(200) NOT NULL,
  is_removed BOOLEAN DEFAULT FALSE,
  content TEXT,
  project_id INTEGER,
  FOREIGN KEY (project_id) REFERENCES projects(id) 
);

INSERT INTO projects (name, is_draft)
  SELECT 'Drafts', 1
  WHERE NOT EXISTS (SELECT * FROM projects 
                  WHERE is_draft = 1);
