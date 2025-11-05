const db = require('./db');

module.exports = {
  all() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT e.*, l.titulo as livro_titulo, u.nome as usuario_nome
                   FROM emprestimos e
                   LEFT JOIN livros l ON e.livro_id = l.id
                   LEFT JOIN usuarios u ON e.usuario_id = u.id
                   ORDER BY e.id DESC`;
      db.all(sql, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
  find(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM emprestimos WHERE id = ?', [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },
  create(emprestimo) {
    const { livro_id, usuario_id, data_emprestimo, data_devolucao } = emprestimo;
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO emprestimos (livro_id, usuario_id, data_emprestimo, data_devolucao) VALUES (?, ?, ?, ?)',
        [livro_id, usuario_id, data_emprestimo, data_devolucao || null],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID });
        }
      );
    });
  },
  end(id, data_devolucao) {
    return new Promise((resolve, reject) => {
      db.run('UPDATE emprestimos SET data_devolucao = ? WHERE id = ?', [data_devolucao, id], function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  }
};
