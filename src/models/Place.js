const DataType = require('sequelize');
const db = require('../database/database.js');

const Place = db.define("visited",
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataType.INTEGER
        },
        city: {
            allowNull: false,
            type: DataType.STRING(64),
            validate: {
                len: [2, 64]
            }
        },
        incountry: {
            allowNull: false,
            type: DataType.STRING(64),
            validate: {
                len: [2, 64]
            }
        },
        date: {
            allowNull: false,
            type: DataType.DATE,
            validate: {
                isDate: true
            }
        }
    },
    {
        timestamps: false,
        freezeTableName: true,
        tableName: 'visited',
    }
);

module.exports = Place;

