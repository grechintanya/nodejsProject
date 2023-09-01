const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getUserInfo = async (req, res) => {
    const accessToken = req.body?.token;
    if (!accessToken) return res.sendStatus(401);
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.sendStatus(403);
        const foundUser = await User.findOne({ login: decoded.login }).exec();
        if (!foundUser) res.sendStatus(403);
        const user = {
            login: foundUser.login,
            name: {
                first: foundUser?.name?.first,
                last: foundUser?.name?.last
            },
            token: accessToken
        };
        res.json(user);
    })
};

module.exports = getUserInfo;
