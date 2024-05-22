const router = require('express').Router();
const {Spot} = require('../../db/models');
const {Sequelize} = require('sequelize');
const {Review} = require('../../db/models');
const {SpotImage} = require('../../db/models');
router.get('/', async (req,res,next)=>{
    try{
        const averages = await Review.findAll({
            attributes:[
                'spotId',
                [Sequelize.fn('AVG',Sequelize.col('stars')),'avgRating']
            ],
            group:'spotId'
        })
        let ratings = []
        for(let a=0;a<averages.length;a++){
            ratings.push(averages[a].dataValues)
        }
        let Spots = []
        for(let a=0;a<ratings.length;a++){
            let object = ratings[a]
            let spot = await Spot.findByPk(object.spotId)
            spot.dataValues.avgRating = object.avgRating
            Spots.push(spot.dataValues)
        }
        for(let a=0;a<Spots.length;a++){
            let spotId = Spots[a].id
            let image = await SpotImage.findAll({
                where:{
                    spotId:spotId,
                    preview:true
                }
            })
            if(image.length)Spots[a].previewImage=(image[0].dataValues.url)
          
        }
        // console.log(Spots)
    return res.json({Spots})
    // get the average from all reviews
    }catch(error){
        next(error)
    }
})

module.exports = router