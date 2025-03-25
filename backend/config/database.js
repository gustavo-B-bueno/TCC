const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('saphirus_test', 'root', '', {
    host: '127.0.0.1',
    port: 3306, 
    dialect: 'mysql'
});

sequelize.authenticate()
.then(() => {
    console.log('Conectado com sucesso');
})
.catch(err => {
    console.log('Error a conectar com banco ' + err)
})

module.exports = sequelize;