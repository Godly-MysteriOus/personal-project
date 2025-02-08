const csc = require('country-state-city');
const {check} = require('express-validator');

exports.getAllStatesOfIndia = (req,res,next)=>{
    try{
        const states = csc.State.getStatesOfCountry("IN");
    
        const requiredStateDetails = states.map(item=>({
            stateName:item.name,
            stateCode:item.isoCode,
        }));
        return res.status(200).json({
            success:true,
            message:'Successfully fetched states of India',
            data: requiredStateDetails,
        });
    }catch(err){
        console.log('Error While fetching states of india',err);
        return res.status(200).json({
            success:false,
            message:err.message,
        });
    }
};

exports.getAllCitiesOfState = (req,res,next)=>{
    const {stateCode} = req.body; 
    try{
        const cities = csc.City.getCitiesOfState('IN',stateCode);
        const requiredCityDetail = cities.map(item=>({
            cityName:item.name,
        }));
        return res.status(200).json({
            success:true,
            message:'Successfully fetched city of State',
            data : requiredCityDetail,
        })
    }catch(err){
        console.log('Error while fetching the city of state ',err);
        return res.status(200).json({
            success:false,
            message:err.message,
        });
    }

}

exports.getPincodeValidation= async(req,res,next)=>{
    const { pincode } = req.body;
    let response;
    try{
        response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`,{
            method:'GET',
            headers:{ 'Content-Type': 'application/json' },
        });
        const result = await response.json();
        const requiredData = {
            state : result[0]["PostOffice"][0].State,
            city :  result[0]["PostOffice"][0].District,
        };
        console.log(requiredData);
        return res.status(200).json({
            success:true,
            message:'Fetched data',
            data : requiredData,
        });
    }catch(err){
        console.log('Error while fetching Pincode details');
        return res.status(400).json({
            success:false,
            message:'Error while fetching Pincode details',
        });
    }
    // try{
    //     const data = response.data;
    //     if(data.length==0){
    //         throw new Error('Invalid pincode');
    //     }
    //     const cscData = csc.State.getStateByCodeAndCountry(stateCode, 'IN');
    //     console.log(cscData);
    //     const stateNameFromPostalApi = String(data.State);
    //     const stateNameFromCSC = String(cscData.name);
    //     if(stateNameFromCSC.toLowerCase()!=stateNameFromPostalApi.toLowerCase()){
    //         throw new Error('Pincode Does not exists within the given state');
    //     }
    //     return res.status(200).json({
    //         success:false,
    //         message:'Valid pincode',
    //     });
    // }catch(err){
    //     console.log('Invalid pincode or pincode does not exists in given state');
    //     return res.status(400).json({
    //         success:false,
    //         message:err.message,
    //     })
    // }
    
}