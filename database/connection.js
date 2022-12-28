const { Sequelize } = require("sequelize");

const connection = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
  host: process.env.HOST_DB,
  dialect: process.env.TYPE_DB,
  timezone: '-03:00'
});

module.exports = connection;
