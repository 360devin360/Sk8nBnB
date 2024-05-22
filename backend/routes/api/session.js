// import packages
const express = require('express');
const {Op} =require('sequelize');
const bcrypt = require('bcryptjs');
const {setTokenCookie, restoreUser} = require('../../utils/auth');
const {User} = require('../../db/models');
const {check} = require('express-validator');
const {handleValidationErrors} = require('../../utils/validation');


// initialize a router
const router = express.Router();

// middleware ------------------------------------------------

// check for credential and password
const validateLogin = [
        check('credential')
            .exists({checkFalsy: true})
            .withMessage('Email or username is required'),
        check('password')
            .exists({checkFalsy:true})
            .withMessage('Password is required'),
        handleValidationErrors
];

// route handlers----------------------------------------

// Log in
router.post('/', validateLogin , async (req,res,next)=>{
    //try catch
    try{
        // deconstruct req.body
        const {credential, password} = req.body;
        // query for user where credential is email or password and 
        const user = await User.unscoped().findOne({
            where:{
                [Op.or]:{
                    username:credential,
                    email:credential
                }
            }
        });
        // if no User has that username or email
        // or if the password is incorrect
        // throw error
        if(!user || !bcrypt.compareSync(password, user.hashedPassword.toString())){
            const err = new Error('Invalid credentials');
            err.status = 401;
            err.title = 'Login failed';
            err.errors = {credential: 'The provided credentials were invalid'}
            return next(err);
        };
        // create safeUser object
        const safeUser = {
            id: user.id,
            firstName:user.firstName,
            lastName:user.lastName,
            email: user.email,
            username: user.username,
        };
        // use setTokenCookie
        await setTokenCookie(res, safeUser);
        // add firstName and lastName to user

        // return user
        return res.json({
            user:safeUser
        });
    //catch and forward errors
    }catch(error){
        next({
            'message':"log in error location POST backend/routes/api/session.js"
        });
    };
});

// log out
router.delete('/',(_req,res,next)=>{
    // try catch
    try{
        // use clearCookie to clear cookie token
        res.clearCookie('token');
        // return message
        return res.json({
            "message":'success'
        });
    // forward errors
    }catch(Error){
        next({
            "message":"log out route failure DELETE backend/routes/api/session.js"
        });
    };
});

// get session user
router.get('/', (req,res,next)=>{
    // try catch
    try{
        // deconstruct req for user info
        const {user} = req;
        // if there is a user create a safeUser object to send in response
        if(user){
            const safeUser = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
            };
            // return json object safeUser
            return res.json({
                user: safeUser
            });
        // if no req.user (current user)    
        }else{
            return res.json({user: null})
        }
    }catch(error){
        next(error)
    }
})

//export router
module.exports = router;