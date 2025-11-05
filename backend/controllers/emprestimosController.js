const emprestimosModel = require('../models/emprestimosModel');
const livrosModel = require('../models/livrosModel');

module.exports = {
  async list(req, res) {
    try {
      const rows = await emprestimosModel.all();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async get(req, res) {
    try {
      const row = await emprestimosModel.find(req.params.id);
      if (!row) return res.status(404).json({ error: 'Empréstimo não encontrado' });
      res.json(row);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async create(req, res) {
    try {
      const { livro_id, usuario_id, data_emprestimo, data_devolucao } = req.body;
      // checar disponibilidade
      const livro = await livrosModel.find(livro_id);
      if (!livro) return res.status(400).json({ error: 'Livro não encontrado' });
      if ((livro.quantidade || 0) <= 0) return res.status(400).json({ error: 'Livro indisponível' });

      // criar emprestimo e decrementar quantidade
      const result = await emprestimosModel.create({ livro_id, usuario_id, data_emprestimo, data_devolucao });
      await livrosModel.changeQuantity(livro_id, -1);

      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async end(req, res) {
    try {
      const id = req.params.id;
      const emprestimo = await emprestimosModel.find(id);
      if (!emprestimo) return res.status(404).json({ error: 'Empréstimo não encontrado' });
      if (emprestimo.data_devolucao) return res.status(400).json({ error: 'Empréstimo já encerrado' });

      const dataDevolucao = req.body.data_devolucao || new Date().toISOString();
      await emprestimosModel.end(id, dataDevolucao);
      // incrementar quantidade do livro
      await livrosModel.changeQuantity(emprestimo.livro_id, 1);

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
