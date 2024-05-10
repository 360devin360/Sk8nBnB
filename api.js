
// get current user
// authenticate first and move to 'next' function if authentication passes else catch error and respond with error.message
// or call authentication method inside of function

// api.get('/users/myaccount', authenticate, (req,res,next)=>{
// or
api.get('/Users/CurrentUser/',async(req,res,next)=>{
    // try catch block (authentication)
    try{
        // use the authentication method to check tokens
        authenticate(req.token);
     // catch any errors
    }catch(error){
        // console.log error
        console.log(error)
        // respond with message
        return res.status(401).json({
            "message":"Authentication required"
        });
    }
    // try getting user
    try{
        // find a user by email and save it to a variable
        const user = await User.findOne({
            attributes:['id','firstName','lastName','email','username'],
            where:{
                email:req.body.email
            }
        })
        // if the user does not exists return null
        if(!user){
            return res.json({
                "user":null
            })
        // else return user
        }else return res.json({'user':user})
    // catch any errors
    }catch(error){
        // log errors
        console.log(error)
        // send errors on
        return next(error)
    }
});

// Log in a User
api.get('/User/Login', async(req,res,next)=>{
    // try deconstructing body and sending info to log in user
    try{
        // save body to variables
        const {credential,password} = req.body
        // look for user in database and compare passwords
        const user = await User.findOne({
            attributes:['id','firstName','lastName','email','username'],
            where:{
                email:credential,
                password:password
            }
        });
        // if no user is found then send message about credentials
        if(!user){
            // respond with status code 401 and message
            return res.status(401).json({
                "message":"Invalid credentials"
            });
        // else respond with user
        }else{
            // return user
            return res.json({
                'user': user
            })
        }
    // catch errors
    }catch(error){
        // send error onward with message and errors
        return next({
            "message":"Bad Request",
            "errors":{
                "credentials":"Email or username is required",
                "password":"Password is required"
            }
        });
    }
});

// Sign up a user
api.get('/Users/SignUp',async (req,res,next)=>{
    //try to sign up a user
    try{
        // deconstruct body
        const {firstName,lastName,email,username,password} = req.body;
        // check for user with email already
        const checkEmail = await User.findOne({
            where:{
                email:email
            }
        })
        // if checkEmail then send error resonse
        if(checkEmail){
            return res.status(500).json({
                "message":"User already exists",
                "errors":{
                    "email":"User with that email already exists"
                }
            });
        }
        // check if username already taken
        const checkUserName = await findOne({
            where:{
                username:username
            }
        });
        // if checkUserName then send error message
        if(checkUserName){
            return res.status(500).json({
                "message":"User already exists",
                "errors":{
                    "username":"User with that username already exists"
                }
            });
        }
        // try to create a new User
        try{
            await User.create({
                firstName,
                lastName,
                email,
                username,
                password
            });
        // if this fails then send error message
        }catch(error){
            // log error
            console.log(error)
            // return repsonse (error message)
            return res.status(400).json({
                "message":"Bad Request",
                "errors":{
                    "email":"Invalid email",
                    "username":"Username is required",
                    "firstName":"First Name is required",
                    "lastName":"Last Name is required"
                }
            });
        }
        // find user in database (verify creation worked)
        const user = User.findOne({
            attributes:['id','firstName','lastName','email','username'],
            where:{
                email:email,
                password:password
            }
        });
        // respond with user info
        return res.json({
            'user':user
        });
    }catch(error){
        console.log(error)
        next(error)
    }
})