const jwt = require('jsonwebtoken');

const createToken = (sign, expiresIn = 86400) => jwt.sign(
    sign,
    "secret",
    {
        expiresIn: expiresIn,
    }
);
const verifyToken = (token, callback) => jwt.verify(token, secret, callback);
module.exports = { verifyToken, createToken }