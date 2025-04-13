const express = require('express');
const ctrl = require('../controllers/categoryController');

const router = express.Router();

router.get('/product', ctrl.getAll);
router.post('/product', ctrl.create);
router.put('/product/:id', ctrl.update);
router.delete('/product/:id', ctrl.delete);

module.exports = router;