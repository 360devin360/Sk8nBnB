const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const {environment} = require('./config');
const isProduction = environment === 'production';
const app = express();
const routes = require('./routes');
const {ValidationError} = require('sequelize');

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

// set default-src to self (used for Edge browser)---------------------------
// app.use(
//     helmet.contentSecurityPolicy({
//             defaultSrc:["'self'"],
//             "connect-src":["'self'"]  
//     })
// );
//---------------------------------------------------------------------------
// test route http://localhost:8000
app.get('/',(req,res,next)=>{
  res.json('hello world')
})
//------------------------------------------------------------------------------

if(!isProduction)app.use(cors())

app.use(
    helmet.crossOriginResourcePolicy({
        policy:"cross-origin"
    })
);

app.use(
    csurf({
        cookie:{
            secure:isProduction,
            sameSite:isProduction && "Lax",
            httpOnly:true
        }
    })
);
app.use(routes)

app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = { message: "The requested resource couldn't be found." };
    err.status = 404;
    next(err);
  });

   
app.use((err, _req, res, _next) => {
    // 
    res.status(err.status || 500);
    if(err.title==='ValidationError'){
      return res.json({
          "message":err.message,
          "errors":err.errors
        })
    }
    if(err.title==='Login failed'){
      return res.json({
        "message":err.message
      })
    }
    res.json({
        title: err.title || 'Server Error',
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack
    });
});

module.exports = app;