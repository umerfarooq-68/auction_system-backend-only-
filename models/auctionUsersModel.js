const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelizeconfig');

const AuctionUser = sequelize.define('auction_products', {
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
        
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    currentPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    category: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    initial_price: {
        type: DataTypes.STRING,
        allowNull: false
    },
    auction_time: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    isActive: {
        type: DataTypes.STRING,
        allowNull: false
    },
    certificate_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: false
    },
    filepath: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    endTime:{
        type: DataTypes.DATE,
           allowNull: true,
    }
}, {
    timestamps: true
});

module.exports = AuctionUser;
