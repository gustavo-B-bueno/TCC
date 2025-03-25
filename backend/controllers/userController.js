const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao listar usuarios'
        })
    }
}

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if(user){
            res.status(201).json(user)
        } else {
            res.status(404).json({error: 'Usuário não encontrado'});
        }
    } catch (error) {
        res.status(500).json({error : 'Error ao buscar usuário'});
    }
}

exports.createUser = async (req, res) => {
    console.log(req.body)
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({error: 'Error ao criar usuario'})
    }
}

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if(user){
            await user.update(req.body);
            res.json(user);
        } else {
            res.status(404).json({error: 'Usuario nao encontrato'})
        }
    } catch (error) {
        res.status(500).json({error: 'Error a atualizar o usuário'});
    }
}

exports.deleteUser = async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if(user){
          await user.destroy({
              where: {
                  id: req.params.id
              }
          })
          res.status(204).send();
      } else {
          res.status(404).json({error: 'Usuario não encontrato'})
      }
    } catch (error) {
        res.status(500).json({error: 'Erro ao deletar usuario'});
    }
}