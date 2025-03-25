const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Consumer = sequelize.define('Consumer', {
  name: {
      type: DataTypes.STRING,
      allowNull: false
  },
  email: { 
    type: DataTypes.STRING,
    allowNull: false,
  },
  cpf: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  phone: {
    type: DataTypes.INTEGER,
    allowNull: false,
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

module.exports = Consumer;