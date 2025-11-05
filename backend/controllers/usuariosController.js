const usuariosModel = require('../models/usuariosModel');

module.exports = {
  async list(req, res) {
    try {
      const rows = await usuariosModel.all();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async get(req, res) {
    try {
      const row = await usuariosModel.find(req.params.id);
      if (!row) return res.status(404).json({ error: 'Usuário não encontrado' });
      res.json(row);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async create(req, res) {
    try {
      console.log('Dados recebidos:', req.body);
      
      if (!req.body.nome) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
      }

      const result = await usuariosModel.create(req.body);
      console.log('Usuário criado:', result);
      res.status(201).json(result);
    } catch (err) {
      console.error('Erro ao criar usuário:', err);
      res.status(500).json({ error: err.message });
    }
  },
  async update(req, res) {
    try {
      const result = await usuariosModel.update(req.params.id, req.body);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async remove(req, res) {
    try {
      const result = await usuariosModel.remove(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
