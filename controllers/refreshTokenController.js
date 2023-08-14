const usersDB = {
    users: require('../data/auth.json').users,
    setUsers: function (data) {
        this.users = { "users": data }
    }
};

const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || foundUser.login !== decoded.login) return res.sendStatus(403);
        const accessToken = jwt.sign(
            { "login": decoded.login },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        )
        res.json({ accessToken });
    });
}

module.exports = { handleRefreshToken };
