'use strict'
// requires
const {Model} = require('sequelize');
const express = require('express');
const bcrypt = require('bcryptjs');
const { values } = require('lodash');
const { default: isEmail } = require('validator/lib/isEmail');
// create router
const sessionRouter = express.Router();
const usersRouter = express.Router()
// make a users model that resembles the User Model and is what is stored in the Users table
class User extends Model{
    // create a usable method to make an object from the class instance
    toSafeObject(){
        // deconstruct id, username and email from the instance
        const {id, username, email} = this;
        // return the id, username and email
        return {id, username, email}
    };
    // create a way to validate passwords
    async validatePassword(password){
        // use bcrypt to compare the password to the hashed password of user and return value
        return await bcrypt.compare(password,this.hashedPassword.toString());
    }
    // make a login method that takes in an object with a username and password
    static async login({username,password}){
        // create a user constant that is the value from finding a user where username = username of User
        const user = await User.scope({method:['loginUser','username']}).findOne();
        // if user is not null/undefined and validatepassword is true
        if(user && await user.validatePassword(password)){
            // return the result of a query for a user by user.id 
            return await User.scope('currentUser').findByPk(user.id)
        }
        // if nothing else was returned return null
        return null;
    }
    static async signup(data){
        const user = User.build(data);
        const {password} = data;
        user.hashedPassword = await bcrypt.hash(password);
        await user.save()
        return await User.scope('currentUser').findByPk(user.id)
    }
}

User.init({
    firstName:{
        type:DataTypes.STRING(30),
        allowNull:false,
        validate:{
            notNull:true,
            notEmpty:true,
            len:[1,30]
        }
    },
    lastName:{
        type:DataTypes.STRING(40),
        allowNull:false,
        validate:{
            notNull:true,
            notEmpty:true,
            len:[1,30]
        }
    },
    email:{
        type:DataTypes.STRING(40),
        allowNull:false,
        validate:{
            notNull:true,
            notEmpty:true,
            isEmail:true
        }
    },
    username:{
        type:DataTypes.STRING(30),
        unique:true,
        allowNull:false,
        validate:{
            notNull:true,
            notEmpty:true,
            len:[1,30]
        }
    },
    hashedPassword:{
        type:Datatypes.STRING.BINARY,
        allowNull:false
    }
},{
    sequelize,
    modelName:'User',
    defaultScope:{
        attributes:{
            exclude:[
                'hashedPassword',
            ]
        }
    },
    scopes:{
        loginUser(username){
            return{
                where:{
                    username
                },
                attributes:[
                    'id',
                    'username',
                    'hashedPassword'
                ],
                limit:1
            }
        }
    },
    currentUser:{
        attributes:{
            exclude:[
                'hashedPassword',
                'createdAt',
                'updatedAt'
            ]
        },
        limit:1
    }
})

function setTokenCookie (res,user){
    const token = jwt.sign(
        {user: user.toSafeObject()},
        'secret',
        { expiresIn: 604800}
    );
    const isProduction = process.env.NODE_ENV === "production"
    res.cookie("token",token,{
        maxAge:604800 * 1000,
        httpOnly:true,
        secure:isProduction,
        sameSite: isProduction && 'Lax'
    });
    return token
};

function restoreUser(req,res,next){
    // deconstruct cookies from request
    const {token} = req.cookies;
    // return jsonwebtoken verified (payload:token,secret:'secret',options:function)
    return jwt.verify(token,'secret',null,async(err,jwtPayload)=>{
        // forward error to next error handler if error occurs (verification fails)
        if(err){
            let error = new Error('Authentication required')
            error.statusCode = 401
            throw error
        }
        // try catch block
        try{
            //deconstruct id from the payload user
            const {id} = jwtPayload.user;
            // find by primary key(id) from Users table and save to req.user
            req.user = await User.scope("currentUser").findByPk(id);
        }catch(error){
            // catch errors and clear cookies
            res.clearCookie('token');
            // return next
            return next();
        }
        // if no req.user exists clear 'token' cookies
        if(!req.user) res.clearCookie('token');
        // return next()
        return next()
    });
};

//------------------------------------------------------------------------------------------------------------------------------------

// Get the Current User
// url = '/api/session'
// method = 'GET'
// credentials = 'include'

SessionRouter.get('/', restoreUser, (req,res,next)=>{
    try{
        const {user} = req;
        if(user){
            return res.json({
                user: user.toSafeObject()
            });
        }
        return res.json({})
    }catch(error){
        next(error.message)
    }
});

// Log in a User 
// url = '/api/session'
// method = 'POST'
// credentials = 'include'
// headers:{
// 'Content-Type':'application/json'
// 'XSRF-Token': getCSRFTokenCookie()
// },
// body: JSON.stringify(body)

sessionRouter.post('/', async(req,res)=>{
    try{
        const {username,password} = req.body;
        const user = await User.login({username,password})
        if(!user){
            const err = new Error('Invalid Credentials')
            err.status = 401;
            err.title = 'Invalid Credentials';
            err.errors = ['Invalid Credentials'];
            return next(err);
        }
        await setTokenCookie(res,user);
        return res.json({
            user
        });
    }catch(err){
        err.statusCode= 400
        err.message = "Bad Request"
        err.errors = {
            "credential":"Email or username is required",
            "password":"Password is required"
        }
        next(err)
    }
});

// Sign Up a User
// url = /api/users
// method = post
// body = {
// email: example@example.example,
// password: exAmpl3!,
// username: xAMpull2024
//}
usersRouter.post('/',async(req,res,next)=>{
    try{
        const {email,password,username} = req.body;
        let existingEmail = await findOne({
            where:{
                email:email
            }
        })
        if(existingEmail){
            let error = new Error("User already exists")
            error.errors = {
                "email":"User with that email already exists"
            }
            error.statusCode = 500
            return next(error)
        }
        let existingUsername = await findOne({
            where:{
                username:username
            }
        })
        if(existingUsername){
            let error = new Error("User already exists")
            error.errors = {
                "username":"User with that username already exists"
            }
            error.statusCode = 500
            res.statusCode = 500
            return next(error)
        }
        try{
            const user = await User.signup({firstName,lastName,email,username,password});
            await setTokenCookie(res,user);
            return res.json({
                user
            });
        }catch(error){
            return next({
                "message":"Validation Error",
                "errors":{
                    "email":"Invalid email",
                    "username":"Username is required",
                    "firstName":"First Name is required",
                    "lastName":"Last Name is required"
                }
            });
        }
    }catch(error){
        next(error)
    }
});

// SPOTS ------- SPOTS --------------- SPOTS ------------------ SPOTS ----------- SPOTS-------------- SPOTS---------------------


