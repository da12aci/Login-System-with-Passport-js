const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStratergy = require('passport-local').Strategy;
const mongo = require('mongodb');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/loginpassport');
const db = mongoose.connection;//db variable set to the mongoose connection

const routes = require('./routes/index');
const users = require('./routes/users');


//Init App
const app = express();

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');//sets view engine to handlebars

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Static Public Folder
app.use(express.static(path.join(__dirname, 'public')));

//Express session
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'secretlogin'
}));

//Passport Init
app.use(passport.initialize());
app.use(passport.session());

//Express Validator
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        let namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

//Connect flash
app.use(flash());

//Global Variables - sets to request.flash.
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');//related to passport.js
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use('/', routes);
app.use('/users', users);

//Set Port Number
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function () {
    console.log('Server started on port ' + app.get('port'));
});

// app.listen(3000 , function(){
//   console.log('listening on port 3000');
// });