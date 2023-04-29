exports.sendSms = async (number, message) => {
    /**
     * Sends a text to a phone number using twilio.
     * 
     * @param number The phone number of the receiving user.
     * @param message The text message you will like to send.
     * 
     * @returns null.
     */
    
    const accountSid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    
    const response = await client.messages.create({
        body: message,
        from: '+16204558982',
        to: number
    })
        
    // console.log(response);
}
