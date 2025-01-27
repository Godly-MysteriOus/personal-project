const {check} = require('express-validator');
const utilAPIs = require('../../utils/apiCalls/apis');
const loginDB = require('../../models/allEntitiesDB');
exports.mobileNumberValidation = (mobileNoField)=>{
    return check(mobileNoField).custom(value=>{
        if(!/^[1-9][0-9]{9}$/.test(value)){
            throw new Error('Not a valid mobile number');
        }
        return true;
    })
};
exports.emailValidation = (emailId)=>{
    return check(emailId).custom(value=>{
        const regex = /^[a-z0-9]+([\.\-\_][a-z0-9]+)*@[a-z0-9]+(\.[a-z]{2,})+$/;
        if(!regex.test(value)){
            throw new Error('Please enter a valid emailId');
        }
        return true;
    })
};
exports.timeValidation = (time)=>{
    return check(time).custom(val=>{
        const timeRegex  ='^([0-1][0-9]|2[0-3]):([0-5][0-9])$';
        if(!timeRegex.test(time)){
            throw new Error('Invalid Time Format');
        }
    })
}
exports.credentialCheck = (credentialField)=>{
    return check(credentialField).custom(async value=>{
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
    return check(passwordField).custom((value)=>{
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
exports.addressValidation_stateCityPincode = (state,city,pincode)=>{
    return check(state).custom(val=>{
       const stateData = utilAPIs.getAllStatesOfIndia();
        if(!stateData.some(item=>item.stateCode==val)){
            throw new Error('Invalid State Selected');
        }
        return addressValidation_city(val,city,pincode);
    });
};
addressValidation_city = (stateCode,city,pincode)=>{
    return check(city).custom(val=>{
        const citiesData = utilAPIs.getAllCitiesOfState(stateCode);
        if(!citiesData.some(item=>item.cityName==val)){
            throw new Error('Invalid City Selected');
        }
        return pincodeValidation(pincode);
    });
}
pincodeValidation = (stateCode,pincode)=>{
    return check(pincode).custom(async val=>{
        const result = await utilAPIs.getPincodeValidation(state,pincode);
        if(!result){
            throw new Error('Invalid pincode for the selected state');
        }
        return true;
    })
}

exports.nameValidation=(name)=>{
    return check(name).custom(value=>{
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
    return check(confirmPass).custom((value,{req})=>{
        console.log('We are here');
        console.log(value,req.body.password);
        if(value!=req.body.password){
            throw new Error('Password and Confirm Password must be same');
        }
        return true;
    });
}