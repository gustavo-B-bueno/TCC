const express = require('express');
const ctrl = require('../controllers/consumerController');

const { check, validationResult } = require('express-validator');

// Middleware de validação para a criação
const validateCreate = [
    check('name').notEmpty().withMessage('O campo nome é obrigatório'),
    check('email').notEmpty().isEmail().withMessage('O e-mail deve ser válido')
];

const router = express.Router();

router.get('/consumer', ctrl.getAll);
router.get('/consumer/:id', ctrl.getById);
router.post('/consumer', validateCreate,  ctrl.create);
router.put('/consumer/:id', validateCreate, ctrl.update);
router.delete('/consumer/:id', ctrl.delete);

module.exports = router;