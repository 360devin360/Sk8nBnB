// import required packages
// import express
const express = require('express');
// require async error handler package for express
require('express-async-errors');
// require security features
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
// require cookie parser
const cookieParser = require('cookie-parser');
// sequelize error handler
const {ValidationError} = require('sequelize');
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
        policy:"cross-origin",
    }),
    
);

//---------------------------------------------------------------------
// trying to get microsoft edge to run this app.
// error says violation: connect-src was not explicitly set, so default src is used
// try to set the connectSrc to self below not working from co-pilot
app.use(helmet.contentSecurityPolicy({
    directives:{
        connectSrc:["'self'"]
    }
}));
// --------------------------------------------------

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

// resource not found middleware (catch unhandled requests and forward them to error handler)
app.use((_req,_res,next)=>{
    // create a new error and assign it to a new variable
    const err = new Error("The requested resource couldn't by found.");
    // add title property to the new variable with value "Resource Not Found"
    err.title = "Resource Not Found";
    // add errors property to err with a key of "message" equal to "The requested resource not found"
    err.errors = {
        message: "The requested resource couldn't be found"
    };
    // add a status property equal to 404
    err.status = 404;
    // send err to next error handler
    next(err)
});

// Process sequelize errors
app.use((err,_req,_res,next)=>{
    // check if error is a Sequelize error
    if(err instanceof ValidationError){
        // create a new object called errors
        let errors = {};
        // iterate over err.errors
        for(let error of err.errors){
            // create a new property "error.path" equal to error.message
            errors[error.path] = error.message;
        };
        // create a title property equal to "Validation error"
        err.title = 'Validation error';
        // create an errors property for err equal to errors
        err.errors = errors;
    }
    next(err);
});

// Error formatter Error-Handler
app.use((err,_req,res,_next)=>{
    // assign the status to response equal to err.status or 500
    res.status(err.status || 500);
    // log error to console
    console.error(err)
    // responsd with a json object that has title, message, errors and stack properties
    res.json({
        title:err.title || 'Server Error',
        message: err.message,
        errors:err.errors,
        stack:isProduction ? null : err.stack
    })
})
// export app
module.exports = app;