const router = require('express').Router()
const {requireAuth} = require('../../utils/auth');
const {ReviewImage} = require('../../db/models');
const {Review} = require('../../db/models')

router
    .delete('/:imageId',requireAuth, async(req,res,next)=>{
        try{
            // get image based on image id
            const image = await ReviewImage.findByPk(req.params.imageId)
            // if no image send error
            if(!image){
                // create err
                let err = {
                    //set title
                    title:"Resource not found",
                    // set message
                    message:"Review Image couldn't be found",
                    // set status
                    status:404
                }
                // throw err
                throw err
            }
            // check if user owns review beloning to image
            const review = await Review.findByPk(image.reviewId)
            // check if review belongs to user
            if(review.userId!==req.user.id){
                // create error
                let err = {
                    // add title
                    title:"Unauthorized User",
                    // add message
                    message:"Forbidden",
                    // add status
                    status:403
                }
                // throw error
                throw err
            }
            // send message successful
            image.destroy()
            res.json({
                "message":"Successfully deleted"
            })
        }catch(error){
            next(error)
        }
    })

module.exports = router