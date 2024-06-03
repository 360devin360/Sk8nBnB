// imports ----------------------------------------------------------------------------------------------------------
const router = require('express').Router();
const {Spot} = require('../../db/models');
const {Sequelize} = require('sequelize');
const {Review} = require('../../db/models');
const {ReviewImage} = require('../../db/models');
const {SpotImage} = require('../../db/models');
const {requireAuth} = require('../../utils/auth')
const {User} = require('../../db/models')
const {handleValidationErrors} = require('../../utils/validation');
const {check} = require('express-validator')
const {Op} = require('sequelize');
const {Booking} = require('../../db/models');

// validation checks ------------------------------------------------------------------------------------------------
const validateSpotInfo = [
    check('address')
        .exists({checkFalsy:true})
        .withMessage('Street address is required'),
    check('city')
        .exists({checkFalsy:true})
        .withMessage('City is required'),
    check('state')
        .exists({checkFalsy:true})
        .withMessage('State is required'),
    check('country')
        .exists({checkFalsy:true})
        .withMessage('Country is required'),
    check('lat')
        .exists({checkFalsy:true})
        .withMessage('Latitude is not valid')
        .isFloat()
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({checkFalsy:true})
        .withMessage('Longitude is not valid')
        .isFloat()
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({values:'falsy'})
        .withMessage('Name must be less than 50 characters')
        .isLength({max:50})
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({value:'falsy'})
        .withMessage('Description is required'),
    check('price')
        .exists({options:'falsy'})
        .withMessage('Price per day is required'),
    handleValidationErrors
]
const decimalCheck = [
    check('page')
        .optional({nullable:true})
        .isInt({min:1})
        .withMessage('page must be greater than or equal to 1'),
    check('size')
        .optional({nullable:true})
        .isInt({min:1})
        .withMessage('size must be greater than or equal to 1'),
    check('minLat')
        .optional({nullable:true})
        .isDecimal()
        .withMessage('Minimum latitude is invalid'),
    check('maxLat')
        .optional({nullable:true})
        .isDecimal()
        .withMessage('Maximum latitude is invalid'),
    check('minLng')
        .optional({nullable:true})
        .isDecimal()
        .withMessage('Min Longitude is invalid'),
    check('maxLng')
        .optional({nullable:true})
        .isDecimal()
        .withMessage('Max longitude is invalid'),
    check('minPrice')
        .optional({nullable:true})
        .isFloat({min:0.01})
        .withMessage('Min price must be greater than 0'),
    check('maxPrice')
        .optional({nullable:true})
        .isFloat({min:0.01})
        .withMessage('Maximum price must be greater than or equal to 0'),
    handleValidationErrors
]
const validReviewInfo = [
    check('review')
        .exists({checkFalsy:true})
        .withMessage('Review text is required'),
    check('stars')
        .exists({checkFalsy:true})
        .withMessage("Stars must be an integer from 1 to 5")
        .isInt({min:1,max:5})
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
]
const startDateCheck = [
    check('startDate')
        .exists({checkFalsy:true})
        .withMessage("startDate is required"),
    check('endDate')
        .exists({checkFalsy:true})
        .withMessage("endDate is required"),
    handleValidationErrors
]
// route handlers ----------------------------------------------------------------------------------------------------
router
    // get spots for current user----------------------------------------------------------- get all spots for current user
    .get('/current', requireAuth, async(req,res,next)=>{
        try{
            const spots = await Spot.findAll({
                where:{
                    ownerId:req.user.id
                },
                attributes: {
                    include:[
                        [Sequelize.fn('AVG',Sequelize.col('Reviews.stars')),'avgRating'],
                        [Sequelize.col('SpotImages.url'),'previewImage']
                    ],
                },

                // where:{ownerId:req.user.id},
                group:['Spot.id','SpotImages.id','previewImage'],

                include:[{
                    model:Review,
                    attributes:[]
                },
                {
                    model:SpotImage,
                    attributes:[
                        // 'url'
                    ],
                }]
            })
            let Spots = []
            spots.forEach(value=>{
                let spot = value.toJSON()
                let avgRating = (+spot.avgRating).toFixed(2)
                Spots.push({
                    id:spot.id,
                    ownerId:spot.ownerId,
                    address:spot.address,
                    city:spot.city,
                    state:spot.state,
                    country:spot.country,
                    lat:spot.lat,
                    lng:spot.lng,
                    name:spot.name,
                    description:spot.description,
                    price:spot.price,
                    createdAt:spot.createdAt.toISOString().split('T').join(' ').slice(0,-5),
                    updatedAt:spot.updatedAt.toISOString().split('T').join(' ').slice(0,-5),
                    avgRating:+avgRating,
                    previewImage:spot.previewImage
                })
            })
            res.json({Spots})

        }catch(error){
            next(error)
        }
    })
    // get all reviews on a spot based on spot id ------------------------------------------ get all reviews by spotId
    .get('/:spotId/reviews',async(req,res,next)=>{
        // find reviews
        try{
            // verify spot exists
            const spot = await Spot.findByPk(req.params.spotId)
            // if no spot
            if(!spot){
                // create error
                let err = {}
                // add title
                err.title = 'Resource not found'
                // create message
                err.message = "Spot couldn't be found"
                // set error status
                err.status = 404
                // send error
                throw err
            }
            // get reviews
            const reviews = await Review.findAll({
                // where spot ids match
                where:{
                    spotId:+req.params.spotId
                },
                //include User and review images
                include:[{
                    model:User,
                    // only include id, firstname and lastname
                    attributes:[
                        'id',
                        'firstName',
                        'lastName'
                    ]
                },{
                    // include reviewImages records
                    model:ReviewImage,
                    // return only id and url 
                    attributes:[
                        'id',
                        'url'
                    ]
                }]
            })
            // send response
            let Reviews = []
            reviews.forEach(value=>{
                let review = value.toJSON()
                review.createdAt = review.createdAt.toISOString().split('T').join(' ').slice(0,-5)
                review.updatedAt = review.updatedAt.toISOString().split('T').join(' ').slice(0,-5)
                Reviews.push(review)
            })
            return res.json({Reviews})
        }catch(error){
            next(error)
        }
    })
    // get all bookings by spot id --------------------------------------------------------- get all bookings by spotId
    .get('/:spotId/bookings',requireAuth,async(req,res,next)=>{
        try{
            // get all bookings
            const bookings = await Booking.findAll({
                // where spotId equals spot id from url
                where:{
                    spotId:req.params.spotId
                },
                // include user model
                include:[{
                    model:User,
                    // select only id, first name and last name
                    attributes:[
                        'id',
                        'firstName',
                        'lastName',
                    ]
                },{
                    model:Spot,
                    attributes:['ownerId']
                }]

            })
            // if no bookings exist return error
            if(!bookings.length){
                // create error
                let err = {
                    // add title
                    title:"Resource not found",
                    // add message
                    message:"Spot couldn't be found",
                    // add status code
                    status:404
                }
                // throw error
                throw err
            }
            // create returnable object
            let Bookings = []
            // iterate over bookings
            bookings.forEach(value=>{
                // deconsruct value
                let booking = value.toJSON()
                // if user is owner of booking do...
                let bookingStartDate = booking.startDate.toISOString().split('T').join(' ').slice(0,-5);
                let bookingEndDate = booking.endDate.toISOString().split('T').join(' ').slice(0,-5);
                let bookingCreatedAt = booking.createdAt.toISOString().split('T').join(' ').slice(0,-5);
                let bookingUpdatedAt = booking.updatedAt.toISOString().split('T').join(' ').slice(0,-5);
                if(booking.Spot.ownerId===req.user.id){ 
                    // push specific infor to Bookings

                    Bookings.push({
                        // User info
                        User:booking.User,
                        // booking info
                        id:booking.id,
                        spotId:booking.spotId,
                        userId:booking.userId,
                        startDate:bookingStartDate,
                        endDate:bookingEndDate,
                        createdAt:bookingCreatedAt,
                        updatedAt:bookingUpdatedAt
                    })
                // else
                }else{
                    // push other info
                    Bookings.push({
                        // only return spotId, start and end dates
                        spotId:booking.spotId,
                        startDate:bookingStartDate,
                        endDate:bookingEndDate
                    })
                }
            });
            // response
            res.json({Bookings})
        // catch and forward errors
        }catch(error){
            next(error)
        }
    })
    // get all spots related to spotId------------------------------------------------------ get all spots related to spotId
    .get('/:spotId',async (req,res,next)=>{
        try{
            const spots = await Spot.findAll({
                attributes: {
                    include:[
                        [Sequelize.fn('AVG',Sequelize.col('Reviews.stars')),'avgRating'],
                    ],
                },
                where:{
                    id:req.params.spotId
                },
                group:[['Spot.id'],['SpotImages.id'],['Owner.id']],
                include:[{
                    model:Review,
                    attributes:[]
                },{
                    model:SpotImage,
                    attributes:[
                        'id',
                        'url',
                        'preview'
                    ],
                },{
                    model:User,
                    as:'Owner',
                    attributes:[
                        'id',
                        'firstName',
                        'lastName'
                    ]
                }]
            })
            // if no spots send error
            if(!spots.length){
                let err = new Error("Spot couldn't be found")
                err.status = 404
                err.title = 'Resource not found'
                err.errors = {
                    "query":"Query returned an empty array (no resources like that)"
                }
                throw err
            }
            // get reviews for the spot based on id
            const reviews = await Review.findAll({
                where:{
                    spotId:req.params.spotId
                }
            })
            let numReviews = reviews.length
            // create returnable object

            let Spots = []
            // iterate through spots
            spots.forEach((value,index)=>{
                // create readable JSON from value
                let spot = value.toJSON()
                    Spots.push({
                        id:spot.id,
                        ownerId:spot.ownerId,
                        address:spot.address,
                        city:spot.city,
                        state:spot.state,
                        country:spot.country,
                        lat:spot.lat,
                        lng:spot.lng,
                        name:spot.name,
                        description:spot.description,
                        price:spot.price,
                        createdAt:spot.createdAt.toISOString().split('T').join(' ').slice(0,-5),
                        updatedAt:spot.updatedAt.toISOString().split('T').join(' ').slice(0,-5),
                        numReviews:numReviews,
                        avgRating:+(+spot.avgRating).toFixed(2),
                        SpotImages:spot.SpotImages,
                        Owner:spot.Owner
                    })
            })
            res.json({Spots})
        }catch(error){
            next(error)
        }
    })
    // get all spots------------------------------------------------------------------------ get all spots
    .get('/', decimalCheck, async (req,res,next)=>{
        try{
            // deconstruct query
            let {page,size,minLat,maxLat,minLng,maxLng,minPrice,maxPrice} = req.query

            switch(true){
                case (size && !isNaN(size) && size >= 1 && size <= 20):
                    break;
                default:
                    size = 20
            }
            switch(true){
                case (page && !isNaN(page) && page <= 10 && page >= 1):
                    break;
                default:
                    page = 1
            }
            // create query
            let query = {
                where:{

                }
            }
            // if min and max latitudes exists add them to query
            if(minLat){
                query.where.lat = {
                    [Op.gte]:minLat
                }
            }
            if(maxLat){
                query.where.lat = {
                    [Op.lte]:maxLat
                }
            }
            if(minLng){
                query.where.lng = {
                    [Op.gte]:minLng
                }
            }
            if(maxLng){
                query.where.lng = {
                    [Op.lte]:maxLng
                }
            }
            if(minPrice){
                query.where.price = {
                    [Op.gte]:minPrice
                }
            }
            if(maxPrice){
                query.where.price = {
                    [Op.lte]:maxPrice
                }
            }
            let Spots = []
            // find all spots
            const spots = await Spot.findAll({
                ...query,
                limit:size,
                offset:size * (page - 1)
            })
            // iterate over spots
            spots.forEach(spot => {
                // deconstruct each spot
                let values = spot.toJSON()
                // reformat dates
                values.createdAt = values.createdAt.toISOString().split('T').join(' ').slice(0,-5)
                values.updatedAt = values.updatedAt.toISOString().split('T').join(' ').slice(0,-5)
                // push each collection of values from spot to returnable array
                Spots.push(values)
            })
            // get all reviews
            const reviews = await Review.findAll()
            // create object for storage
            let avg = {}
            // iterate over reviews
            reviews.forEach((review)=>{
                // deconstruc review
                let value = review.toJSON()
                // assign spotId to variable
                let id = value.spotId
                // if avg id doesnt exists create it
                if(!avg[id]){
                    avg[id] = {
                        // add total from review and count to it
                        spotId:value.spotId,
                        total:+value.stars,
                        count:1
                    }
                //else
                }else{
                    // add review to total to review and increase count by one
                    avg[id].total = avg[id].total + value.stars;
                    avg[id].count++
                }
            })

            let avgRatings = {}
            // iterate over avg
            for(let spot in avg){
                // add spot id and average of ratings to avgRating
                avgRatings[avg[spot].spotId] = (avg[spot].total)/(avg[spot].count)
            }
            //get images
            const imagesObject = await SpotImage.findAll({
                // where preview is true
                where:{
                    preview:true
                }
            })
            // create images object
            let images = {}
            // iterate through imagesObject
            imagesObject.forEach(image=>{
                // create img from image using .toJSON
                let img = image.toJSON()
                // add img to images based on spot id
                images[img.spotId] = img.url
            })
            // iterate over Spots
            Spots.forEach(spot=>{
                // add avgRating and spot image
                spot.avgRating = avgRatings[spot.id]
                spot.previewImage = images[spot.id]
                
            })
            // return Spots
            res.json({
                Spots,
                page:+page,
                size:+size
            })
            
        }catch(error){
            next(error)
        }
    })
    // add an image to spots---------------------------------------------------------------- add image to spot
    .post('/:spotId/images', requireAuth, async (req,res,next)=>{
        try{
            // find spot based on spot id
            const spot = await Spot.findByPk(req.params.spotId)
            if(!spot){
                let err = {}
                err.title = "Resource not found",
                err.message = "Spot couldn't be found",
                err.status = 404
                err.errors = {
                    "message":"Resource not found",
                    "error":"There are no Spots with that spotId"
                }
                throw err
            }
            //check if current users id matches the spot id
            if(spot.id !== req.user.id){
                let err = {}
                err.status = 403
                err.title = 'Unauthorized User'
                err.message = 'Forbidden'
                err.errors = {
                    "message":"Unauthorized User requesting access",
                    "error": "User requested to add an image to a spot they do not own"
                }
                throw err
            }
                const CreatedImage = await SpotImage.create({
                    spotId: spot.id,
                    ...req.body
                })
                const image = await SpotImage.findByPk(CreatedImage.id,{
                    attributes:[
                        'id',
                        'url',
                        'preview'
                    ]
                })
                res.status(201).json(image)
        }catch(error){
            return next(error)
        }
    })
    // create a review for a spot based on spots id ---------------------------------------- create a review for spot
    .post('/:spotId/reviews',requireAuth,validReviewInfo,async(req,res,next)=>{
        // res.json('hello')
        // check for spot
        const spot = await Spot.findByPk(req.params.spotId)
        // if no spot throw err
        if(!spot){
            // create a err object
            let err = {
                title:"Resource not found",
                message:"Spot couldn't be found",
                status:404
            }
            throw err
        }
        // get reviews for the spot based on id
        const reviews = await Review.findAll({
            where:{
                spotId:req.params.spotId
            }
        })
        // iterate over review and look for user (if found return error)
        reviews.forEach(value=>{
            // deconstruct value
            let review = value.toJSON()
            // if userId is in review than this user already has a review
            if(review.userId===req.user.id){
                // create error object
                let err = {
                    // set message
                    title: "Duplicated Data",
                    message:"User already has a review for this spot"
                }
                // throw error
                throw err
            }
        })
        // create a review for the spot
        let review = await Review.create({
            // include userId
            userId:req.user.id,
            // include spotId
            spotId:req.params.spotId,
            // include review and stars from query
            ...req.body
        })
        // get the created review for response
        let Reviews = {}
        const reviewValues = await Review.findByPk(review.id)
        Reviews.id=reviewValues.id
        Reviews.userId=reviewValues.userId
        Reviews.spotId=reviewValues.spotId
        Reviews.review = reviewValues.review
        Reviews.stars = reviewValues.stars
        Reviews.createdAt = reviewValues.createdAt.toISOString().split('T').join(' ').slice(0,-5)
        Reviews.updatedAt = reviewValues.updatedAt.toISOString().split('T').join(' ').slice(0,-5)
        return res.status(201).json(Reviews)

    })
    // create a booking -------------------------------------------------------------------- create a booking
    .post('/:spotId/bookings',requireAuth,startDateCheck,async(req,res,next)=>{
        try{
            // deconstruct body
            let {startDate,endDate} = req.body;
            // find spot
            const spot = await Spot.findByPk(req.params.spotId)
            // if no spot send error
            if(!spot){
                let err = {
                    status:404,
                    message:"Spot couldn't be found",
                    title:"Resource not found"
                }
                return next(err)
            }
            // if owner of spot is user throw error
            if(spot.ownerId===req.user.id){
                // create error
                let err = {
                    // add title
                    title:"Unauthorized User",
                    // add status
                    status:403,
                    // add message
                    message:"Forbidden"
                }
                // return error
                return next(err)
            }
            // verify bookings dont overlap
            const bookings = await Booking.findAll({
                where:{
                    spotId:req.params.spotId,
                    [Op.and]:{
                        startDate:{
                            [Op.lt]:req.body.endDate
                        },
                        endDate:{
                            [Op.gt]:req.body.startDate,
                        }
                    }
                }
            })
            bookings.forEach(value=>{
                let booking = value.toJSON();
                let err = {
                    "title":"ValidationError",
                    "status":403,
                    "message":"Sorry, this spot is already booked for the specified dates",
                    "errors":{}
                }
                if(booking.startDate<=new Date(req.body.endDate)){
                    err.errors.startDate="Start date conflicts with an existing booking"
                }
                if(booking.endDate>=new Date(req.body.startDate)){
                    err.errors.endDate="End date conflicts with an existing booking"
                }
                throw err
            })
            // create booking (add userId, spotId, startDate, and endDate)
            let booking = await Booking.create({
                userId:req.user.id,
                spotId:req.params.spotId,
                ...req.body
            })
            let bookingValue = booking.toJSON()
            bookingValue.startDate = booking.startDate.toISOString().split('T').join(' ').slice(0,-5)
            bookingValue.endDate = booking.endDate.toISOString().split('T').join(' ').slice(0,-5)
            bookingValue.createdAt = booking.createdAt.toISOString().split("T").join(' ').slice(0,-5)
            bookingValue.updatedAt = booking.updatedAt.toISOString().split("T").join(' ').slice(0,-5)
            res.status(201).json(bookingValue)
        // catch error
        }catch(error){
            if(error.status==403){
                return next(error)
            }
            // add title
            error.title = "ValidationError",
            // add message
            error.message = "Bad Request",
            // add status
            error.status = 400,
            // add errors
            error.errors = {
                endDate:"endDate cannot be on or before startDate"
            }
            // send error
            next(error)
        }
    })
    // create a spot------------------------------------------------------------------------ create a spot
    .post('/', requireAuth, validateSpotInfo, async (req,res,next)=>{
        try{
            // req.body.ownerId = req.user.id
            let created = await Spot.create({
                ownerId:req.user.id,
                ...req.body
            })
            const spot = await Spot.findByPk(created.id)
            let spotValues = spot.toJSON()
            spotValues.createdAt = spot.createdAt.toISOString().split('T').join(' ').slice(0,-5)
            spotValues.updatedAt = spot.updatedAt.toISOString().split('T').join(' ').slice(0,-5)
            res.status(201).json(spotValues)
        }catch(error){
            console.log(error)
            console.log(error)
            let err = {}
            err.title = 'ValidationError';
            err.message = "Bad Request";
            err.errors = {};
            error.errors.forEach(object=>{
                err.errors[object.path] = object.message
            })
            err.status = 400
            next(err)
        }
    })
    // edit a spot-------------------------------------------------------------------------- edit a spot
    .put('/:spotId', requireAuth, validateSpotInfo, async (req,res,next)=>{
        try{
            // get spot
            const spotToEdit = await Spot.findByPk(req.params.spotId)
            // if spot doesnt exists through error
            if(!spotToEdit){
                let err = {}
                err.title = "Resource not found"
                err.message = "Spot couldn't be found"
                err.status = 404
                throw err
            }
            // check authorization
            if(spotToEdit.id!==req.user.id){
                let err = {}
                err.title = 'Unauthorized User'
                err.message = 'Forbidden'
                err.status = 403
                err.errors = {
                    "message":"Unauthorized User requesting access",
                    "error": "User requested to add an image to a spot they do not own"
                }
                throw err
            }
            // update record
            await Spot.update(req.body,{
                where:{
                    id:req.params.spotId
                }
            })
            const spot = await Spot.findByPk(req.params.spotId)
            spotValues = spot.toJSON()
            spotValues.createdAt = spot.createdAt.toISOString().split('T').join(' ').slice(0,-5)
            spotValues.updatedAt = spot.updatedAt.toISOString().split('T').join(' ').slice(0,-5)
            res.json(spotValues)
        }catch(error){
            next(error)
        }
    })
    // delete a spot ----------------------------------------------------------------------- delete a spot
    .delete('/:spotId', requireAuth, async (req,res,next)=>{
        try{
            //get spot by id
            const spotToDelete = await Spot.findByPk(req.params.spotId)
            // check if spot exists
            if(!spotToDelete){
                let err = {}
                err.title = "Resource not found";
                err.message = "Spot couldn't be found"
                err.status = 404
                throw err
            }
            // check user authorization
            if(spotToDelete.id!==req.user.id){
                let err = {}
                err.title = "Unauthorized User"
                err.message = "Forbidden"
                err.status = 403
                throw err
            }
            // delete the spot
            await Spot.destroy({
                where:{
                    id:req.params.spotId
                }
            })
            // respond
            return res.json({
                "message":"Successfully deleted"
            })
        }catch(error){
            next(error)
        }
    })

module.exports = router
