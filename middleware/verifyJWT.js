const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    let authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    authHeader = authHeader.replace('Bearer ', '');
    jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log(err);
            if (err.name === 'TokenExpiredError') return res.sendStatus(401);
            return res.sendStatus(403);
        }
        req.user = decoded.login;
        next();
    })
};

module.exports = verifyJWT;
