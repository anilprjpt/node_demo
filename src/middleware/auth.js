const jwt = require('jsonwebtoken');
const config = require('../config/config_detail');
const message = require('../utils/message');
const userDao = require('../dao/user_dao').userDetails;
const { response} = require('../utils/utility');
var compare = require('tsscmp');

// Basic function to validate credentials for example
function check (name, pass) {
	var valid = true;
	// Simple method to prevent short-circut and use timing-safe compare
	valid = compare(name, config.basic_username) && valid;
	valid = compare(pass, config.basic_password) && valid;

	return valid
}

verifyToken = (req, res, next) => {
	if (!req.headers.authorization) {
		return res.status(400).send({
			status: 400,
			message: "No token provided!",
			data: {}
		});
	}
	else {
		let token = req.headers["authorization"].split(' ')[1];
		jwt.verify(token, config.jwt_key, (err, decoded) => {
			if (err) {
				return response(res, 401, message.INVALID_TOKEN, [], null)
			}
			else {
				//now have to check if the token matches the user token or not
				let token_key= decoded["token_key"].split("|");
				let user_id= token_key[token_key.length-1];
				console.log(token_key+"=="+user_id);
				userDao.verifyUser(token_key, user_id)
					.then(result => {
						if (result.length) {
							req.userObject=result[0];
							next();
						}else{
							return response(res, 401, message.INVALID_STUDENT, {}, null)

						}
					}).catch(err => {
						console.log("verifyToken==>"+err);
						return response(res, 500, message.DB_ERROR, [], null)
					});
			}
		});
	}
};



const authJwt = {
	verifyToken: verifyToken,
	check:check
};
module.exports = authJwt;
