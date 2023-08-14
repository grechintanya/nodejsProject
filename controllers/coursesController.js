const { v4: uuid } = require('uuid');
courses = require('../data/courses.json').courses;

const getCourses = (req, res) => {
    res.json(courses);
}

const createCourse = (req, res) => {
    const id = uuid();
    const newCourse = req.body;
    newCourse.id = id;
    courses = [...courses, newCourse];
    res.status(201).json({ "course": newCourse });
};

const getCourseByID = (req, res) => {
    const id = req.params.id;
    const course = courses.find(item => item.id == id);
    if (!course) return res.status(400).json({ "message": `Course with id ${id} not found` });
    res.json({ "course": course });

};

const updateCourse = (req, res) => {
    const id = req.params.id;
    const course = courses.find(item => item.id == id);
    if (!course) return res.status(400).json({ "message": `Course with id ${id} not found` });
    courses = courses.map(item => {
        if (item.id == id) return req.body;
        else return item;
    });
    res.json({ "course": course });
};

const deleteCourse = (req, res) => {
    const id = req.params.id;
    const course = courses.find(item => item.id == id);
    if (!course) return res.status(400).json({ "message": `Course with id ${id} not found` });
    courses = courses.filter(item => {
        return item.id != id;
    });
    res.json({ "message": "Course has been deleted" });
}

module.exports = { getCourses, createCourse, getCourseByID, updateCourse, deleteCourse }
