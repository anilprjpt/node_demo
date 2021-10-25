/* eslint-disable no-console */
const express = require('express');
var session = require("express-session");
const app = express();
var cookieParser = require("cookie-parser");
var path = require("path");
const expressSwagger = require('express-swagger-generator')(app);
const constants = require('./src/config/config_detail');
const { encode, decode } = require('./src/utils/utility');
const {check} = require('./src/middleware/auth');
var auth = require('basic-auth');

console.log('we checking the application in the field list of the circle*******************');

app.get('/', (req, res)=> {
	res.redirect('/api');
});
app.get('/api', (req, res) => {	
	var credentials = auth(req);

	// Check credentials
	if (!credentials || !check(credentials.name, credentials.pass)) {
		res.statusCode = 401;
		res.setHeader('WWW-Authenticate', 'Basic realm="User Basic Credential"');
		res.end('Access denied')
	} else {
		res.send(`<html><script>window.location.href = "${constants.swagger_origin}/api-docs#/"</script></html>`)
	}
});

const options = {
	swaggerDefinition: {
		info: {
			description: 'demo APIs',
			title: 'Swagger',
			version: '1.0.0',
		},
		host: constants.base_url,
		basePath: '/',
		produces: ['application/json', 'application/xml'],
		schemes: ['http', 'https'],
		securityDefinitions: {
			JWT: {
				type: 'apiKey',
				in: 'header',
				name: 'Authorization',
				description: '',
			},
		},
	},
	basedir: __dirname, // app absolute path
	files: ['./src/routes/**/*.js', './src/controllers/**/*.js'], // Path to the API handle folder
};
expressSwagger(options);

// handle cors origin
app.use(function (req, res, next) {

	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
});

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// For Sequelize
const db = require('./src/models');
const User = require('./src/models/user');
const StandardDetails = require('./src/models/standard_details');

// for changes in database
// db.sequelize.sync({ alter: true });

app.use(async (req, res, next) => {
	await encode(req);
	global.origin = req.headers.origin;
	next()
});
app.use(async (req, res, next) => {
	// adding validator middleware
	await decode(req);
	next()
});
app.use(express.json({limit: "20mb"}));
app.use(express.urlencoded({
	limit: "20mb",
	extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: "keyboard cat",
	resave: true,
	saveUninitialized: true,
	cookie: { maxAge: 60000000000 }}));


// Other routes
const user_routes = require('./src/routes/user_routes');
app.use('/user', user_routes);
app.use("/static", express.static("public"));


//function created for searching in array
Array.prototype.contains = function(needle)
{
	for (var i in this)
	{
		if (this[i] == needle) return true;
	}
	return false;
};
//function created for searching in array
//holding the error and saving from the crash starts here
process.on("uncaughtException", function (err) {
	console.log(err.stack);
});

module.exports = app;
