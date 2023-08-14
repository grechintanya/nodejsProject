const express = require('express');
const router = express.Router();
const { getCourses,
    createCourse,
    getCourseByID,
    updateCourse,
    deleteCourse } = require('../controllers/coursesController');

router.route('/')
    .get(getCourses)
    .post(createCourse);

router.route('/:id')
    .get(getCourseByID)
    .patch(updateCourse)
    .delete(deleteCourse)

module.exports = router;
