'use strict';

const sequelize = require('./index').sequelize;
const {DataTypes} = require('sequelize');
const User = require('./user');

const StandardDetails = sequelize.define('standard_details', {	
	id: {
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},		
	standard: DataTypes.INTEGER,
	percentage: DataTypes.FLOAT,
	remark: DataTypes.STRING,
	is_active: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: true
	},
	created_by: {
		type: DataTypes.INTEGER,
	},
	updated_by: {
		type: DataTypes.INTEGER,
	},
});

User.hasMany(StandardDetails, { foreignKey: 'user_id', as: 'user_standard' });
StandardDetails.belongsTo(User, { foreignKey: 'user_id', as: 'user_standard' });

module.exports = StandardDetails;
	


