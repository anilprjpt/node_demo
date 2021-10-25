const { Sequelize } = require('sequelize');
const dbConfig = require('../config/config_detail');

const sequelize = new Sequelize(dbConfig.db_name, dbConfig.db_user_name, dbConfig.db_password, {
	host: dbConfig.db_host,
	dialect: dbConfig.db_dialect,
	dialect: 'mysql',
	operatorsAliases: 0,
	define: {
		freezeTableName: true,
		underscored: true,
		timestamps: true
	},
	pool: {
		max: dbConfig.pool.max,
		min: dbConfig.pool.min,
		acquire: dbConfig.pool.acquire,
		idle: dbConfig.pool.idle
	}
});

const db = {};
db.sequelize = sequelize;


module.exports = db;
