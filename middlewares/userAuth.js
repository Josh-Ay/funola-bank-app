const jwt = require('jsonwebtoken');
const { InvalidTokens } = require('../models/invalidTokens');


exports.userAuth = async (req, res, next) => {
    const authToken = req.headers['auth-token'];
    if (!authToken) return res.status(401).send('You are not authorized to view this.');

    const tokenIsInvalid = await InvalidTokens.findOne({ token: authToken });
    if (tokenIsInvalid) return res.status(401).send('You are not authorized to view this.');
    
    try {
        const decodedUser = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET);
        req.user = decodedUser;
        // console.log(decodedUser);
        next();
    } catch (error) {
        return res.status(401).send('You are not authorized to view this.');
    }
}