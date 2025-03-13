require('dotenv').config({path:'./credential.env'});

module.exports = {
    //connection URI
    devURI:process.env.devURI,
    testURI:process.env.testURI,
    prodURI:process.env.prodURI,
    hostURI:process.env.hostURI,

    //email API key
    emailAPI_key:process.env.emailAPI_KEY,
    
    //google map API key
    googleMapAPIKey:process.env.googleMapAPIKey,

    //cloudinary image storage API keys
    cloudinaryCloudName:process.env.cloudinary_cloud_name,
    cloudinaryApiKey:process.env.cloudinary_api_key,
    cloudinaryApiSecret : process.env.cloudinary_api_secret,

    //upstash redis key
    upstashRedisUrl : process.env.UPSTASH_REDIS_REST_URL,
    upstashRedisToken : process.env.UPSTASH_REDIS_REST_TOKEN,
    fast2SMS_apiKey: process.env.FAST2SMS_API_KEY,
    twilioAuthToken : process.env.TWILIO_AUTH_TOKEN,
    twilioAccountSID : process.env.TWILIO_ACCOUNT_SID,
    twilioMobileNumber: process.env.TWILIO_NUMBER,
    plivoAuthKey: process.envPLIVO_AUTH_KEY,
    plivoAuthToken : process.env.PLIVO_AUTH_TOKEN,
    
}