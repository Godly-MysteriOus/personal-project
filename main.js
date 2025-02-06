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
const cors = require('cors');
app.use(bodyParser.urlencoded({extended:false}));
app.set('view engine', 'ejs');
app.set('views', 'views');
const store = new MongoDBStore({
    uri: dbURI.DB_Connections.DEV_URI,
    collection: 'sessions'
});
app.use(cors({
    origin: 'http://localhost:5500', // Replace with your front-end URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Allow cookies if necessary
}));
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);
app.use((req,res,next)=>{
    if(!req.session.user || !req.session.credentials){
        return next();
    }else{
        if(req.session.user.roleId==1){
            userDB.findById(req.session.user._id)
            .then(result=>{
                req.user = result; 
                next();
            })
            .catch(()=>console.log('Failed to find user from session Id'));
        }else if(req.session.user.roleId==2){
            sellerDB.findById(req.session.user._id)
            .then(result=>{
                req.user = result; 
                next();
            })
            .catch(()=>console.log('Failed to find user from session Id'));
        }
    }
    next();
})
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
app.use(express.static(path.join(__dirname,'public')));
app.use('/signup',signupRoutes);
app.use(loginLogoutDeleteRoutes);
app.use('/utils',utilRoutes);
app.use(featureRoutes);
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