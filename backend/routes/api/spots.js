const router = require('express').Router();
const {Spot} = require('../../db/models');
const {Sequelize} = require('sequelize');
const {Review} = require('../../db/models');
const {SpotImage} = require('../../db/models');
const review = require('../../db/models/review');
const {requireAuth} = require('../../utils/auth')

router.get('/current', requireAuth, async(req,res,next)=>{
    try{
        const spots = await Spot.findAll({
            attributes: {
                include:[
                    [Sequelize.fn('AVG',Sequelize.col('Reviews.stars')),'avgRating'],
                    [Sequelize.fn('',Sequelize.col('SpotImages.url')),'previewImage']
                ],
            },
            where:{
                id:req.user.id
            },
            group:['Spot.id'],
            include:[{
                model:Review,
                attributes:[]
            },{
                model:SpotImage,
                attributes:[],
            }]
        })
        res.json({spots})

    }catch(error){
        next(error)
    }
});

router.get('/', async (req,res,next)=>{
    try{
    const spots = await Spot.findAll({
        attributes: {
            include:[
                [Sequelize.fn('AVG',Sequelize.col('Reviews.stars')),'avgRating'],
                [Sequelize.fn('',Sequelize.col('SpotImages.url')),'previewImage']
            ],
        },
        group:['Spot.id'],
        include:[{
            model:Review,
            attributes:[]
        },{
            model:SpotImage,
            attributes:[],
        }]
    })
    res.json({spots})
    }catch(error){
        next(error)
    }
})


module.exports = router