const User = require("../users/model") 
const jwt = require("jsonwebtoken")

const bcrypt = require("bcrypt")

const saltRounds = process.env.SALT_ROUNDS

const middleware = {}


// hash the password
middleware.hashPass = async (req, res, next) => 
{
    try 
    {
        req.body.password = await bcrypt.hash(req.body.password, parseInt(saltRounds))
        next()
    } 
    catch (error) 
    {
        res.status(501).json({errorMessage: 'hashPass error - ' + error.message, error: error})
    }
}

// compare the hashed password with the normal text password
middleware.comparePass = async (req, res, next) => 
{
    let status = 501

    try 
    {
        req.user = await User.findOne({where: {username: req.body.username}})      

        if (req.user === null) 
        {
            status = 401
            throw new Error("password or username doesn't match")
        }

        err = 0
        
        const comparePassword = await bcrypt.compare(req.body.password, req.user.password)

        if(!comparePassword)
        {
            status = 401
            throw new Error("password or username doesn't match")
        } 

        console.log('password is fine')
        
        next()
    } 
    catch (error) 
    {
        res.status(status).json({errorMessage: error.message})
    }
}

//
middleware.tokenCheck = async (req, res, next) => 
{
    let status = 501

    try 
    {
        if (!req.header("Authorization")) 
        {
            status = 401
            throw new Error("No header or token passed in the request")
        }
        
        const token = req.header("Authorization").replace("Bearer ", "")
    
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)

        const user = await User.findOne({where: {id: decodedToken.id}})
        
        if(!user)
        {
            status = 401
            throw new Error("User is not authorised")
        }
        req.authUser = user
        console.log('User ' + user.username + ' is authorised')
        next()

    } 
    catch (error) 
    {
        res.status(status).json({errorMessage: 'tokenCheck error - ' + error.message, error: error})
    }
}


module.exports = middleware