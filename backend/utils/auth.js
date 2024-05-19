// uses three functions to aid in authentication
// import required packages
const jwt = require('jsonwebtoken');
const {jwtConfig} = require('../config');
const {User} = require('../db/models');
const {secret,expiresIn} = jwtConfig

// FUNCTION ONE (setTokenCookie)
// set/send the JWT cookie after a user is logged in or signed up
const setTokenCookie = (res, user) =>{
    // try catch block
    try{
        // create safeUser to be used in token
        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
        };
        // create token
        const token = jwt.sign(
            {data: safeUser},
            secret,
            {expiresIn: parseInt(expiresIn)}
        );
        // check environment
        const isProduction = process.env.NODE_ENV === 'production'
        // set the token cookie
        res.cookie('token',token,{
            maxAge: expiresIn * 1000,
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction && 'Lax'
        });
        // return token
        return token;
    // catch errors and foward them
    }catch(error){
        next({
            'message':'error with setTokenCookie Function in backend/utils/auth.js'
        })
    }
};

// FUNCTION TWO (restoreUser)
// restore the session user based on contents of the JWT cookie
const restoreUser = (req,res,next)=>{
    
    try{
        // parse token from cookies
        const {token} = req.cookies;
        req.user = null;
        // verify JWT token
        return jwt.verify(token, secret, null, async (err, jwtPayload)=>{
            // if error continue to next middleware
            if(err){
                return next();
            }
            // try catch block
            try{
                // deconstruct id from jwtPayload
                const {id} = jwtPayload.data;
                // query for user by id
                req.user = await User.findByPk(id,{
                    // select attributes email, createdAt and updatedAt
                    attributes:{
                        include: ['email','createdAt','updatedAt']
                    }
                });
            // catch errors
            }catch(error){
                // if error clear cookie token
                res.clearCookie('token')
                return next();
            }
            // if no req.user clear cookie token (?Question?: does a user get a cookie if not log/signed in?)
            if(!req.user) res.clearCookie('token');
            // return next
            return next();
        })
    // catch errors for debugging later
    }catch(error){
        // send message about error with function
        next({
            'message':"error with restoreUser function from backend/utils/auth.js"
        })
    }
};

// FUNCTION THREE (requireAuth)
// authenticate a user before accessing a route (if there is no current user, return an error)
const requireAuth = function(req,_res,next){
    // try catch block
    try{
        // check for user
        if(req.user) return next();
        // if no user create and return new error
        const error = new Error('Authentication required');
        // add title
        error.title = 'Authentication required';
        // add errors
        error.errors = {message: 'Authentication required'};
        // add status (authentication error 401)
        error.status = 401;
        // forward error
        return next(error);
    // catch errors 
    }catch(error){
        // forware error
        next({
            'message':'error in requireAuth function from backend/utils/auth.js'
        })
    }
};

// export functions
module.exports = {
    setTokenCookie,
    restoreUser,
    requireAuth
};