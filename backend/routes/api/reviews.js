const router = require('express').Router();
const {requireAuth} = require('../../utils/auth');
const {Review, sequelize} = require('../../db/models');
const {ReviewImage} = require('../../db/models');
const {User} = require('../../db/models');
const {Spot} = require('../../db/models');
const {SpotImage} = require('../../db/models');
const {Sequelize, and} = require('sequelize')

router.get('/current',requireAuth,async (req,res,next)=>{
    // get reviews'
    try{
        // get all reviews by the current user (include user and spot info)
        const reviews = await Review.findAll({
           where:{
            userId:req.user.id
           },
           // include users table
           include:[{
                model:User,
                // get only id, firstName, and lastName from Users
                attributes:[
                    'id',
                    'firstName',
                    'lastName'
                ]
           },{
                // include spot
                model:Spot,
                // get all attributes except createdAt and updatedAt
                attributes:{
                    exclude:[
                        'createdAt',
                        'updatedAt'
                    ],
                    // include SpotImages url as previewImage
                    include:[
                        [Sequelize.literal(`(SELECT url
                                            FROM SpotImages
                                            WHERE preview = true)`),
                                            'previewImage']
                    ]
                },
           }]
        })
        // get all reviewImages
        const images = await ReviewImage.findAll()
        
        let imageToReview = {}
        images.forEach(value=>{
            let image = value.toJSON();
            let refinedImage = {}
            refinedImage.id = image.id
            refinedImage.url = image.url
            if(!imageToReview[image.reviewId]){
                imageToReview[image.reviewId] = [refinedImage]
            }else{
                imageToReview[image.reviewId].push(refinedImage)
            }
        })
        // create new empty Reviews collection
        let Reviews = []
        // iterate over reviews
        reviews.forEach(value=>{
            // deconstruct review
            let review = value.toJSON()
            review.ReviewImages = []
            // add review image based on id of imageToReview (it was the reviewId)
            if(imageToReview[review.id]){
                review.ReviewImages=imageToReview[review.id]
            }
            // push review to Reviews
            Reviews.push(review)

        })
        // return reviews
        return res.json({Reviews})
        
    }catch(error){
        next(error)
    }

})

module.exports = router;
