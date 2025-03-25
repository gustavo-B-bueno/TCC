const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  name: {
      type: DataTypes.STRING,
      allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cpf: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING
  },
  cep: {
    type: DataTypes.STRING
  },
  rua: {
    type: DataTypes.STRING
  },
  number: {
    type: DataTypes.STRING
  },
  bairro: {
    type: DataTypes.STRING
  },
  cidade: {
    type: DataTypes.STRING
  },
  uf: {
    type: DataTypes.STRING
  }
});

module.exports = User;