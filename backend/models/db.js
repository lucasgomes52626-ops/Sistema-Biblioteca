const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.join(__dirname, '..', 'database.sqlite');

const db = new sqlite3.Database(dbPath);

// Enable foreign keys
db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');

  db.run(`
    CREATE TABLE IF NOT EXISTS livros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      autor TEXT,
      ano INTEGER,
      genero TEXT,
      quantidade INTEGER DEFAULT 1
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT,
      telefone TEXT,
      endereco TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS emprestimos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      livro_id INTEGER NOT NULL,
      usuario_id INTEGER NOT NULL,
      data_emprestimo TEXT NOT NULL,
      data_devolucao TEXT,
      FOREIGN KEY(livro_id) REFERENCES livros(id),
      FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
    )
  `);
});

module.exports = db;
