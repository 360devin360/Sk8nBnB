// create an express router
const express = require('express');
const router = express.Router();
// import the api router
const apiRouter = require('./api');
// use the api router
router.use('/api',apiRouter);
// test route
// router.get('/hello/world',function(req,res){
//     res.cookie('XSRF-TOKEN',req.csrfToken());
//     res.send('Hello World!');
// });

// add route to allow developers to re-set CSRF token cookie XSRF-TOKEN
// add a XSRF-TOKEN cookie
router.get("/api/csrf/restore",(req,res)=>{
    console.log('reset crsfToken')
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN",csrfToken);
    res.status(200).json({
        'XSRF-TOKEN':csrfToken
    });
});

// export the router
module.exports = router