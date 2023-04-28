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
    try 
    {
        console.log('compare pass ' + req.body.username)
        req.user = await User.findOne({where: {username: req.body.username}})      

        if (req.user === null) 
        {
            throw new Error ("#password or username doesn't match")
        }
        
        console.log('user found password ' + req.body.password)
        const comparePassword = await bcrypt.compare(req.body.password, req.user.password)

        if(!comparePassword)
        {
            throw new Error ("password or username doesn't match")
        } 

        console.log('password is fine')
        
        next()
    } 
    catch (error) 
    {
        res.status(501).json({errorMessage: 'Compare Pass error - ' + error.message, error: error})
    }
}

//
middleware.tokenCheck = async (req, res, next) => 
{
    try 
    {
        console.log('Token Check')
        if (!req.header("Authorization")) 
        {
            throw new Error("No header or token passed in the request")
        }
        
        const token = req.header("Authorization").replace("Bearer ", "")
    
        console.log('Token: ' + token)
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)

        console.log('Decoded Token: ' + JSON.stringify(decodedToken))
        const user = await User.findOne({where: {id: decodedToken.id}})
        
        console.log('User: ' + JSON.stringify(user))
        if(!user)
        {
            throw new Error("User is not authorised")
        }
        req.authUser = user
        console.log('req.authUser: ' + JSON.stringify(req.authUser))
        next()

    } 
    catch (error) 
    {
        res.status(501).json({errorMessage: 'tokenCheck error - ' + error.message, error: error})
    }
}


module.exports = middleware