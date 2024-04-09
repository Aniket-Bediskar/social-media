const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'root',
  password: '', 
  database: 'social_media',
  port: 3306,
  define: {
    timestamps: true,
    underscored: true,
  },
});

module.exports = sequelize;