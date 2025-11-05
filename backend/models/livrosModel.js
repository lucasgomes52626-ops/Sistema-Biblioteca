const db = require('./db');

module.exports = {
  all() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM livros', (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
  find(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM livros WHERE id = ?', [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },
  create(livro) {
    const { titulo, autor, ano, genero, quantidade } = livro;
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO livros (titulo, autor, ano, genero, quantidade) VALUES (?, ?, ?, ?, ?)',
        [titulo, autor, ano || null, genero || null, quantidade || 1],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID });
        }
      );
    });
  },
  update(id, livro) {
    const { titulo, autor, ano, genero, quantidade } = livro;
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE livros SET titulo = ?, autor = ?, ano = ?, genero = ?, quantidade = ? WHERE id = ?',
        [titulo, authorOrNull(autor), ano || null, genero || null, quantidade || 0, id],
        function (err) {
          if (err) return reject(err);
          resolve({ changes: this.changes });
        }
      );
    });
  },
  remove(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM livros WHERE id = ?', [id], function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  },
  changeQuantity(id, delta) {
    return new Promise((resolve, reject) => {
      db.run('UPDATE livros SET quantidade = quantidade + ? WHERE id = ?', [delta, id], function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  }
};

function authorOrNull(v) {
  return v === undefined ? null : v;
}
