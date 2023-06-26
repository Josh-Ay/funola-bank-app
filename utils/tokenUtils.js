const jwt = require("jsonwebtoken");

exports.generateToken = async (plainObj, tokenType) => {
    /**
     * Generates a jwt token of a javascript object using stored secrets.
     * 
     * @param plainObj The javascript object you will like to validate.
     * @param tokenType The type of token you are generating. It can only be one of 'access', 'verification', 'refresh', 'reset'.
     * 
     * @returns An object containing the new jwt token and its expiration time in milliseconds.
     */

    const validTokenTypes = ['access', 'verification', 'refresh', 'reset'];
    if (!validTokenTypes.includes(tokenType)) throw Error(`'tokenType' must be one of ${validTokenTypes.join(', ')}`);

    const expirationTime = tokenType === 'verification' || tokenType === 'reset' ? 
        '2h' : 
        tokenType === 'access' ? 
        '1d' : 
    '7d';
    
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
            expiresIn: expirationTime,
        },
    );

    return { token: token, expirationTime: this.getValueOfTimeStringInMilliSeconds(expirationTime) }
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


exports.getValueOfTimeStringInMilliSeconds = (timeStr) => {
    /**
     * Converts a simple time string to milliseconds.
     * 
     * @param timeStr The string you will like to convert to milliseconds.
     * 
     * @returns The time in milliseconds.
     */

    if (typeof timeStr !== 'string') throw Error("'timeStr' must be a string");
    
    const validUnits = ['d', 'h'];
    const [ value, unit ] = [ timeStr.slice(0, -1), timeStr.toLocaleLowerCase().slice(-1) ];
    
    if (!validUnits.includes(unit)) throw Error(`'timeStr' must include one of these units: ${validUnits.join(', ')}`);

    if (unit === 'd') return value * 24 * 60 * 60 * 1000

    return value * 60 * 60 * 1000
}