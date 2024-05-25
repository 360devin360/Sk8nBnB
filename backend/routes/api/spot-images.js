const router = require('express').Router();
const {requireAuth} = require('../../utils/auth');
const {SpotImage} = require('../../db/models');
const {Spot} = require('../../db/models');
const {Sequelize} = require('sequelize');
// requires authentication
// requires authorization
router.delete('/:imageId', requireAuth, async (req,res,next)=>{
    try{
        // get image
        const imageToDelete = await SpotImage.findByPk(req.params.imageId,{
            attributes:{
                include:[
                    [Sequelize.fn('',Sequelize.col('Spot.ownerId')),'ownerId']
                ]
            },
            group:[['Spot.ownerId'],['SpotImages.id']],
            include:[{
                model:Spot,
                attributes:[]
            }]
        })
        // if not image send error
        if(!imageToDelete){
            let err = {}
            err.title = 'Resource not found'
            err.status = 404
            err.message = "Spot Image couldn't be found"
            throw err
        }
        // query for spot based on spotId from imageToDelete
        const spot = await Spot.findByPk(imageToDelete.spotId)

        // check owner id to user id
        if(req.user.id !== spot.ownerId){
            let err = {}
            err.title = 'Unauthorized User'
            err.status = 403
            err.message = "Forbidden"
            throw err
        }
        
        return res.json({
            "message":"Successfully deleted"
        })
    }catch(error){
        next(error)
    }
})

module.exports = router