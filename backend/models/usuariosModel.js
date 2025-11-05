const db = require('./db');

module.exports = {
  all() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM usuarios', (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
  find(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM usuarios WHERE id = ?', [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },
  create(usuario) {
    const { nome, email, telefone, endereco } = usuario;
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO usuarios (nome, email, telefone, endereco) VALUES (?, ?, ?, ?)',
        [nome, email || null, telefone || null, endereco || null],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID });
        }
      );
    });
  },
  update(id, usuario) {
    const { nome, email, telefone, endereco } = usuario;
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE usuarios SET nome = ?, email = ?, telefone = ?, endereco = ? WHERE id = ?',
        [nome, email || null, telefone || null, endereco || null, id],
        function (err) {
          if (err) return reject(err);
          resolve({ changes: this.changes });
        }
      );
    });
  },
  remove(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM usuarios WHERE id = ?', [id], function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  }
};
