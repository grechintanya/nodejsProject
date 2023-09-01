const Author = require('../models/Author');

const getAllAuthors = async (req, res) => {
    let authors = await Author.find();
    if (!authors) res.status(204).json({ "message": "Authors not found" });
    authors = authors.map(author => {
        const authorObj = Object.assign({}, author._doc, { id: author._id });
        delete authorObj._id;
        return authorObj;
    });
    res.json(authors);
}

module.exports = getAllAuthors;
