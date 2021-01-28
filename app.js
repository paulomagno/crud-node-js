// Express
const express = require('express');

// Template Engine
const mustache = require('mustache-express');

// Flash Messages
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');

// Autentication Libraries
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;


// Routes, Helpers and  Error Handlers
const router  = require('./routes/index');
const helpers = require('./helpers');
const errorHandler = require('./handlers/errorHandler')

// Settings App
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Define public folder
app.use(express.static(__dirname + '/public'));

// Settings flash messages
app.use(cookieParser(process.env.SECRET));
app.use(session({
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized:false,
}));

app.use(flash());

// Settings Passport
app.use(passport.initialize());
app.use(passport.session());

// Settings helpers and flash messages global
app.use((req,res,next) => {
    res.locals.h = {...helpers};
    res.locals.flashes = req.flash();
    res.locals.user = req.user;

    // Filter menu Authenticated 
    if(req.isAuthenticated()) {
        res.locals.h.menus = res.locals.h.menus.filter(i => i.logged); 
    }
     // Filter menu not Authenticated 
    else {
        res.locals.h.menus = res.locals.h.menus.filter(i=> i.guest); 
    }

    next();
});

const User = require('./models/User');
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Settings Router and error handler
app.use('/',router);
app.use(errorHandler.notFound);

// Settings Library Mustache (Template Engine)
app.engine('mst',mustache(__dirname+'/views/partials','.mst'));
app.set('view engine','mst');
app.set('views',__dirname + '/views');

module.exports = app;