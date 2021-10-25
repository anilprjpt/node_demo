const CryptoJS = require('crypto-js');
const { jwt_key, swagger_origin, encrypt_key} = require('../config/config_detail');
const message = require('./message');

exports.response = (res, status, message, result, token) => {
	let response;
	if (token == null) {
		response = {
			status,
			message,
			data: result,
		}
	} else {
		response = {
			status,
			message,
			data: result,
			authToken: token,
		}
	}
	if (global.origin == swagger_origin || global.origin == undefined) {
		return res.json(response )
	}
	response = CryptoJS.AES.encrypt(JSON.stringify(response), encrypt_key).toString();
	return res.json({ 'res': response });
};

// Decode Request
exports.decode = req => {
	if (Object.keys(req.body).length != 0) {
		// Decrypt
		const bytes = CryptoJS.AES.decrypt(req.body.data, encrypt_key);
		req.body = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
		console.log("body=="+JSON.stringify(req.body));
		return req;
	}
	return req;
};

// Encode Response
exports.encode = req => {
	if (Object.keys(req.body).length != 0) {
		console.log("$$$$headers",req.headers.origin);
		if (req.headers.origin == swagger_origin) {
			// means the request is coming from swagger and req.body only
			// Encrypt the req and send the encoded data in data
			req.body.data = CryptoJS.AES.encrypt(JSON.stringify(req.body), encrypt_key).toString()
			console.log(req.body);
			return req;
		}
		return req;
	}
	return req;
};

exports.timeSince = function (current, previous) {
	if (current && previous) {
		var msPerMinute = 60 * 1000;
		var msPerHour = msPerMinute * 60;
		var msPerDay = msPerHour * 24;
		var msPerWeek = msPerDay * 7;
		var msPerMonth = msPerDay * 30;
		var msPerYear = msPerDay * 365;

		var elapsed = current - previous;

		if (elapsed < msPerMinute) {
			return Math.round(elapsed / 1000) + ' second';
		}

		else if (elapsed < msPerHour) {
			return Math.round(elapsed / msPerMinute) + ' minute';
		}

		else if (elapsed < msPerDay) {
			return Math.round(elapsed / msPerHour) + ' hour';
		}

		else if (elapsed < msPerWeek) {
			return Math.round(elapsed / msPerDay) + ' day';
		}

		else if (elapsed < msPerMonth) {
			return Math.round(elapsed / msPerWeek) + ' week';
		}

		else if (elapsed < msPerYear) {
			return Math.round(elapsed / msPerMonth) + ' month';
		}

		else {
			return Math.round(elapsed / msPerYear) + ' year';
		}
	} else
		return null;
}//[End timeSince]



