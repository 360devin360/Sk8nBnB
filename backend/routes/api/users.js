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
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({checkFalsy:true})
        .isLength({min:4})
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email'),
    check('password')
        .exists({checkFalsy:true})
        .isLength({min:6})
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

// Routes --------------------------------------------------------------------

// Sign Up Users
router.post('/', validateSignup, async (req,res,next)=>{
    // try block
    try{
        // deconstruct req.body
        const {email, password, username,firstName,lastName} = req.body;
        // // create a hashed password for user 
        const hashedPassword = bcrypt.hashSync(password);
        // // create user record in Users table
        const user = await User.create({
            email,
            username,
            firstName,
            lastName,
            hashedPassword
        });
        // create safeUser object for setTokenCookie function
        const safeUser = {
            id:user.id,
            email:user.email,
            username:user.username
        };
        // set token cookie
        await setTokenCookie(res,safeUser);
        //add firstName and lastName to safeUser
        safeUser.firstName = firstName
        safeUser.lastName = lastName
        // return json of user
        return res.json({
            user:safeUser
        });
    // forward any errors not already sent
    }catch(error){
        next(error)
    };
});

// export router
module.exports = router;