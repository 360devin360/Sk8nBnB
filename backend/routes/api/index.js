const router = require('express').Router();
const {setTokenCookie} = require('../../utils/auth.js');
const {User} = require('../../db/models');
const {restoreUser} = require('../../utils/auth.js');
const {requireAuth} = require('../../utils/auth.js');
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const spotImagesRouter = require('./spot-images.js');
const reviewsRouter = require('./reviews.js');
const bookingsRouter = require('./bookings.js')
// use restoreUser before all routes
router.use(restoreUser);

// use imported routers
router.use('/users', usersRouter);
router.use('/session',sessionRouter);
router.use('/spots',spotsRouter);
router.use('/spot-images',spotImagesRouter);
router.use('/reviews',reviewsRouter);
router.use('/bookings',bookingsRouter);

// export of router at bottom of file




// TEST---TEST---TEST---TEST---TEST---TEST----TEST------TEST------TEST-----------------------------------------

// test routes
// XSRF-TOKEN validation
router.post('/test',function(req,res){
    res.json({requestBody:req.body});
});

// setCookieToken function
router.get('/set-token-cookie', async (_req,res)=>{
    //try catch block
    try{
        // find and store user where username = 'Demo-lition'
        const user = await User.findOne({
            where:{
                username: "Demo-lition"
            }
        });
        // use setTokenCookie function
        setTokenCookie(res,user);
        // return user
        return res.json({user:user});
    // catch error
    }catch(error){
        // forward custom message about the error
        next({
            'message':'error with /set-token-cookie in routes/api/index.js'
        })
    }
})

// restoreUser functionality
router.get('/restore-user',(req,res)=>{
    //try catch
    try{
        // return user
        return res.json(req.user)
    // catch errors
    }catch(error){
        // forward custom message
        next({
            'message':'error with /restore-user in routes/api/index.js'
        })
    }
});

// requireAuth middleware
router.get('/require-auth',requireAuth,(req,res)=>{
    // try catch
    try{
        //return user
        return res.json(req.user);
    // catch errors
    }catch(error){
        // forward custom message
        next({
            'message':"error with /require-auth in routes/api/index.js"
        })
    }
});


// export router
module.exports = router;