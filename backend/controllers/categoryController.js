const Model = require('../models/Category');

const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
    try {
        const data = await Model.findAll();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao listar'
        })
    }
}

exports.create = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const data = await Model.create(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({error: 'Error ao criar registro'})
    }
}

exports.update = async (req, res) => {
    try {
        const data = await Model.findByPk(req.params.id);
        if(data){
            await data.update(req.body);
            res.json(data);
        } else {
            res.status(404).json({error: 'Registro nao encontrato'})
        }
    } catch (error) {
        res.status(500).json({error: 'Error a atualizar o registro'});
    }
}

exports.delete = async (req, res) => {
    try {
      const data = await Model.findByPk(req.params.id);
      if(data){
          await data.destroy({
              where: {
                  id: req.params.id
              }
          })
          res.status(204).send();
      } else {
          res.status(404).json({error: 'Registro não encontrato'})
      }
    } catch (error) {
        res.status(500).json({error: 'Erro ao deletar item'});
    }
}