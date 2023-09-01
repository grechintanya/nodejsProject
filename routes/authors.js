const express = require('express');
const router = express.Router();
const getAllAuthors = require('../controllers/authorsController');

router.route('/').get(getAllAuthors)

module.exports = router;
