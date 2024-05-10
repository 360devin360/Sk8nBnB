// use npm install csurf for XSRF 
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
app.use(cookieParser())
app.use(
    csurf({
        cookie:{
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" && "Lax",
            httpOnly: true
        }
    })
);

function authentication(){
    
}

function authorization(){

}
//------------------------------------------------------------------------------------------------------------------------------------

// Get the Current User
// const {User} = require(<path/to/models>)
app.get('/Account/info',authentication, async(req,res,next)=>{
    try{
        const id = Number(localStorage.userId)
        const user = await User.findByPk(id,{
            attributes:['id','firstName','lastName','email','username']
        });
        if(!user){
            res.json({
                "user":null
            })
        }else{
            res.json(user)
        }
    }catch(error){
        next(error)
    }
})

// Log in a User 
app.get('/Account/login', async(req,res,next)=>{
    try{
        const {credential,password} = req.body
        const user = await findOne({
            attributes:['id','firstName','lastName','email','username'],
            where:{
                email:credential
            }
        });
        if(!user || user.password!==password){
            const error = new Error({"message":"Invalid credentials"})
            error.statusCode = 401
            throw error
        }else{
            res.json(user)
        }
    }catch(error){
        next(error)
    }
})

// Sign Up a User
app.post('/Account/signUp',async(req,res,next)=>{
    try{
        // check if name, email and password are submitted
        const {firstName,lastName,email,username,password} = req.body
        if(!firstName|| !lastName|| !email|| !username){
            const error = new Error({
                "message":"Bad Request",
                "errors":{
                    "email":"invalid email",
                    "username":"Username is required",
                    "firstName":"First Name is required",
                    "lastName":"Last Name is required"
                }
            });
        }
        // check for any users with email same as provided
        const emailCheck = await findOne({
            where:{
                email:email
            }
        })
        // check for any users with same username
        const usernameCheck = await findOne({
            where:{
                username:username
            }
        })

        // if there is already a user with the email provided then throw error
        if(emailCheck){
            const error = new Error({
                "message":"User already exists",
                "errors":{
                    "email":"user with that email already exists"
                }
            })
            error.statusCode = 500
        // if there is already a user with the username provided then throw error
        }else if(usernameCheck){
            const error = new Error({
                "message":"User already exists",
                "errors":{
                    "email":"User with that usaername already exists"
                }
            })
        // if no user exists with username or email provided then create user
        }else{
            // store user in variable
            const newUser = await User.create({
                firstName,
                lastName,
                email,
                username,
                password
            });
            const user = await findOne({
                attributes:['id','firstName','lastName','email','username'],
                where:{
                    firstName:firstName,
                    lastName:lastName
                }
            });
            res.json(user)
        }
    }catch(error){
        next(error)
    }
})

// SPOTS ------- SPOTS --------------- SPOTS ------------------ SPOTS ----------- SPOTS-------------- SPOTS---------------------

// Get all spots

app.get('/spots',async(req,res,next)=>{

})
