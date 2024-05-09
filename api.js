function authentication(){
    try{
        if(!req.body.username!==process.env.USERNAME){
            const error = new Error('Authentication required')
            error.statusCode = 404
            next(error)
        }else if(!req.body.password!==process.env.PASSWORD){
            const error = new Error('Authentication required')
            error.statusCode = 404
            next(error)
        }else{
            console.log("User authenticated")
            next()
        }
    }catch(error){
        next(error)
    }
}

//------------------------------------------------------------------------------------------------------------------------------------


app.get('/Users',authentication,(req,res,next)=>{
    try{
        
    }catch(error){

    }
})