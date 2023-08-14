const usersDB = {
    users: require('../data/auth.json').users,
    setUsers: function (data) {
        this.users = { "users": data }
    }
};

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) return res.status(400).json({ 'message': 'Username and password are required' });
    const foundUser = usersDB.users.find(person => person.login === login);
    if (!foundUser) return res.status(401).json({ 'message': 'wrong login!' });
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        const accessToken = jwt.sign(
            { "login": foundUser.login },
            process.env.ACCESS_TOKEN_SECRET,
            { 'expiresIn': '30s' }
        );
        const refreshToken = jwt.sign(
            { "login": foundUser.login },
            process.env.REFRESH_TOKEN_SECRET,
            { 'expiresIn': '1d' }
        );
        //saving refreshToken in DB
        const currentUser = { ...foundUser, refreshToken };
        const otherUsers = usersDB.users.filter(person => person.login !== currentUser.login);
        usersDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(path.join(__dirname, '..', 'data', 'auth.json'), JSON.stringify(usersDB.users));
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ 'success': `User ${login} is logged in!`, accessToken });
    } else {
        res.status(401).json({ 'message': 'Wrong password!' });
    }
}

module.exports = { handleLogin };
