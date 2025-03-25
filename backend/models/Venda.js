const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Venda = sequelize.define('Venda', {
  nomeCliente: {
    type: DataTypes.STRING,
    allowNull: false
  
  },
  nomeVendedor: {
    type: DataTypes.STRING,
    allowNull: false
    
  },
  nomeProduto: {
    type: DataTypes.STRING,
    allowNull: false
    
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false

  }

});

module.exports = Venda;