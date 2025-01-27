const csc = require('country-state-city');


exports.getAllStatesOfIndia = ()=>{
    const states = csc.State.getStatesOfCountry("IN");

    const requiredStateDetails = states.map(item=>({
        stateName:item.name,
        stateCode:item.isoCode,
    }));
    return requiredStateDetails;
};

exports.getAllCitiesOfState = (statecode)=>{
    const cities = csc.City.getCitiesOfState('IN',statecode);
    const requiredCityDetail = cities.map(item=>({
        cityName:item.name,
    }));
    return requiredCityDetail;
}

exports.getPincodeValidation= async(stateCode,pincode)=>{
    let response;
    try{
        response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
    }catch(err){
        console.log('Error while fetching Pincode details');
        return false;
    }
    const data = response.data;
    if(data.length==0){
        throw new Error('Invalid pincode');
    }
    const cscData = csc.State.getStateByCodeAndCountry(stateCode, 'IN');
    const stateNameFromPostalApi = String(data.State);
    const stateNameFromCSC = String(cscData.name);
    if(stateNameFromCSC.toLowerCase()!=stateNameFromPostalApi.toLowerCase()){
        throw new Error('Pincode Does not exists within the given state');
    }
    return true;
}