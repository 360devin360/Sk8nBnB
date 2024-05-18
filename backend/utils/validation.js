// import required packages from express-validator
const {validationResult} = require('express-validator');

// create a middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req,res,next)=>{
    // try catch 
    try{
        // save results from validationResult(req) to validationErros
        const validationErrors = validationResult(req);
        // if validationErrors is empty do...
        if(!validationErrors.isEmpty()){
            // create an empty object
            const errors = {};
            // create a validationErrors array and loop through it and send error: error.message to errors object
            validationErrors.array().forEach(error=>{
                // return error.msg to object
                return errors[error] = error.msg
            });
            // create error
            const err = Error("Bad request.");
            err.errors = errors;
            err.status = 400;
            err.title = "Bad request.";
            next(err);
        }
        next();
    }catch(error){
        console.log('error in backend/utils/validation.js')
        console.log(error)
        next(error)
    }
}

// export middleware
module.exports = {
    handleValidationErrors
}