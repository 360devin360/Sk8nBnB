const router = require('express').Router();
const {requireAuth} = require('../../utils/auth')

router.get('/current',requireAuth,async (req,res,next)=>{
    res.json('hello')
})

module.exports = router;
