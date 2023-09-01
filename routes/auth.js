const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const getUserInfo = require('../controllers/userInfoController');
const registerController = require('../controllers/registerController');
const refreshTokenController = require('../controllers/refreshTokenController');
const logoutController = require('../controllers/logoutController');

router.route('/login')
    .post(loginController.handleLogin);

router.route('/userinfo')
    .post(getUserInfo);

router.route('/register')
    .post(registerController.handleNewUser);

router.route('/refresh')
    .get(refreshTokenController.handleRefreshToken);

router.route('/logout')
    .get(logoutController.handleLogout);


module.exports = router;
