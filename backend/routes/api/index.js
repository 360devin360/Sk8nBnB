// require the express package and create an express router
const router = require('express').Router();

// test routes

router.post('/test',(req,res)=>{
    res.json({requestBody: req.body})
})


// export the router
module.exports = router;
