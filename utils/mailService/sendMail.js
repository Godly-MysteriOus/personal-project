const axios = require('axios');
const apiKey = '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';

exports.sendMail = (emailId,otp)=>{
    const emailData = {
        sender: { email: 'singhrajputjayant8@gmail.com', name: 'Jayant Singh' },  // Replace with your sender details
        to: [{ email: emailId }],  // Replace with recipient's email
        subject: 'Company Name',
        textContent: 'This is a test email sent using Brevo API via axios.',
        htmlContent: 
        `<html>
            <body>
                <h1>Hi User!</h1>
                <p>Your One Time Verification code is <h1>${otp}</h1></p>
                <br><br>
                <h3>This OTP is valid for 5 minutes only, If </h3>
                <br><br> 
                <p>If you didn't sign up on Company Name, Please ignore this message.</p>
            </body>
        </html>`,
    };
    return axios.post('https://api.brevo.com/v3/smtp/email', emailData, {
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        },
    })
    .then((response) => {
    console.log('Email sent successfully:', response.data);
    })
    .catch((error) => {
    console.error('Error sending email:', error.response ? error.response.data : error.message);
    });
}