const Model = require('../models/Product');

exports.getAll = async (req, res) => {
    try {
        const data = await Model.findAll();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao listar todos os registros'
        })
    }
}

exports.getById = async (req, res) => {
    try {
        const data = await Model.findByPk(req.params.id);
        if(data){
            res.status(201).json(data)
        } else {
            res.status(404).json({error: 'Registro não encontrado'});
        }
    } catch (error) {
        res.status(500).json({error : 'Error ao buscar usuário'});
    }
}

exports.create = async (req, res) => {
    console.log(req.body)
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