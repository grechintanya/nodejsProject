const Course = require('../models/Course');

const getCourses = async (req, res) => {
    let { sort, start, count, textFragment } = req.query;
    start = parseInt(start);
    count = parseInt(count);
    if (!start || start < 0) start = 0;
    if (!count || count < 0) count = undefined;
    const sample = new RegExp(textFragment, 'i');
    let courses = await Course.find({ $or: [{ name: { $regex: sample } }, { description: { $regex: sample } }] })
        .sort(`-${sort}`)
        .skip(start).limit(count)
        .populate('authors');
    if (!courses) res.status(204).json({ "message": "Courses not found" });
    courses = courses.map(course => {
        const courseObj = Object.assign({}, course._doc, { id: course._id });
        delete courseObj._id;
        return courseObj;
    });
    res.json(courses);
}

const createCourse = async (req, res) => {
    try {
        const newCourse = req.body;
        let authors = req.body.authors;
        if (!authors) res.status(400).json({ "message": "authors are required!" });
        authors = authors.map(author => author.id);
        newCourse.authors = authors;
        const savedCourse = await Course.create(newCourse);
        res.status(201).json({ "course": savedCourse });
    } catch (err) {
        console.log(err);
        res.status(500).json({ "message": err.message })
    }
};

const getCourseByID = async (req, res) => {
    try {
        const id = req.params.id;
        const course = await Course.findOne({ _id: id }).exec();
        if (!course) return res.status(400).json({ "message": `Course with id ${id} not found` });
        res.json({ "course": course });
    } catch (err) {
        console.log(err);
        res.status(500).json({ "message": err.message });
    }

};

const updateCourse = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedCourse = req.body;
        updatedCourse.authors = updatedCourse.authors.map(author => author.id);
        const result = await Course.updateOne({_id: id}, updatedCourse);
        if (result.modifiedCount) return res.status(200).json(updatedCourse);
        if (!result.matchedCount) return res.status(400).json({ "message": `Course with id ${id} not found` });
        if (result.matchedCount && !result.modifiedCount) return res.sendStatus(204);
    } catch (err) {
        console.log(err);
        res.status(500).json({ "message": err.message });
    }

};

const deleteCourse = async (req, res) => {
    try {
        const id = req.params.id;
        const course = await Course.findOne({ _id: id }).exec();
        if (!course) return res.status(400).json({ "message": `Course with id ${id} not found` });
        await course.deleteOne({ _id: id })
        res.json({ "message": "Course has been deleted" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ "message": err.message });
    }

};

module.exports = { getCourses, createCourse, getCourseByID, updateCourse, deleteCourse }
