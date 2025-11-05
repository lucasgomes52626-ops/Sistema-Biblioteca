const livrosModel = require('../models/livrosModel');

module.exports = {
  async list(req, res) {
    try {
      const rows = await livrosModel.all();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async get(req, res) {
    try {
      const row = await livrosModel.find(req.params.id);
      if (!row) return res.status(404).json({ error: 'Livro não encontrado' });
      res.json(row);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async create(req, res) {
    try {
      const result = await livrosModel.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async update(req, res) {
    try {
      const result = await livrosModel.update(req.params.id, req.body);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async remove(req, res) {
    try {
      const result = await livrosModel.remove(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
