'use strict';

const sequelize = require('./index').sequelize;
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {	
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false
	},		
	name: DataTypes.STRING,
	email: { type: DataTypes.STRING, unique: true },
	password: DataTypes.STRING,
	roll_number: DataTypes.INTEGER,
	current_standard: DataTypes.INTEGER,
	token: DataTypes.STRING,
	last_login:DataTypes.DATE,
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

module.exports = User;
	


