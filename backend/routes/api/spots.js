const router = require('express').Router();
const {Spot} = require('../../db/models');
const {Sequelize} = require('sequelize');
const {Review} = require('../../db/models');
const {SpotImage} = require('../../db/models');
const {requireAuth} = require('../../utils/auth')
const {User} = require('../../db/models')

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
                ownerId:req.user.id
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

router.get('/:spotId',async (req,res,next)=>{
    try{
        const spots = await Spot.findAll({
            attributes: {
                include:[
                    [Sequelize.fn('AVG',Sequelize.col('Reviews.stars')),'avgRating'],
                ],
            },
            where:{
                id:req.params.spotId
            },
            group:['Spot.id'],
            include:[{
                model:Review,
                attributes:[]
            },{
                model:SpotImage,
                attributes:[
                    'id',
                    'url',
                    'preview'
                ],
            },{
                model:User,
                attributes:[
                    'id',
                    'firstName',
                    'lastName'
                ]
            }]
        })
        res.json({spots})
    }catch(error){
        next(error)
    }
})

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