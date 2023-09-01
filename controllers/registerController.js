const User = require('../models/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { login, password, name } = req.body;
    if (!login || !password) return res.status(400).send('Username and password are required');
    const duplicate = await User.findOne({ login }).exec();
    if (duplicate) return res.status(409).send(`The username ${login} already exists`);
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ 'login': login, 'password': hashedPassword, name });
        res.status(201).json({"message": `New user ${login} is created!`})
    } catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports = { handleNewUser };
