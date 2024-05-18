// import packages
const express = require('express');
const {Op} =require('sequelize');
const bcrypt = require('bcryptjs');
const {setTokenCookie, restoreUser} = require('../../utils/auth');
const {User} = require('../../db/models');

// initialize a router
const router = express.Router();

// route handlers

// Log in
router.post('/', async (req,res,next)=>{
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
            const err = new Error('Login failed');
            err.status = 401;
            err.title = 'Login failed';
            err.errors = {credential: 'The provided credentials were invalid'}
            return next(err); 
        };
        // create safeUser object
        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
        };
        // use setTokenCookie
        await setTokenCookie(res, safeUser);
        
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
        // let cookie = document.cookie.split(';')
        console.log(res.cookie.token)
        res.clearCookie('token');
        // console.log(document.cookie)
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
                email: user.email,
                username: user.username
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
        console.log('cannot get session user info. Error at GET route/api/session')
        next(error)
    }
})

//export router
module.exports = router;