//import required packages
const express = require('express');
const bcrypt = require('bcryptjs');
const {setTokenCookie} = require('../../utils/auth');
const {User} = require('../../db/models');

//initialize router
const router = express.Router();

// Sign Up Users
router.post('/', async (req,res,next)=>{
    // try block
    try{
        // deconstruct req.body
        const {email, password, username} = req.body;
        // // create a hashed password for user 
        const hashedPassword = bcrypt.hashSync(password);
        // // create user record in Users table
        const user = await User.create({
            email,
            username,
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