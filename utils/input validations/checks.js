const {check, body} = require('express-validator');
const loginDB = require('../../models/allEntitiesDB');
const csc = require('country-state-city');
exports.mobileNumberValidation = (mobileNoField)=>{
    return check(mobileNoField).bail().custom(value=>{
        if(!/^[1-9][0-9]{9}$/.test(value)){
            throw new Error('Not a valid mobile number');
        }
        return true;
    })
};
exports.emailValidation = (emailId)=>{
    return check(emailId).bail().custom(value=>{
        const regex = /^[a-z0-9]+([\.\-\_][a-z0-9]+)*@[a-z0-9]+(\.[a-z]{2,})+$/;
        if(!regex.test(value)){
            throw new Error('Please enter a valid emailId');
        }
        return true;
    })
};
exports.timeValidation = (time)=>{
    return check(time).bail().custom(val=>{
        const timeRegex  ='^([0-1][0-9]|2[0-3]):([0-5][0-9])$';
        if(!timeRegex.test(time)){
            throw new Error('Invalid Time Format');
        }
    })
}
exports.credentialCheck = (credentialField)=>{
    return check(credentialField).bail().custom(async value=>{
        const mobileRegex = /^[1-9][0-9]{9}$/;
        const emailRegex = /^[a-z0-9]+([\.\-\_][a-z0-9]+)*@[a-z0-9]+(\.[a-z]{2,10})+$/;
        if(mobileRegex.test(Number(value))||emailRegex.test(value)){
            //its a ten digit proper number or a valid email pattern
            const result = await loginDB.findOne({$or:[{emailId:value},{mobileNumber:value}]});
            if(!result){
                throw new Error('Invalid User. Please Signup');
            }
        }else{
            throw new Error('Invalid mobile number or email Pattern');
        }
       return true;
    })
};
exports.passwordValidation = (passwordField)=>{
    return check(passwordField).bail().custom((value)=>{
        let passwordValue = String(value);
        if(passwordValue.startsWith(' ')|| passwordValue.endsWith(' ') || passwordValue.trim().indexOf(' ')!= -1){
            throw new Error('Password should not contain space character');
        }else if(passwordValue.length<=5){
            throw new Error('Password must be 6 characters or long');
        }else if(!/[^a-zA-Z0-9 ]/.test(passwordValue)){
            throw new Error('Password must contain atleast one special character. Ex. $,!,#');
        }else if(!/[0-9]/.test(passwordValue)){
            throw new Error('Password must contain atleast one digit. Ex 0-9');
        }else if(!/[A-Z]/.test(passwordValue)){
            throw new Error('Password must contain atleast one upper case letter Ex. A-Z');
        }
        return true;
    })
};
exports.pincodeValidation = (pincode,state,city)=>{
    return check(pincode).bail().custom(async val=>{
        response = await fetch(`https://api.postalpincode.in/pincode/${val}`,{
            method:'GET',
            headers:{ 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        const requiredData = {
            state : result[0]["PostOffice"][0].State,
            city :  result[0]["PostOffice"][0].District,
        };
        if(!result){
            throw new Error('Invalid pincode for the selected state');
        }
        return stateValidation(state,city,requiredData);
    })
}
stateValidation = (state,city,requiredData)=>{
    return check(state).bail().custom(val=>{
        if(requiredData.state!=val){
            throw new Error('Invalid State Selected');
        }
        return cityValidation(city,requiredData);
    });
};
cityValidation = (city,requiredData)=>{
    return check(city).bail().custom(val=>{
        if(requiredData.city!=val){
            throw new Error('Invalid City Selected');
        }
        return true;
    });
}


exports.nameValidation=(name)=>{
    return check(name).bail().custom(value=>{
        const nameRegex = /^[a-zA-Z]+([ ][a-zA-Z]+){0,3}$/;
        if(!nameRegex.test(value)){
            throw new Error('Name should only contain alphabet or space');
        }
        else if(String(value).length<5 ||  String(value).length>50){
            throw new Error('Name should be between 5 to 50 characters long');
        }
        return true;
    })
};
exports.confirmPassword = (confirmPass)=>{
    return check(confirmPass).bail().custom((value,{req})=>{
        if(value!=req.body.password){
            throw new Error('Password and Confirm Password must be same');
        }
        return true;
    });
}

exports.activeDayTimeValidation = (dayTime)=>{
    return check(dayTime).bail().custom((val,{req})=>{
        const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
        const daysOpen = String(val).split(',');
        daysOpen.forEach(day=>{
            const moreDetail = day.split('&');
            if(!days.find(day=> day==moreDetail[0])){
                throw new Error ('Entered Day Name is Invalid');
            }
            if(!(moreDetail[1].split(':')[0]>=0 && moreDetail[1].split(':')[0]<24) || !(moreDetail[2].split(':')[0]>=0 && moreDetail[2].split(':')[0]<24) ){
                throw new Error('Invalid Hour, please enter hour in 24-Hour format');
            }
            if(!(moreDetail[1].split(':')[1]>=0 && moreDetail[1].split(':')[0]<60) || !(moreDetail[2].split(':')[1]>=0 && moreDetail[2].split(':')[0]<60)){
                throw new Error('Invalid minutes value entered');
            }
        })
        return true;
    })
};

exports.addressValidation = (address)=>{
    return check(address).bail().custom(val=>{
        const regex =  /^[a-zA-Z0-9-,/ ]+$/;
        if(!regex.test(address)){
            throw new Error('Address can only contain, - / special characters');
        }
        return true;
    })
};

exports.imageFileValidation = (file)=>{
    return check(file, `${file} File is required`).bail().custom((value, { req }) => {
        if (!req.files){
            throw new Error(`${file} is required`);
        }; // Ensure file exists
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(req.files[`${file}`][0].mimetype)) {
            throw new Error("Only JPG, PNG, and PDF files are allowed");
        }
        return true;
    })
};

exports.pdfFileValidation = (file)=>{
    return check(file, 'File is required').custom((value, { req }) => {
        if (!req.file){
            throw new Error(`File Required`);
        }; // Ensure file exists
        if (req.file.mimetype!="application/pdf") {
            throw new Error("Only PDF files are allowed");
        }
        return true;
    })
}
exports.dnl = (drugLicenseNumber)=>{
    return check(drugLicenseNumber).bail().custom(val=>{
        const DLNRegex = /^([0][1-9]|[1-2][0-9]|[3][0-5])([2][0-1](B|C)?)([0-9]{5,6})$/;
        if(!DLNRegex.test(val)){
            throw new Error('Invalid Drug Lincense number format');
        }
        return true;
    });
}
exports.gst = (gstRegistrationNumber)=>{
    return check(gstRegistrationNumber).bail().custom(val=>{
        const gstRegex = /^([0][1-9]|[1-3][0-9])[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z][Z][A-Z0-9]$/;
        if(!gstRegex.test(val)){
            throw new Error('Invalid GST Number Format');
        }
        return true;
    });
}
exports.fssai = (fssaiLicenseNumber)=>{
    return check(fssaiLicenseNumber).bail().custom(val=>{
        const fssaiRegex = /^[1-2]([0][1-9]|[1-2][0-9]|3[0-5])[0-9]{2}[0-9]{2}[1-9][0-9]{5}[1-9]$/;
        if(!fssaiRegex.test(val)){
            throw new Error('Invalid FSSAI License Number format');
        }
        return true;
    })
}