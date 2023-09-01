const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Author = require('./Author');

const courseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isTopRated: {
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    length: {
        type: Number,
        required: true
    },
    authors: [
        {type: mongoose.Types.ObjectId, ref: 'Author'}
    ]
});

module.exports = mongoose.model('Course', courseSchema);
