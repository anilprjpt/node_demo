/* eslint-disable no-bitwise */
const dotEnv = require('dotenv');
dotEnv.config();

module.exports = {
	db_host: process.env.DB_HOST,
	db_user_name: process.env.DB_USERNAME,
	db_password: process.env.DB_PASSWORD,
	db_name: process.env.DB_NAME,
	db_dialect: process.env.DB_DIALECT,
	pool: {
		max: process.env.DB_POOL_MAX | 0,
		min: process.env.DB_POOL_MIN | 0,
		acquire: process.env.DB_POOL_ACQUIRE | 0,
		idle: process.env.DB_POOL_IDLE | 0,
	},
	port: process.env.PORT,
	base_url: process.env.BASE_URL,
	env_variable: process.env.NODE_ENV,
	jwt_key: process.env.JWT_KEY,
	swagger_origin: process.env.SWAGGER_ORIGIN,
	encrypt_key: process.env.ENCRYPT_KEY,
	basic_username: process.env.BASIC_USERNAME,
	basic_password: process.env.BASIC_PASSWORD,

}
