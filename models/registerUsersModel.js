const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeconfig');

const User = sequelize.define('register_users', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contact_number: {
    type: DataTypes.STRING, 
    allowNull: true
  }
});

module.exports = User;