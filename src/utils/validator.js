const { validationResult } = require('express-validator');

function validate(req, res, next) {
	const error = validationResult(req);
	console.log("validate===>"+error);
	if (!error.isEmpty()) res.status(401).json(error);
	else next();
}


module.exports = validate;
