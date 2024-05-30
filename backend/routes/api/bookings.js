const router = require('express').Router();
const {requireAuth} = require('../../utils/auth');
const {Booking} = require('../../db/models');
const {Spot} = require('../../db/models');
const {SpotImage} = require('../../db/models');
const {Op} = require('sequelize');
const {Sequelize} = require('sequelize')
router
    // get bookings for current user --------------------------------------------------------------- get bookings for current user
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
    // edit a booking ------------------------------------------------------------------------------- edit a booking
    .put('/:bookingId',requireAuth,async(req,res,next)=>{
        try{
            // get booking based on booking id
            const booking = await Booking.findByPk(req.params.bookingId,{
                where:{
                    userId:req.user.id
                }
            })

            // check if booking exists
            if(!booking){
                // create err
                let err = {
                    // add status
                    status:404,
                    // add title
                    title:"Resource not found",
                    // add message
                    message:"Booking could'nt be found",
                }
                // send error to error handler
                throw err
            }
            // deconstruc booking for start and end date
            let {startDate,endDate} = booking
            // if requested start date comes after requested end date throw error
            if(req.query.startDate > req.query.endDate){
                // create error
                let err = {
                    // add status code
                    status:400,
                    // add title
                    title:"ValidationError",
                    // add message
                    message:"Bad Request",
                    // add errors
                    errors:{
                        "endDate":"endDate cannot come before startDate"
                    }
                }
                // send response
                throw err
            }
            // if endDate is before today send error
            if(endDate < new Date()){
                let err = {
                    status:403,
                    title:"Invalid Data",
                    message:"Past bookings can't be modified"
                }
                throw err
            }
            // check bookings for interfering dates
            const bookings = await Booking.findAll({
                where:{
                    spotId:booking.spotId,
                    [Op.and]:{
                        startDate:{
                            [Op.lt]:req.query.endDate
                        },
                        endDate:{
                            [Op.gt]:req.query.startDate
                        }
                    } 
                }
            })
            // through error if booking interferes with other bookings
            bookings.forEach(value=>{
                let booking = value.toJSON()
                let err = {
                    "title":'ValidationError',
                    "status":403,
                    "message":"Sorry, this spot is already booked for the specified dates",
                    "errors":{}
                }
                if(booking.startDate<new Date(req.query.endDate)){
                    err.errors.startDate = "Start date conflicts with an existing booking"
                }
                if(booking.endDate>new Date(req.query.startDate)){
                    err.errors.endDate = "End date conflicts with an existing booking"
                }
                throw err
            })
            booking.startDate = req.query.startDate;
            booking.endDate = req.query.endDate
            booking.save()
            res.json({booking})
        }catch(error){
            next(error)
        }
    })
module.exports = router