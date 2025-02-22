const {check} = require('express-validator');


exports.priceCheck = (offerPrice)=>{
    return check(offerPrice).custom((val,{req})=>{
        const {originalPrice} = req.body;
        if(Number(val)>Number(originalPrice)){
            throw new Error('Offered Price should not be greater than MRP');
        } 
        return true;
    });
};

exports.quantityCheck = (quantity)=>{
    return check(quantity).custom(val=>{
        console.log(val);
        if(Number(val)<1){
            throw new Error('Quantity cannot be less than 1');
        }
        return true;
    });
};