const jwt = require('jsonwebtoken');
const { InvalidTokens } = require('../models/invalidTokens');
const { User } = require('../models/user');


exports.userAuth = async (req, res, next) => {
    const authToken = req.headers['auth-token'];
    if (!authToken) return res.status(401).send('Access denied, token invalid or missing.');

    const tokenIsInvalid = await InvalidTokens.findOne({ token: authToken });
    if (tokenIsInvalid) return res.status(401).send('Access denied, token invalid or missing.');
    
    try {
        const decodedUser = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET);

        // checking if the decoded user exists
        const existingUser = await User.findById(decodedUser._id).select('-password -refreshToken -transactionPin');
        if (!existingUser) return res.status(401).send('Access denied, token invalid or missing.');

        req.user = decodedUser;
        // console.log(decodedUser);
        next();
    } catch (error) {
        return res.status(401).send('Access denied, token invalid or missing.');
    }
}