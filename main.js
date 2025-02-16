const connectionProvider = require('./utils/Connection');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const userDB =require('./models/userRegisterationDB');
const sellerDB = require('./models/medicalShopRegistrationDB');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const dbURI = require('./utils/Connection');
const credential = require('./config');
const app = express();
// const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:'ds7uhsx2m',
    api_key:'992771752558542',
    api_secret:'1nB5sD3AeK--vHr5D_c6QixjZFo',
});
const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params: async (req,file)=>{
        let folderName = 'productImages';
        if(file.fieldname === 'storeLogo'){
            folderName = 'seller/storeLogo';
        }else if(file.fieldname === 'headerLogoForPdf' || file.fieldname === 'footerLogoForPdf'){
            folderName = 'seller/banner';
        }
        return {
            folder : folderName,
            allowed_formats: ["jpg", "jpeg", "png"],
            public_id: `${file.fieldname}-${Date.now()}-${file.originalname.replace(/\s+/g, '_').split('.')[0]}`
        }
    } 
});
const upload= multer({storage});
module.exports = {upload,cloudinary};
app.use(bodyParser.urlencoded({extended:false}));
app.set('view engine', 'ejs');
app.set('views', 'views');
const store = new MongoDBStore({
    uri: dbURI.DB_Connections.DEV_URI,
    collection: 'sessions'
});
// app.use(cors({
//     origin: 'http://localhost:5500', // Replace with your front-end URL
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true // Allow cookies if necessary
// }));
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);
app.use((req,res,next)=>{
    if(!req.session.isLoggedIn){
        return next();
    }else{
        console.log(req.session.credentials.roleId);
        if(req.session.credentials.roleId==1){
            userDB.
            userDB.findById(req.session.user._id)
            .then(result=>{
                req.user = result; 
                next();
            })
            .catch(()=>console.log('Failed to find user from session Id'));
        }else if(req.session.credentials.roleId==2){
            sellerDB.findOne({_id: req.session.user._id})
            .then(result=>{
                req.user = result; 
                next();
            })
            .catch(()=>console.log('Failed to find user from session Id'));
        }
    }
});
app.use((req,res,next)=>{
    res.locals.url = credential.hostURI;
    res.locals.googleMapKey = credential.googleMapAPIKey,
    next();
})
app.use(express.json());
const signupRoutes = require('./routes/authRoutes/signup');
const loginLogoutDeleteRoutes = require('./routes/authRoutes/login&logout');
const featureRoutes = require('./routes/additionalRoutes/featureRoutes');
const utilRoutes = require('./routes/additionalRoutes/utilRoutes');
const sellerRoutes = require('./routes/sellerRoutes/sellerRoutes');
const { default: mongoose } = require('mongoose');
app.use(express.static(path.join(__dirname,'public')));


app.use('/signup',signupRoutes);
app.use(loginLogoutDeleteRoutes);
app.use('/utils',utilRoutes);
app.use(featureRoutes);
app.use('/seller',sellerRoutes);

app.get('/loadGoogleMap',(req,res,next)=>{
    const {latitude,longitude}=req.query;
    return res.render('utils/GoogleMap',{
        latitude:latitude,
        longitude:longitude,
    });
})
app.use('/',(req,res,next)=>{
   return res.render('Home/home',{
        path: '/homePage',
   });
});


connectionProvider.devDBConnection(app,3100);