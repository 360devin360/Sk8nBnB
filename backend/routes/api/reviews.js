const router = require('express').Router();
const {requireAuth} = require('../../utils/auth');
const {Review} = require('../../db/models');
const {ReviewImage} = require('../../db/models');
const {User} = require('../../db/models');
const {Spot} = require('../../db/models');
const {SpotImage} = require('../../db/models');
const {Sequelize, and} = require('sequelize')

router.get('/current',requireAuth,async (req,res,next)=>{
    // get reviews'
    const Reviews = await Review.findAll({
        // where userId = current user id
        where:{
            userId:req.user.id
        },
        // include models User, Spot, SpotImage and ReviewImage
        include:[{
            // Start with User
            model:User,
            // only include id, firstName and lastName
            attributes:[
                'id',
                'firstName',
                'lastName'
            ]
        },{
            // include Spot next
            model:Spot,
            // pick attributes
            include:{
                model:SpotImage,
                attributes:[]
            },
            attributes:{
                // exclude fields createdAt and updatedAt
                exclude:[
                    'createdAt',
                    'updatedAt'
                ],
                // include SpotImages where preview = true then rename previewImages
                include:[
                    // use Sequelize literal
                    [Sequelize.literal(`(SELECT url FROM SpotImages JOIN Spots on SpotImages.spotId = Spots.id and preview = true)`),'previewImage']
                ],
                // raw:true
            },
            // group:["Spot.id"]
        },{
            // include review images
            model:ReviewImage,
            // exclude attributes reviewId, createdAt and updatedAt
            attributes:{
                exclude:[
                    'reviewId',
                    'createdAt',
                    'updatedAt'
                ],
            },
        }],
    })


    res.json({Reviews})

})

module.exports = router;
