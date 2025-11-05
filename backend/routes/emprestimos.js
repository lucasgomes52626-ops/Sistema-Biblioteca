const express = require('express');
const router = express.Router();
const controller = require('../controllers/emprestimosController');

router.get('/', controller.list);
router.get('/:id', controller.get);
router.post('/', controller.create);
router.put('/:id/end', controller.end); // encerrar empréstimo

module.exports = router;
