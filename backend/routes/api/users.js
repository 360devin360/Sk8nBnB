//import required packages
const express = require('express');
const bcrypt = require('bcryptjs');
const {setTokenCookie} = require('../../utils/auth');
const {User} = require('../../db/models');
const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');

//initialize router
const router = express.Router();

// middleware ------------------------------------------------------
const validateSignup = [
    check('email')
        .exists({checkFalsy:true})
        .withMessage('Invalid Email')
        .isEmail()
        .withMessage('Invalid Email'),
    check('username')
        .exists({checkFalsy:true})
        .withMessage('Username is required')
        .isLength({min:3})
        .withMessage('Username Must Be Longer Than 3 Characters'),
    check('firstName')
        .exists({checkFalsy:true})
        .withMessage('First Name is required')
        .isLength({min:3})
        .withMessage('First Name Must Be Longer Than 3 Characters')
        .not()
        .isEmail()
        .withMessage('First Name is required'),
    check('lastName')
        .exists({checkFalsy:true})
        .withMessage('Last Name is required')
        .isLength({min:3})
        .withMessage('Last Name Must Be Longer Than 3 Characters'),
    handleValidationErrors
];

// Routes --------------------------------------------------------------------

// Sign Up Users
router.post('/', validateSignup, async (req,res,next)=>{
    // try block
    try{
        // deconstruct req.body
        const defaultPassword = 'password'
        const {email, password, username, firstName, lastName} = req.body;
        // // create a hashed password for user
        let hashedPassword;
        if(password) hashedPassword = bcrypt.hashSync(password);
        else hashedPassword = bcrypt.hashSync(defaultPassword)
        // // create user record in Users table
        const user = await User.create({
            firstName,
            lastName,
            email,
            username,
            hashedPassword
        });
        // create safeUser object for setTokenCookie function
        const safeUser = {
            id:user.id,
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            username:user.username
        };
        // set token cookie
        setTokenCookie(res,safeUser);
        //add firstName and lastName to safeUser
        // return json of user
        return res.json({
            user:safeUser
        });
    // forward any errors not already sent
    }catch(error){
        // let errors = error.toJSON()
        if(error.name==="SequelizeValidationError"){
            let err = {}
            err.title = "ValidationError",
            err.message = error.message
            next(err)
        }
        let err = {}
        err.title = "ValidationError";
        err.message = "User already exists";
        err.errors = {}
        if(error.errors[0].path==='email'){
            err.errors = {"email":"User with that email already exists"}
        }
        if(error.errors[0].path==='username'){
            err.errors = {"email":"User with that username already exists"}
        }
        console.log(error.errors[0].path)
        err.status = 500
        next(err);
    };
});

// export router
module.exports = router;