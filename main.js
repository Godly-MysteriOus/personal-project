const fs = require('fs');
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
const localStorageKey = require('./LocalStorageKey');
const app = express();
const cors = require('cors');


const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

// body parsers and ejs engines
app.use(bodyParser.urlencoded({extended:false}));
app.set('view engine', 'ejs');
app.set('views', 'views');
const store = new MongoDBStore({
    uri: dbURI.DB_Connections.DEV_URI,
    collection: 'sessions'
});
app.use(cors());
// app.use(cors({
//     origin: 'http://localhost:5500', // Replace with your front-end URL
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true // Allow cookies if necessary
// }));
// app.use(helmet());
app.use(compression());
// const accessLogs = fs.createWriteStream(path.join(__dirname,'logs',`${new Date().toISOString().split('T')[0]}`),{flags:'a'});
// app.use(morgan('combined',{stream:accessLogs}));
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
            .catch((err)=>console.log('Failed to find seller from session Id',err.stack));
        }
    }
});
app.use((req,res,next)=>{
    res.locals.url = credential.hostURI;
    res.locals.googleMapKey = credential.googleMapAPIKey,
    res.locals.localStorageKey = localStorageKey;
    next();
})
app.use(express.json());
const signupRoutes = require('./routes/authRoutes/signup');
const loginLogoutDeleteRoutes = require('./routes/authRoutes/login&logout');
const featureRoutes = require('./routes/additionalRoutes/featureRoutes');
const utilRoutes = require('./routes/additionalRoutes/utilRoutes');
const sellerRoutes = require('./routes/sellerRoutes/sellerRoutes');
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
app.use((req,res,next)=>{
    res.send('<h1>Page not found</h1>')
})


connectionProvider.devDBConnection(app,process.env.PORT||8080);

// module.exports = require('@vercel/node')(app);