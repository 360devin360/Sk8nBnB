// import required packages
const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
// create a variable to be true if environment is in production or not by checking the env config file
const {environment} = require('./config');
const isProduction = environment === 'production';
// import router routes
const routes = require('./routes');
// initialize the app
const app = express();
// connect morgan for logging info about requests and responses
app.use(morgan('dev'));
// add a cookie and body parser
app.use(cookieParser());
app.use(express.json());
// add Security Middlewares
// enable cors only in development
if(!isProduction){
    app.use(cors());
};
// use helmet to help set headers for better security
app.use(
    helmet.crossOriginResourcePolicy({
        policy:"cross-origin"
    })
);
// set the _csrf token and create a req.csrfToken method
app.use(
    csurf({
        cookie:{
            secure: isProduction,
            samesite: isProduction && "Lax",
            httpOnly: true
        }
    })
);

// connect the routes
app.use(routes);

// export app
module.exports = app;