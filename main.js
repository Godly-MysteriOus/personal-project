const connectionProvider = require('./utils/Connection');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const userDB =require('./models/userRegisterationDB');
const sellerDB = require('./models/medicalShopRegistrationDB');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const dbURI = require('./utils/Connection');
const flash = require('connect-flash');
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
app.use(flash());
app.use(express.json());
const signupRoutes = require('./routes/authRoutes/signup');
const loginLogoutDeleteRoutes = require('./routes/authRoutes/login&logout');

app.use(express.static(path.join(__dirname,'public')));
app.use('/signup',signupRoutes);
app.use(loginLogoutDeleteRoutes);
app.use('/',(req,res,next)=>{
//    const errorMessage = req.flash('error');
//     res.render('Login/loginSignup',{message:errorMessage});
    return res.redirect('/login');
});


connectionProvider.devDBConnection(app,3100);