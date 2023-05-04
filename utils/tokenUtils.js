const jwt = require("jsonwebtoken");

exports.generateToken = async (plainObj, tokenType) => {
    /**
     * Generates a jwt token of a javascript object using stored secrets.
     * 
     * @param plainObj The javascript object you will like to validate.
     * @param tokenType The type of token you are generating. It can only be one of 'access', 'verification', 'refresh', 'reset'.
     * 
     * @returns A new jwt token.
     */

    const validTokenTypes = ['access', 'verification', 'refresh', 'reset'];
    if (!validTokenTypes.includes(tokenType)) throw Error("'tokenType' must be one of 'access', 'verification', 'refresh', 'reset'");

    const token = await jwt.sign(
        plainObj, 
        tokenType === 'access' ? 
            process.env.ACCESS_TOKEN_SECRET :
        tokenType === 'verification' ?
            process.env.VERIFICATION_TOKEN_SECRET :
        tokenType === 'reset' ?
            process.env.RESET_TOKEN_SECRET :
            process.env.REFRESH_TOKEN_SECRET,
        { 
            expiresIn: tokenType === 'verification' || tokenType === 'reset' ? '2h' : tokenType === 'access' ? '1d' : '7d'
        },
    );

    return token
}

exports.validateToken = (token, tokenType) => {
    /**
     * Validates a jwt token using stored secrets.
     * 
     * @param token The jwt token you will like to validate.
     * @param tokenType The type of token you are generating. It can only be one of 'access', 'verification', 'refresh', 'reset'.
     * 
     * @returns False or The decoded jwt token.
     */

    const validTokenTypes = ['access', 'verification', 'refresh', 'reset'];
    if (!validTokenTypes.includes(tokenType)) return false;

    try {
        // validating the jwt token passed against the token secret
        const validToken = jwt.verify(
            token, 
            tokenType === 'access' ? 
                process.env.ACCESS_TOKEN_SECRET :
            tokenType === 'verification' ?
                process.env.VERIFICATION_TOKEN_SECRET :
            tokenType === 'reset' ?
                process.env.RESET_TOKEN_SECRET :
            process.env.REFRESH_TOKEN_SECRET,
        );
        return validToken;
    } catch (error) {
        return false
    }
}