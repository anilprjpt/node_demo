/** Sample settings */

const allowedHost = {
	'http://localhost:6000': true,
	'http://localhost:7357': true,
}

exports.allowCrossDomain = function(req, res, next) {
	if (allowedHost[req.headers.origin]) {
		res.header('Access-Control-Allow-Credentials', true)
		res.header('Access-Control-Allow-Origin', req.headers.origin)
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
		res.header(
			'Access-Control-Allow-Headers',
			'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
		);
		// intercept OPTIONS method
		if (req.method === 'OPTIONS') {
			res.send(200)
		} else {
			next()
		}
	} else {
		res.send(403, { auth: false })
	}
};