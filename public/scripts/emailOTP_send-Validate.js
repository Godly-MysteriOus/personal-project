const message = document.querySelector('.message');
const sendEmailOTPBtn = document.querySelector('.sentEmailOTP');
const emailIdField = document.querySelector('.email');
const emailOTPValidationView = document.querySelector('.emailOTPVerification-space');
const emailOtp = document.querySelector('.emailOtp');
const verifyEmailOTP = document.querySelector('.verifyEmailOTP');
const regex = /^[a-z0-9]+([\.\-\_][a-z0-9]+)*@[a-z0-9]+(\.[a-z]{2,})+$/;


sendEmailOTPBtn.addEventListener('click',async(e)=>{
    e.preventDefault();
    //make a call
    const response = await fetch('/signup/generate-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailId: emailIdField.value })
    });
    const result = await response.json();
    // how will a message look
    message.classList.remove('hidden');
    if(result.success){
        emailOTPValidationView.classList.remove('hidden');
        message.textContent = result.message;
        message.style.color = 'green';
        message.style.border = '2px solid green';
    }else{
        emailOTPValidationView.classList.add('hidden');
        message.style.color = 'red';
        message.style.color = '2px solid red';
    }
    sendEmailOTPBtn.setAttribute('disabled',true);
    setTimeout(() => {
        message.classList.add('hidden');
    }, 5000);
    let sec = 10;
    const time = setInterval(()=>{
        console.log(sec);
        sendEmailOTPBtn.textContent =`Resend OTP in ${sec--}s`;
        if(sec==-1){
            sendEmailOTPBtn.textContent = 'Resend OTP';
            sendEmailOTPBtn.removeAttribute('disabled');
            clearInterval(time);
        }
    },1000);
});
verifyEmailOTP.addEventListener('click',async(e)=>{
    e.preventDefault();
    const response = await fetch('/signup/email-otp-validation',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailId: emailIdField.value,emailOtp: emailOtp.value})
    });
    emailOtp.textContent = '';
    const result = await response.json();
    if(result.success){
        emailOTPValidationView.classList.remove('hidden');
        message.classList.remove('hidden');
        message.textContent = result.message;
        message.style.color = 'green';
        message.style.border = '2px solid green';
        const sendOTPButton = document.querySelector('.buttonHolder').classList.add('hidden');
        const greenTick = document.querySelector('.greenTick').classList.remove('hidden');
        emailOTPValidationView.classList.add('hidden');
    }else{
        message.classList.remove('hidden');
        message.textContent =  result.message;
        message.style.color = 'red';
        message.style.color = '2px solid red';

    }
    setTimeout(() => {
        message.classList.add('hidden');
    }, 5000);
})