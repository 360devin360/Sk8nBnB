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
                    startDate:startDate.toISOString().split('T').join(' ').slice(0,-5),
                    endDate:endDate.toISOString().split('T').join(' ').slice(0,-5),
                    createdAt:createdAt.toISOString().split('T').join(' ').slice(0,-5),
                    updatedAt:updatedAt.toISOString().split('T').join(' ').slice(0,-5),
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
            if(booking.userId !== req.user.id){
                let err = {
                    "title":"Unauthorized User",
                    "message":"Forbidden"
                }
                throw err
            }
            // deconstruc booking for start and end date
            let {startDate,endDate} = booking
            // if requested start date comes after requested end date throw error
            if(req.body.startDate > req.body.endDate){
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
                // create error
                let err = {
                    // set status code
                    status:403,
                    // set title
                    title:"Invalid Data",
                    // set message
                    message:"Past bookings can't be modified"
                }
                // throw error
                throw err
            }
            // check bookings for interfering dates
            const bookings = await Booking.findAll({
                // where
                where:{
                    // spotId equals booking.spotId
                    spotId:booking.spotId,
                    // use operator to combind startdate and enddate check at the same time
                    [Op.and]:{
                        // start date must be less than query end date
                        startDate:{
                            [Op.lt]:req.body.endDate
                        },
                        // end date must be after query startdate
                        endDate:{
                            [Op.gt]:req.body.startDate
                        }
                    } 
                }
            })
            // through error if booking interferes with other bookings
            bookings.forEach(value=>{
                // deconstruct value
                let booking = value.toJSON()
                // create err
                let err = {
                    // add title
                    "title":'ValidationError',
                    // add status
                    "status":403,
                    // add message
                    "message":"Sorry, this spot is already booked for the specified dates",
                    // add errors
                    "errors":{}
                }
                // if start date is less than request end date send message for start date
                if(booking.startDate<new Date(req.body.endDate)){
                    err.errors.startDate = "Start date conflicts with an existing booking"
                }
                // if end date is less than request start date send message for end date
                if(booking.endDate>new Date(req.body.startDate)){
                    err.errors.endDate = "End date conflicts with an existing booking"
                }
                // forward err
                throw err
            })
            // update booking
            booking.startDate = req.body.startDate;
            booking.endDate = req.body.endDate
            // save booking
            booking.save()
            let bookingValues = {}
            bookingValues.id = booking.id
            bookingValues.spotId=booking.spotId
            bookingValues.userId = booking.userId
            bookingValues.startDate = booking.startDate.toISOString().split('T').join(' ').slice(0,-5)
            bookingValues.endDate = booking.endDate.toISOString().split('T').join(' ').slice(0,-5)
            bookingValues.createdAt = booking.createdAt.toISOString().split('T').join(' ').slice(0,-5)
            bookingValues.updatedAt = booking.updatedAt.toISOString().split('T').join(' ').slice(0,-5)
            // respond with info
            res.json(bookingValues)
        // catch and forward errors
        }catch(error){
            next(error)
        }
    })
    // delete a booking
    .delete('/:bookingId',requireAuth,async(req,res,next)=>{
        try{
            // get booking based on id
            const booking = await Booking.findByPk(req.params.bookingId)
            // check if booking exists and if it doesnt send error
            if(!booking){
                // create error
                let err = {
                    title:"Resource not found",
                    status:404,
                    message:"Booking couldn't be found",
                }
                // forward err
                throw err
            }
            // booking must belong to user
            if(booking.userId!== req.user.id){
                // create error
                let err = {
                    title:'Unauthorized User',
                    message:"Forbidden"
                }
                throw err
            }
            // chekc if date is between start and end date of booking (current booking)
            if(booking.startDate <= new Date() && booking.endDate >= new Date()){
                // throw error (cannot delete current booking)
                let err = {
                    status:403,
                    title:"Invalid Data",
                    message:"Bookings that have been started can't be deleted"
                }
                throw err
            }
            booking.destroy()
            res.json({
                "message":"Successfully deleted"
            })
        }catch(error){
            next(error)
        }
    })
module.exports = router