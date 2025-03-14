const getLocation = document.querySelector('.getLocation');
// inputFields
const sellerName = document.querySelector('.sellerName');
const sellerEmail = document.querySelector('.email-input');
const sellerMobileNo = document.querySelector('.mobileNo');
const sellerPassword = document.querySelector('.password');
const confirmPassword = document.querySelector('.confirm-password');
const drugLicenseNumber = document.querySelector('.drugLicenseNumber');
const gstRegistrationNumber = document.querySelector('.gstRegistrationNumber');
const fssaiLicenseNumber = document.querySelector('.fssaiLicenseNumber');
const storeName = document.querySelector('.storeName');
const storeLogo = document.querySelector('.storeLogo');
const headerLogo = document.querySelector('.headerLogoForPdf');
const footerLogo = document.querySelector('.footerLogoForPdf');
const line1Address = document.querySelector('.address-line1');
const line2Address = document.querySelector('.address-line2');
const shopPincode = document.querySelector('.shopPincode');
const shopState = document.querySelector('.shopState');
const shopCity = document.querySelector('.shopCity');
const locationLatitude = document.querySelector('.latitude');
const locationLongitude = document.querySelector('.longitude');
const checkBoxes = document.querySelectorAll('.checkboxes');
//  fetches and places data
sellerName.value = fetchData('sellerName');
sellerEmail.value = fetchData('sellerEmail');
sellerMobileNo.value = fetchData('sellerMobileNo');
drugLicenseNumber.value = fetchData('drugLicenseNumber');
gstRegistrationNumber.value = fetchData('gstRegistrationNumber');
fssaiLicenseNumber.value = fetchData('fssaiLicenseNumber');
storeName.value = fetchData('storeName');
line1Address.value = fetchData('line1Address');
line2Address.value = fetchData('line2Address');
shopPincode.value = fetchData('pincode');
shopState.value = fetchData('shopState');
shopCity.value = fetchData('shopCity');
locationLatitude.value = fetchData('locationLatitude');
locationLongitude.value = fetchData('locationLongitude');

const nameRegex = /^[a-zA-Z ]{2,}$/;
const mobileRegex = /^[1-9][0-9]{9}$/;
const drugLicenseNumberRegex  = /^([0][1-9]|[1-2][0-9]|[3][0-5])([2][0-1](B|C)?)([0-9]{5,6})$/;
const gstRegistrationNumberRegex = /^([0][1-9]|[1-3][0-9])[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z][Z][A-Z0-9]$/;
const fssaiLicenseNumberRegex = /^[1-2]([0][1-9]|[1-2][0-9]|3[0-5])[0-9]{4}[1-9][0-9]{5}[1-9]$/;
const addressRegex = /^[a-zA-Z0-9-,/ ]+$/;
// opening hours, closing hours
getLocation.addEventListener('click',()=>{
    try{
        googleMapPopUp();
    }catch(err){
        console.log(err.stack);
    }
})
let move = 1;
const maxMove=5,minMove=1;
const backButton = document.querySelector('.sellerFormBackBtn');
const frontButton = document.querySelector('.sellerFormFrontBtn');
const allPages = document.querySelectorAll('.formView');
backButton.addEventListener('click',async(e)=>{
    if(move>minMove){
        move--;
        if(frontButton.classList.contains('navigationButtonHidden')){
            frontButton.classList.remove('navigationButtonHidden');
        }
        allPages.forEach(item=>item.classList.add('formPageHidden'));
        document.querySelector(`.formView--${move}`).classList.remove('formPageHidden');
    }
    if(move<=minMove){
        backButton.classList.add('navigationButtonHidden');
    }
});

frontButton.addEventListener('click',async(e)=>{
    if(move<maxMove){
        move++;
        if(backButton.classList.contains('navigationButtonHidden')){
            backButton.classList.remove('navigationButtonHidden');
        }   
        allPages.forEach(item=>item.classList.add('formPageHidden'));
        document.querySelector(`.formView--${move}`).classList.remove('formPageHidden');
    }
    if(move>=maxMove){
        frontButton.classList.add('navigationButtonHidden');
    }
});

function googleMapPopUp(){
    const isLocationAllowed = confirm('Enable location access to prioritize your shop for nearby customers.');
    if(isLocationAllowed){
        navigator.geolocation.getCurrentPosition(async position=>{
            const googleUrl = new URL(url+'loadGoogleMap');
            googleUrl.searchParams.append('latitude',position.coords.latitude);
            googleUrl.searchParams.append('longitude',position.coords.longitude);
            window.open(googleUrl,'_blank');
        })
    }
}
function validation(storageName,field,rgx,errorMessage,isRemoveSpace){
    field.addEventListener('blur',()=>{
        let trimmedInput = String(field.value).trim();
        if(isRemoveSpace){
            trimmedInput = trimmedInput.replace(/\s/g,''); 
        }
        const regex = rgx;
        if(!regex.test(trimmedInput)){
            field.value = '';
            messageOperation(errorMessage);
        }
        updateData(storageName,field.value);
    })
}
function messageOperation(errorMessage){
    message.textContent = errorMessage;
    message.classList.remove('message-hidden');
    setTimeout(()=>{
        message.classList.add('message-hidden');
    },3000);
}
//name and store name verification
storeName.addEventListener('blur',()=>{
    const value = String(storeName.value).trim();
    if(!nameRegex.test(value)){
        messageOperation('Name should only contain Alphabets');
    }
    if(value.length<3 || value.length>50){
        messageOperation('Name should be between 3 to 50 characters');
    }
    updateData('storeName',value);
});
sellerName.addEventListener('blur',()=>{
    const value = String(sellerName.value).trim();
    if(!nameRegex.test(value)){
        messageOperation('Name should only contain Alphabets');
    }
    if(value.length<3 || value.length>50){
        messageOperation('Name should be between 3 to 50 characters');
    }
    updateData('sellerName',value);
})
// mobile number verification
validation('sellerMobileNo',sellerMobileNo,mobileRegex,'Mobile number should be 10 digit long',false);
// password verification
sellerPassword.addEventListener('blur',()=>{
    const value = String(sellerPassword.value);
    if(value.length<=8){
        messageOperation('Password must be 8 characters long');
    }else if(value.indexOf(' ')!=-1){
        messageOperation('Password must not contain space character');
    }else if(! (/[A-Z]+/.test(value)) ){
        messageOperation('Password must contain atleast 1 Upper case letter');
    }else if( !(/[a-z]+/.test(value)) ){
        messageOperation('Password must contain atleast 1 lower case letter');
    }else if(!(/[0-9]+/.test(value))){
        messageOperation('Password must contain atleast 1 numeric character');
    }else if(!(/[^a-zA-Z0-9]+/.test(value))){
        messageOperation('Password must contain atleast 1 special character');
    }else if(value.length>25){
        messageOperation('Password must be less than 25 characters');
    }
});
//confirm-password verification
confirmPassword.addEventListener('blur',()=>{
    if(confirmPassword.value!= sellerPassword.value){
        messageOperation('Password and Confirm Password should be same');
    }
})
//drug license number pattern verification
validation('drugLicenseNumber',drugLicenseNumber,drugLicenseNumberRegex,'Please enter valid Drug License Numeber',true);
//gst registeration number verification
validation('gstRegistrationNumber',gstRegistrationNumber,gstRegistrationNumberRegex,'Please enter a valid GST Registration Number',true);
//fssai number verification
validation('fssaiLicenseNumber',fssaiLicenseNumber,fssaiLicenseNumberRegex,'Please enter valid FSSAI License Number',true);
//address validation
line1Address.addEventListener('blur',(e)=>{
    const value = String(line1Address.value).trim();
    if(!addressRegex.test(value)){
        messageOperation('Only special character allowed is - , / or space');
    }
    updateData('line1Address',value);
});
line2Address.addEventListener('blur',()=>{
    const value = String(line2Address.value).trim();
    if(!addressRegex.test(value)){
        messageOperation('Only special character allowed is - , / or space');
    }
    updateData('line2Address',value);
});
//decide some validation for store timing
sellerEmail.addEventListener('blur',()=>{
    updateData('sellerEmail',sellerEmail.value);
})
//customer signup API
const submitBtn = document.querySelector('.submit');
submitBtn.addEventListener('click',async(e)=>{
    e.preventDefault();
    // throw an alert if required fields are empty
    if(sellerName.value=='' || sellerEmail.value=='' || sellerMobileNo.value=='' || sellerPassword.value==''|| confirmPassword.value == '' || drugLicenseNumber.value==''|| gstRegistrationNumber.value==''|| fssaiLicenseNumber.value==''|| storeName.value=='' || line1Address.value==''|| line2Address.value=='' || pincodeField.value=='' || shopState.value=='' || shopCity.value==''){
        alert('Please fill the mandatory fields');
        return;
    };
    const inputValidation = (data,rgx,message,removeSpace)=>{
        let trimmedData = String(data).trim();
        if(removeSpace){
            trimmedData = trimmedData.replace(/\s/g,'');    
        }
        if(!rgx.test(data)){
            return alert(message);
        }
    }
    // validate inputs sellerName and store Name
    inputValidation(sellerName.value,nameRegex,'Name shall only contain Upper and lower case letters and space',false);
    inputValidation(storeName.value,nameRegex,'Name shall only contain Upper and lower case letters and space',false);
    if(String(sellerName.value).length > 50 || String(sellerName.value).length<3 || String(storeName.value).length > 50 || String(sellerName.value).length<3){
        return alert('Name should be between 3 to 50 characters');
    }
    //email
    if(! /^[a-z0-9]+([\.\-\_][a-z0-9]+)*@[a-z0-9]+(\.[a-z]{2,}){1,3}$/.test(sellerEmail.value)){
        return alert('Invalid Email Pattern');
    }
    //mobile number
    if(! mobileRegex.test(sellerMobileNo.value)){
        return alert('Please enter valid mobile Number');
    }
    // password
    const password = String(sellerPassword.value);
    if(password.length<=8){
        return alert('Password must be 8 characters long');
    }else if(password.indexOf(' ')!=-1){
        return alert('Password must not contain space character');
    }else if(! (/[A-Z]+/.test(password)) ){
        return alert('Password must contain atleast 1 Upper case letter');
    }else if( !(/[a-z]+/.test(password)) ){
        return alert('Password must contain atleast 1 lower case letter');
    }else if(!(/[0-9]+/.test(password))){
        return alert('Password must contain atleast 1 numeric character');
    }else if(!(/[^a-zA-Z0-9]+/.test(password))){
        return alert('Password must contain atleast 1 special character');
    }else if(password.length>25){
        return alert('Password must be less than 25 characters');
    }
    //confirm password
    if(password!= confirmPassword.value){
        return alert('Password and confirm password values must be same');
    }
    // drug license number
    inputValidation(drugLicenseNumber.value,drugLicenseNumberRegex,'Invalid Drug License Number',true);
    //gst registration number
    inputValidation(gstRegistrationNumber.value,gstRegistrationNumberRegex,'Invalid GST Registration number format',true);
    // fssai code
    inputValidation(fssaiLicenseNumber.value,fssaiLicenseNumberRegex,'Invalid FSSAI Number',true);
    inputValidation(line1Address.value,addressRegex,'Address can only contain, - / special characters',false);
    inputValidation(line2Address.value,addressRegex,'Address can only contain, - / special characters',false);
    //pincode
    if(String(pincodeField.value).length!=6){
        return alert('Pincode must be Numeric and 6 character long');
    }
    if(shopState.value==''|| shopCity.value==''){
        return alert('Invalid pincode, please enter valid pincode');
    }
    let trueCount = 0;
    const dayTime = document.querySelector('.dayTime');
    let openInfo = String('');
    checkBoxes.forEach(item=>{
        if(item.checked==true){
            trueCount++;
            const value = item.getAttribute('value');
            const openTime = document.querySelector(`#openTime-${value}`).value;
            const closeTime = document.querySelector(`#closeTime-${value}`).value;
            let data = `${value}&${openTime}&${closeTime}`;
            openInfo+=data+",";
        }
    });
    if(trueCount<=3){
        return alert('Shop should be opened atleast on 3 days');
    }
    dayTime.value = openInfo.substring(0,openInfo.length-1);
    // validate opening hours and closing hours here
    const formData = new FormData();
    formData.append('sellerName',sellerName.value);
    formData.append('sellerEmailId',sellerEmail.value);
    formData.append('sellerMobileNo',sellerMobileNo.value);
    formData.append('sellerPassword',sellerPassword.value);
    formData.append('sellerConfirmPassword',confirmPassword.value);
    formData.append('drugLicenseNumber',drugLicenseNumber.value);
    formData.append('gstRegistrationNumber',gstRegistrationNumber.value);
    formData.append('fssaiLicenseNumber',fssaiLicenseNumber.value);
    formData.append('storeName',storeName.value);
    formData.append('storeLogo',storeLogo.files[0]),
    formData.append('headerLogoForPdf',headerLogo.files[0]);
    formData.append('footerLogoForPdf',footerLogo.files[0]);
    formData.append('line1Address',line1Address.value);
    formData.append('line2Address',line2Address.value);
    formData.append('shopPincode', shopPincode.value);
    formData.append('shopState',shopState.value);
    formData.append('shopCity',shopCity.value);
    formData.append('locationLatitude',locationLatitude.value);
    formData.append('locationLongitude',locationLongitude.value);
    formData.append('activeTime',dayTime.value);
    const response = await fetch(url+'signup/seller',{
        method: 'POST',
        body : formData,
    });
    const result = await response.json();
    if(result.success){
        const time = 5;
        message.classList.remove('message-hidden');
        //comes from localstorage, used to delete sellerData obj stored in local storage
        deleteData();
        const fxn = setInterval(()=>{
            if(time==0){
                clearInterval(fxn);
            }
            message.textContent =  result.message + ` You will be redirect in ${time}sec`;
            time--;
        },1000);
        setTimeout(()=>{
            message.classList.add('message-hidden');
            window.location.href = url+'login';
        },5000)
    }else{
        message.textContent = result.message;
        message.classList.remove('message-hidden');
        setTimeout(()=>{
            message.classList.add('message-hidden');
        },3000);
    }
})