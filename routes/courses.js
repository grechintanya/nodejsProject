const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/coursesController');
const verifyID = require('../middleware/verifyId');
const verifyJWT = require('../middleware/verifyJWT');

router.param('id', verifyID);

router.route('/')
    .get(coursesController.getCourses)
    .post(coursesController.createCourse);

router.use(verifyJWT);

router.route('/:id')
    .get(coursesController.getCourseByID)
    .patch(coursesController.updateCourse)
    .delete(coursesController.deleteCourse)

module.exports = router;
