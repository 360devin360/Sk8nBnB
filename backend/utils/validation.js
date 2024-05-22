// import required packages from express-validator
const {validationResult} = require('express-validator');

// create a middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req,res,next)=>{

        // save results from validationResult(req) to validationErros
        const validationErrors = validationResult(req);
        // if validationErrors is not empty do...
        if(!validationErrors.isEmpty()){
            let err = {}
            err.title = "ValidationError";
            err.message = "Bad Request";
            err.errors = {}
            validationErrors.errors.forEach(object=>{
                err.errors[object.path] = object.msg
            })
            err.status = 400
            next(err);
        }
        next();
}

// export middleware
module.exports = {
    handleValidationErrors
}