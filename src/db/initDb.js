const { run } = require("./database");

async function initDb() {
  await run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sku TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      min_stock INTEGER NOT NULL DEFAULT 0,
      price REAL NOT NULL DEFAULT 0,
      location TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
}

module.exports = initDb;
