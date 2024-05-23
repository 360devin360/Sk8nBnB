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
        .isEmail()
        .withMessage('Invalid Email'),
    check('username')
        .exists({checkFalsy:true})
        .isLength({min:1})
        .withMessage('Username is required'),
    check('firstName')
        .exists({checkFalsy:true})
        .not()
        .isEmail()
        .withMessage('FirstName is required'),
    check('lastName')
        .exists({checkFalsy:true})
        .isLength({min:1})
        .withMessage('Last Name is required'),
    handleValidationErrors
];

// Routes --------------------------------------------------------------------

// Sign Up Users
router.post('/', validateSignup, async (req,res,next)=>{
    // try block
    try{
        // deconstruct req.body
        const defaultPassword = 'password'
        const {email, password, username,firstName,lastName} = req.body;
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
        await setTokenCookie(res,safeUser);
        //add firstName and lastName to safeUser
        // return json of user
        return res.json({
            user:safeUser
        });
    // forward any errors not already sent
    }catch(error){
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