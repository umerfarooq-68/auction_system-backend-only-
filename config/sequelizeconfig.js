const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('auction_database', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
