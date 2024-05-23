const router = require('express').Router();
const {Spot} = require('../../db/models');
const {Sequelize, Deferrable} = require('sequelize');
const {Review} = require('../../db/models');
const {SpotImage} = require('../../db/models');
const {requireAuth} = require('../../utils/auth')
const {User} = require('../../db/models')
const {handleValidationErrors} = require('../../utils/validation');
const {check} = require('express-validator')

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
        .optional({nullable:true})
        .isFloat()
        .withMessage('Latitude is not valid'),
    check('lng')
        .optional({nullable:true})
        .isFloat()
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({values:'falsy'})
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

router
// get spots for current user---------------------------------------------------------------------------------------------
.get('/current', requireAuth, async(req,res,next)=>{
    try{
        const spots = await Spot.findAll({
            attributes: {
                include:[
                    [Sequelize.fn('AVG',Sequelize.col('Reviews.stars')),'avgRating'],
                    [Sequelize.fn('',Sequelize.col('SpotImages.url')),'previewImage']
                ],
            },
            where:{ownerId:req.user.id},
            group:['Spot.id'],
            include:[{
                model:Review,
                attributes:[]
            },{
                model:SpotImage,
                attributes:[],
            }]
        })
        res.json({spots})
    }catch(error){
        next(error)
    }
})
// get all spots related to spotId---------------------------------------------------------------------------------------
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
            group:['Spot.id'],
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
        if(!spots.length){
            let err = new Error("Spot couldn't be found")
            err.status = 404
            err.title = 'Resource not found'
            err.errors = {
                "query":"Query returned an empty array (no resources like that)"
            }
            throw err
        }
        res.json({spots})
    }catch(error){
        next(error)
    }
})
// get all spots----------------------------------------------------------------------------------------------
.get('/', async (req,res,next)=>{
    try{
        const spots = await Spot.findAll({
            attributes: {
                include:[
                    [Sequelize.fn('AVG',Sequelize.col('Reviews.stars')),'avgRating'],
                    [Sequelize.fn('',Sequelize.col('SpotImages.url')),'previewImage']
                ],
            },
            group:['Spot.id'],
            include:[{
                model:Review,
                attributes:[]
            },{
                model:SpotImage,
                attributes:[],
            }]
        })
        res.json({spots})
    }catch(error){
        next(error)
    }
})
// add an image to spots-------------------------------------------------------------------------------------------------
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
        res.json(image)
    }catch(error){
        console.log(error)
        next(error)
    }
})
// create a spot---------------------------------------------------------------------------------------------
.post('/', requireAuth, validateSpotInfo, async (req,res,next)=>{
    try{
        req.body.ownerId = req.user.id
        let created = await Spot.create({
            ownerId:req.user.id,
            ...req.body
        })
        const spot = await Spot.findByPk(created.id)
        res.status(201).json(spot)
    }catch(error){
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
// edit a spot---------------------------------------------------------------------------------------------
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
        res.json(spot)
    }catch(error){
        next(error)
    }
})

module.exports = router