const express = require('express');
const ctrl = require('../controllers/productController');

const router = express.Router();

router.get('/product', ctrl.getAll);
router.get('/product/:id', ctrl.getById);
router.post('/product', ctrl.create);
router.put('/product/:id', ctrl.update);
router.delete('/product/:id', ctrl.delete);

module.exports = router;