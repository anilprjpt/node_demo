const router = require('express').Router();
const {check, validationResult} = require('express-validator');
const userHandler = require('../controllers/user.js');
const validator = require('../utils/validator');
const authJwt = require("../middleware/auth.js");

router.post('/login',
	[
		check('email').not().isEmpty().isEmail(),
		check('password').not().isEmpty(),
	],
	(req, res, next) => {
		validator(req, res, next)
	},
	(req, res, next) => {
		userHandler.login(req, res)
	});
	
router.get('/logout',
	(req, res, next) => {
		validator(req, res, next)
	}, [authJwt.verifyToken],
	(req, res, next) => {
		userHandler.logout(req, res)
	});

router.post("/registerStudent",
    [
		check('name').not().isEmpty(),
		check('roll_number').not().isEmpty(),
		check('email').not().isEmpty().isEmail(),		
		check('password').not().isEmpty(),
		check('current_standard').not().isEmpty(),
		check('standard_arr').not(),
    ],
    (req, res, next) => {
        validator(req, res, next)
    },
    (req, res, next) => {
        userHandler.submitStudentDetails(req, res)
    });

router.get("/standardDetails",
	(req, res, next) => {
		validator(req, res, next)
	},
	[authJwt.verifyToken],
	(req, res, next) => {
		userHandler.getStudentStandardDetails(req, res)
	});
	
	
module.exports = router;
