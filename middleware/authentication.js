const express = require('express');
const router = express.Router();

exports.sellerAuthentication = (req,res,next)=>{
    if(req.session.isAuthenticationAsSeller && req.session.roleId==2){
        next();
    }else{
        res.status(401).redirect('/login');
    }
};

exports.customerAuthentication = (req,res,next)=>{
    if(req.session.isAuthenticatedAsCustomer && req.session.roleId == 1){
        next();
    }else{
        res.status(401).redirect('/login');
    }
};

exports.adminAuthentication = (req,res,next)=>{
    if(req.session.isAuthenticatedAsAdmin && req.session.roleId == 3){
        next();
    }else{
        res.status(401).redirect('/login');
    }
}