const csc = require('country-state-city');
const redis = require('../../main').redis;
const centralMedicineDB = require('../../models/centralMedicineDB');
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
}
exports.searchBarSeller = async(req,res,next)=>{
    const reqData = req.body.medicineName; 
    if(String(reqData).length<3){
        return;
    }
    const cachedProducts = await redis.get('medicineSuggestions');
    if(cachedProducts && cachedProducts.length>=1){
        //for now I will be returning entire product details which should not be the case, and it shall be like only required data should be passed so that seller can list his product
        const desiredProducts = cachedProducts.filter(item=> String(item.nameOfMedicine).toLowerCase().includes(reqData.toLowerCase()));
        if(desiredProducts.length!=0){
            return res.status(200).json({
                success:true,
                data: desiredProducts,
                message:'TMC',
            });
        }
    }
    let suggestions = await centralMedicineDB.find({name:{$regex:new RegExp(reqData,'i')}}).limit(10);
    if(!suggestions){
        return res.status(400).json({
            success:false,
            message:'Failed to fetch data from Database',
            data:[],
        });
    }
    suggestions = suggestions.map(item=> {
        return {
            nameOfMedicine :  item.name,
            productId : item.productId,
        }
    });
    const searchSuggestions = await redis.set('medicineSuggestions',JSON.stringify(suggestions), {ex:3*60});
    if(!searchSuggestions){
        return res.status(400).json({
            success:false,
            message:'Failed to store data in Memory',
            data:suggestions,
        });
    }
    return res.status(200).json({
        success:true,
        data:suggestions,
        message:'Fetched data successfully',
    });
}