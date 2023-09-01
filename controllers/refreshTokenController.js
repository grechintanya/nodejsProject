const User = require('../models/User');

const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    console.log(refreshToken);
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || foundUser.login !== decoded.login) return res.sendStatus(403);
        const accessToken = jwt.sign(
            { "login": decoded.login },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' }
        )
        res.json({ "token": accessToken });
    });
}

module.exports = { handleRefreshToken };
