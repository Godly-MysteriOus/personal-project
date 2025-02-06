require('dotenv').config({path:'./credential.env'});

module.exports = {
    devURI:process.env.devURI,
    testURI:process.env.testURI,
    prodURI:process.env.prodURI,
    hostURI:process.env.hostURI,
    emailAPI_key:process.env.emailAPI_KEY,
    googleMapAPIKey:process.env.googleMapAPIKey,
}