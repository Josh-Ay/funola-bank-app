const jwt = require('jsonwebtoken');
const { InvalidTokens } = require('../models/invalidTokens');
const { User } = require('../models/user');
const { userKeysToExcludeInMiddleWare } = require('../utils/utils');


exports.userAuth = async (req, res, next) => {
    const authToken = req.signedCookies['accessToken'];
    if (!authToken) return res.status(401).send('Access denied, token invalid or missing.');

    const tokenIsInvalid = await InvalidTokens.findOne({ token: authToken }).lean();
    if (tokenIsInvalid) return res.status(401).send('Access denied, token invalid or missing.');
    
    try {
        const decodedUser = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET);

        // checking if the decoded user exists
        const existingUser = await User.findById(decodedUser._id).lean().select(userKeysToExcludeInMiddleWare);
        if (!existingUser) return res.status(401).send('Access denied, token invalid or missing.');

        const copyOfUser = { ...existingUser };
        delete copyOfUser._id;

        req.user = { _id: existingUser._id.toString(), ...copyOfUser };
        // console.log(decodedUser);
        next();
    } catch (error) {
        
        try {
            const decodedUser = jwt.verify(authToken, process.env.ADMIN_ACCESS_TOKEN_SECRET);

            // checking if the decoded user exists
            const existingUser = await User.findById(decodedUser._id).lean().select(userKeysToExcludeInMiddleWare);
            if (!existingUser) return res.status(401).send('Access denied, token invalid or missing.');

            const copyOfUser = { ...existingUser };
            delete copyOfUser._id;

            req.user = { _id: existingUser._id.toString(), ...copyOfUser };
            // console.log(decodedUser);
            next();

            return
        } catch (error) {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            
            return res.status(401).send('Access denied, token invalid or missing.');
        }
    }
}

exports.adminAuth = async (req, res, next) => {
    const authToken = req.signedCookies['accessToken'];
    if (!authToken) return res.status(401).send('Access denied, token invalid or missing.');

    const tokenIsInvalid = await InvalidTokens.findOne({ token: authToken }).lean();
    if (tokenIsInvalid) return res.status(401).send('Access denied, token invalid or missing.');

    try {
        const decodedUser = jwt.verify(authToken, process.env.ADMIN_ACCESS_TOKEN_SECRET);

        // checking if the decoded user exists
        const existingUser = await User.findById(decodedUser._id).lean().select(userKeysToExcludeInMiddleWare);
        if (!existingUser) return res.status(401).send('Access denied, token invalid or missing.');

        const copyOfUser = { ...existingUser };
        delete copyOfUser._id;

        req.user = { _id: existingUser._id.toString(), ...copyOfUser };
        // console.log(decodedUser);
        next();
    } catch (error) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        
        return res.status(401).send('Access denied, token invalid or missing.');
    }
}