const router = require('express').Router();
const {requireAuth} = require('../../utils/auth');
const {Review, sequelize} = require('../../db/models');
const {ReviewImage} = require('../../db/models');
const {User} = require('../../db/models');
const {Spot} = require('../../db/models');
const {SpotImage} = require('../../db/models');
const {Sequelize, and} = require('sequelize')

// get reviews for current
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
                },
           }]
        })
        // get preview images for spot
        const previewImage = await SpotImage.findAll()
        // creat empty object for images
        let previewImages = {}
        // iterate over previewImages
        previewImage.forEach(value=>{
            // create variable and assign it value to json
            let image = value.toJSON()
            // add image url to object
            previewImages[image.spotId] = image.url
        })
        // get all reviewImages
        const images = await ReviewImage.findAll()
        // create empty object
        let imageToReview = {}
        // iterate over images
        images.forEach(value=>{
            // create json for value
            let image = value.toJSON();
            // create another empty object
            let refinedImage = {}
            // add image id and url to object
            refinedImage.id = image.id
            refinedImage.url = image.url
            // if first object doesnt have key with reviewId add it with image as value in array
            if(!imageToReview[image.reviewId]){
                imageToReview[image.reviewId] = [refinedImage]
            // else push up image to array for reviewId
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
            //  if previewImages has key with reviewId add it
            if(previewImages[review.spotId]){
                // create key value for final object previewImage
                review.Spot.previewImage = previewImages[review.spotId]
            }
            // create array for reviewImages
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

router.get('')
module.exports = router;
