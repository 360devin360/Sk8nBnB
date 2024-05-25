const router = require('express').Router();
const {requireAuth} = require('../../utils/auth');
const {handleValidationErrors} = require('../../utils/validation');
const {Review, Sequelize} = require('../../db/models')
const {User} = require('../../db/models')
const {Spot} = require('../../db/models')
const {SpotImage} = require('../../db/models')
const {ReviewImage} = require('../../db/models')

// get all Reviews for current user -----------------------------------------------
// create route handler
router.get('/current',requireAuth,async(req,res,next)=>{
    // return res.json('testing route')
    // get all reviews where current user id equal Reviews.userId
    const Reviews = await Review.findAll({
        // where clause
        where:{
            // where user id's match
            userId:req.user.id
        },
        // include Users, Spots, and review Images info
        include:[{
                // User model
                model:User,
                // only select specific fields
                attributes:[
                    'id',
                    'firstName',
                    'lastName'
                ]
            },{
                // Spots model
                model:Spot,
                // include spot image as previewImage
                include:{
                    // include model SpotImage
                    model:SpotImage,
                    // ommit all fields (to be added next)
                    attributes:[]
                },
                // select attributes for the spot join
                attributes:{
                    // include prieviewImage
                    include:[
                        // use sequelize function
                        [Sequelize.fn('',Sequelize.col('url')),'previewImage']
                        ]
                },
        }]
    })
    res.json({Reviews})
})

module.exports = router