const router = require('express').Router();
const {requireAuth} = require('../../utils/auth');
const {Booking} = require('../../db/models');
const {Spot} = require('../../db/models');
const {SpotImage} = require('../../db/models');
const {Op} = require('sequelize');
const {Sequelize} = require('sequelize')
// get all of the current users bookings
router
    .get('/current',requireAuth,async(req,res,next)=>{
        try{

            // get bookings and inlude spot
            const bookings = await Booking.findAll({
                where:{
                    userId:req.user.id
                },
                include:{
                    model:Spot,
                    attributes:{
                        include:[
                            [Sequelize.fn('',Sequelize.col('url')),'previewImage']
                        ],
                        exclude:[
                            'createdAt',
                            'updatedAt',
                            'description'
                        ]
                    },
                    include:{
                        model:SpotImage,
                        attributes:[]
                    }
                }
            });
            // iterated over bookings and reconstruct returnable result
            let Bookings = []
            bookings.forEach(value=>{
                let booking = value.toJSON()
                let {id,spotId,Spot,userId,startDate,endDate,createdAt,updatedAt} = booking
                Bookings.push({
                    id,
                    spotId,
                    Spot,
                    userId,
                    startDate,
                    endDate,
                    createdAt,
                    updatedAt
                })
            })
            res.json({Bookings})
        }catch(error){
            next(error)
        }
    })

module.exports = router