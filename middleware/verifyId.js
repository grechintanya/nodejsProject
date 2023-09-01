const verifyID = (req, res, next) => {
    const id = req.params.id;
    const sample = /^[0-9a-f]{24}$/i;
    if (!sample.test(id)) return res.status(400).json({"message": "Invalid ID!"});
    next();
};

module.exports = verifyID;
