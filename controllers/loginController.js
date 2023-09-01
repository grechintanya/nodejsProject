const User = require('../models/User');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) return res.status(400).send('Username and password are required');
    const foundUser = await User.findOne({ login: new RegExp(`^${login}$`, 'i') }).exec();
    if (!foundUser) return res.status(401).send('Wrong login!');
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        const accessToken = jwt.sign(
            { "login": foundUser.login },
            process.env.ACCESS_TOKEN_SECRET,
            { 'expiresIn': '30m'}
        );
        const refreshToken = jwt.sign(
            { "login": foundUser.login },
            process.env.REFRESH_TOKEN_SECRET,
            { 'expiresIn': '1d' }
        );
        foundUser.refreshToken = refreshToken;
        await foundUser.save();
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        res.json({ "token": accessToken });
    } else {
        res.status(401).send('Wrong password!');
    }
}

module.exports = { handleLogin };
