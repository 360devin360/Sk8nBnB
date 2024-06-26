const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { environment } = require('./config');
const isProduction = environment === 'production';
const app = express();
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
const routes = require('./routes');
const {ValidationError} = require('sequelize');


// test route http://localhost:8000
// app.get('/',(req,res,next)=>{
//   res.json('hello world')
// })


//----------------------------------------------------------------------------------------------------------------------------------------------------


// Security Middleware
if (!isProduction) {
  // enable cors only in development
  app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
  })
);

// Set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true
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
    // console.log(err)
    res.status(err.status || 500);
    // if(err instanceof ValidationError){

    // }
    if(err.status === 500){
      return res.json({
        'message':err.message,
        "errors":err.errors
      })
    }
    if(err.title === 'ValidationError'){
      return res.json({
          "message":err.message,
          "errors":err.errors
        })
    }
    if(err.title==='Login failed'){
      console.log(err)
      return res.json({
        "message":err.message
      })
    }
    if(err.title === 'Authentication required'){
      return res.json({
        "message":err.message
      })
    }
    if(err.title === 'Resource not found'){
      return res.json({
        "message":err.message
      })
    }
    if(err.title === 'Unauthorized User'){
      return res.json({
        "message":err.message
      })
    }
    if(err.name==='SequelizeUniqueConstraintError'){
      let errors = {}
      err.errors.forEach(object=>{
        errors[object.path] = object.message
      })
      return res.json({
        "message":err.message,
        "errors":errors
      })
    }
    if(err.title==='Duplicated Data'){
      return res.json({
        message:err.message
      })
    }
    if(err.title==='Database Limit'){
      return res.json({
        message:err.message
      })
    }
    if(err.title === 'Invalid Data'){
      return res.json({
        message:err.message
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