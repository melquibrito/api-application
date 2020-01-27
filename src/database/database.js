const { Sequelize } = require('sequelize');
const config = require("../config/config");

module.exports = new Sequelize(
    config.development.database.name,
    config.development.database.user,
    config.development.database.password,
    {
        host: config.development.database.host,
        dialect: config.development.database.dialect,

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);