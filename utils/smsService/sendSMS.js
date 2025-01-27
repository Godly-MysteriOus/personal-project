// const twilio = require('twilio');
// const authToken = '4319bf92fe467b86afbc52adbb9aba9b';
// const accountSid = 'ACd553df19b961b6727870a889a810bc6f';
// const twilioNumber = '+13613154437';
// const client = new twilio(accountSid, authToken);


// exports.sendSMS = (customerMobileNo,otp) =>{
//     return client.messages
//     .create({
//       body: `Your OTP is ${otp}`,          // Message body
//       from: twilioNumber,                // Your Twilio phone number
//       to: '+91'+customerMobileNo,                  // Recipient's mobile number (E.164 format)
//     })
//     .then((message) => console.log(`Message sent with SID: ${message.sid}`))
// }
// const plivo = require('plivo');

// // Replace with your Plivo credentials
// const authId = 'MAZGMZMZQXYTGWZJRKYM';
// const authToken = 'OGVlMmM2OTUxYWFiYWZhY2U4ODMzZGUyNjcxNWJm';

// // Create a Plivo client
// const client = new plivo.Client(authId, authToken);

// // Sending an SMS
// exports.sendSMS = (customerNo, otp) =>{
//   console.log('Here');
//   return client.messages.create(
//     '+1 301-743-0864', // Sender phone number
//     `+91${customerNo}`,  // Receiver phone number
//     `Hi! Your otp is valid for 15 minutes. Your OTP is ${otp}` // Message content
//   ).then(response => {
//     console.log('Message sent successfully:', response);
//   })
// }
const axios = require('axios');

exports.sendSMS = async () => {
    const apiKey = 'axeucHSDE54C287dXARJVbGN9ImFowTqkPfKrLOshl0ZgQyBjtsHu8Z6wXQU2riS9RJ7AOCFK1zvpgLy'; // Replace with your Fast2SMS API Key
    const options = {
      method: 'POST',
      url: 'https://www.fast2sms.com/dev/bulkV2',
      headers: {
        authorization: apiKey, // API Key for authentication
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        route: 'q', // Route type ('q' for transactional, 'p' for promotional)
        sender_id: 'FSTSMS', // Optional: Set your sender ID (requires approval)
        message: 'Hello, this is a test message!', // Message content
        language: 'english', // Language of the SMS
        numbers: '9999999999', // Comma-separated list of phone numbers
      }),
    };

  try {
    const response = await axios(options);
    console.log('SMS Sent Successfully:', response.data);
  } catch (error) {
    console.error('Error Sending SMS:', error.response ? error.response.data : error.message);
  }
};


