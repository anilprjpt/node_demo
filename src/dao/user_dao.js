'use strict';

const { Sequelize, Op, Model } = require("sequelize");
const sequelize = new Sequelize("mysql::memory:");

const User = require('../models/user');
const StandardDetails = require('../models/standard_details');

const userDetails={	
	verifyStudent: async data => {
		return User.findAll({
			attributes: ['id', 'name', 'email', 'roll_number', 'current_standard', 'last_login', 'is_active', 'token', 'password'],
			where: {
				email: data.email,
			},
		}).catch(console.error);
	},
	updateToken: async (user_id, token) => {
		return User.update(
			{
				token: token, last_login: sequelize.literal('CURRENT_TIMESTAMP')
			},
			{
			where: {
				id: user_id,
			},
		}).catch(console.error)
	},	
	verifyUser: async (token, user_id) => {
		return User.findAll({
			attributes: ['id', 'name', 'email', 'roll_number', 'current_standard', 'last_login', 'is_active', 'token', 'password'],
			where: {
				token: token, 
				id: user_id
			},
		}).catch(console.error)},
	resetAuthToken:async (user_id)=>{
		return User.update(
			{
				token: null,last_login: sequelize.literal('CURRENT_TIMESTAMP')
			},
			{where: {
					id: user_id,
				},
			}).catch(console.error)
	},
	checkAlreadyRegister: async (data) => {		
		return User.count({
			where: {
				[Op.or]: [
					{ email: data.email },
					{ roll_number: data.roll_number }
				]
			}
		}).catch(console.error);
	},
	addStudentDetails: async (data) => {
		return User.create(data).catch(console.error);
	},
	addBulkStandard: async data => {
		return StandardDetails.bulkCreate(data).catch(console.error);
	},	
	getStandardDetails: async user_id => {
		return StandardDetails.findAll({
			attributes:['id', 'standard', 'remark', 'percentage'],
			where: {
				user_id: user_id
			}
		}).catch(console.error);
	},
		

};



module.exports = {userDetails};

