const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const livrosRoutes = require('./routes/livros');
const usuariosRoutes = require('./routes/usuarios');
const emprestimosRoutes = require('./routes/emprestimos');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve frontend if needed (optional)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.use('/livros', livrosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/emprestimos', emprestimosRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    details: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
