'use strict';
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const randomstring = require('randomstring');
const md5 = require('md5');
const userDao = require('../dao/user_dao').userDetails;
const { response, timeSince } = require('../utils/utility');
const message = require('../utils/message');
const config = require('../config/config_detail');

/**
 * @typedef Login
 * @property {string} email.data.required - enter the email
 * @property {string} password.data.required - enter the password
 */

/**
 * This function will return student details after login
 * @route POST /user/login
 * @group Auth
 * @param {Login.model} Login.body.required - the new point
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

/**
 * @typedef Response
 * @property {integer} status
 * @property {string} message.required - response message
 * @property {data} response data payload
 */

exports.login = async (req, res) => {
	try {
		let responseResult = {};
		let data = req.body;
		let userDetails = await userDao.verifyStudent(data);
		if (userDetails.length) {
			let password = md5(data.password);
			if (password === userDetails[0].password) {
				if (userDetails[0].is_active) {
					let {id} = userDetails[0];
					let random_string = randomstring.generate(14);
					let token_key = `${random_string}|${id}`;
					let jwt_tokens = await jwt.sign({token_key}, config.jwt_key);
					await userDao.updateToken(id, random_string);

					responseResult.user_id = userDetails[0].id;
					responseResult.name = userDetails[0].name;
					responseResult.email = userDetails[0].email;
					responseResult.is_active = userDetails[0].is_active;
					responseResult.roll_number = userDetails[0].roll_number;
					responseResult.current_standard = userDetails[0].current_standard;
					responseResult.last_login=userDetails[0].last_login;
					if(responseResult.last_login){
						let date1 = timeSince(new Date(Date.now()), new Date(responseResult.last_login));
						if (date1.indexOf('1 '))
							date1 = date1 + 's';
						responseResult.last_login= date1;
					}
					return response(res, 200, message.LOGGED_IN, responseResult, jwt_tokens)
				} else {
					return response(res, 400, message.INACTIVE_STUDENT, [], null)
				}
			} else {
				return response(res, 400, message.INVALID_USER_PASSWORD, [], null)
			}
		} else {
			return response(res, 400, message.INVALID_USERNAME, [], null)
		}
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, [], null)
	}
};


/**
 * This function is used to logout the user
 * @route GET /user/logout
 * @security JWT
 * @group Auth
 * @returns {object} 200 - and a message
 * @returns {Error}  default - Unexpected error
 */
exports.logout = async (req, res, app) => {
	try {
		let userObject = req.userObject;
		let resetStatus = await userDao.resetAuthToken(userObject.id);
		if (resetStatus.length) {
			return response(res, 200, message.LOGOUT, [], null)
		} else {
			return response(res, 500, message.DB_ERROR, [], null)
		}
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, [], null)
	}
};


/**
 * @typedef Add_Student
 * @property {string} name.data.required - enter the name
 * @property {integer} roll_number.data.required - enter the roll number
 * @property {string} email.data.required - enter the email 
 * @property {string} password.data.required - enter the password 
 * @property {integer} current_standard.data.required - enter the current standard
 * @property {Array.<Add_Student>} standard_arr.data.required - enter the standard details json as array 
 */

/**
 * This function is used to register student
 * @route Post /user/registerStudent
 * @group Auth
 * @param {Add_Student.model} Add_Student.body.required - the new point
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

/**
 * @typedef Response
 * @property {integer} status
 * @property {string} message.required - response message
 * @property {data} response data payload
 */
 exports.submitStudentDetails = async (req, res) => {
	try {
		let data = req.body;
		if(data.current_standard > 0) {
			if((data.current_standard == 1) || ((data.standard_arr) && (data.current_standard == (((data.standard_arr).length) + 1)))) {
				let checkStudent = await userDao.checkAlreadyRegister(data);
				if(checkStudent == 0) {
					data.created_by = 1;
					let user_password = md5(data.password);
					data.password = user_password;
					let studentDetails = await userDao.addStudentDetails(data);
					if(studentDetails.id) {
						if((!data.standard_arr) || ((data.standard_arr).length < 1)) {
							return response(res, 200, message.STUDENT_ADDED, [], null);
						} else {
							let standardArr = [];
							let i=0;
							data.standard_arr.forEach(async function(item, key) {							
								standardArr.push({user_id: studentDetails.id, standard: item.standard, remark: item.remark, percentage: item.percentage, created_by: 1});							
								i++;
								if(i == (data.standard_arr).length){
									await userDao.addBulkStandard(standardArr);
									return response(res, 200, message.STUDENT_ADDED, [], null);
								}
							});
						}						
					} else {
						return response(res, 500, message.DB_ERROR, [], null)
					}				
				} else {
					return response(res, 201, message.STUDENT_ALREADY_EXIST, [], null);
				}	
			} else {
				return response(res, 201, message.WRONG_STANDARD, [], null);
			}								
		} else {
			return response(res, 201, message.CURRENT_STANDARD, [], null);
		}		
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, [], null)
	}
};



/**
 * This function is used to get student standard details
 * @route GET /user/standardDetails
 * @security JWT
 * @group Auth
 * @returns {object} 200 - and a message
 * @returns {Error}  default - Unexpected error
 */
 exports.getStudentStandardDetails = async (req, res) => {
    try {
		let userObject = req.userObject;
		if(userObject.id) {			
			let standardInfo = await userDao.getStandardDetails(userObject.id);
			return response(res, 200, message.STANDARD_DETAILS, standardInfo, null);
									
		} else {
			return response(res, 201, message.UNAUTHORIZED_USER, [], null);
		}		
	} catch (e) {
		console.log("error===>>>" + e);
		return response(res, 500, message.DB_ERROR, [], null)
	}
};

