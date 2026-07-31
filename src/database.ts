import Database from "better-sqlite3";

const db = new Database("tasks.db");

db.exec(`
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0
);
`);

const row = db.prepare("SELECT COUNT(*) as count FROM tasks").get() as {
    count: number;
};

if (row.count === 0) {
    const insert = db.prepare(
        "INSERT INTO tasks (title, done) VALUES (?, ?)"
    );

    insert.run("Learn Express", 0);
    insert.run("Complete Assignment", 1);
    insert.run("Push to GitHub", 0);
}

export default db;