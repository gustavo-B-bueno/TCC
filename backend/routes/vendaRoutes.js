const express = require('express');
const ctrl = require('../controllers/vendaController');

const router = express.Router();

router.get('/venda', ctrl.getAll);
router.get('/venda/:id', ctrl.getById);
router.post('/venda', ctrl.create);
router.put('/venda/:id', ctrl.update);
router.delete('/venda/:id', ctrl.delete);   

router.get('/mostSoldProducts', ctrl.getMostSoldProducts);
router.get('/mostSoldProductsPDF', ctrl.generateMostSoldProductsPDF);

router.get('/topSellers', ctrl.getTopSellers);
router.get('/topSellersPDF', ctrl.generateTopSellersPDF);

router.get('/topConsumers', ctrl.getTopConsumers);
router.get('/topConsumersPDF', ctrl.generateTopConsumersPDF);

module.exports = router;