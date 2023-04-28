const { Router } = require("express")
const userRouter = Router()

const 
    {registerUser
    ,getAllUsers
    ,updateUser
    ,deleteUser
    ,login
    } = require("./controllers") 

const 
    {hashPass
    ,comparePass
    ,tokenCheck 
    } = require("../middleware")

userRouter.post("/users/register", hashPass, registerUser)

userRouter.post("/users/login", comparePass, login)

userRouter.get("/users/all", tokenCheck, getAllUsers)

userRouter.get("/users/auth", tokenCheck, login)

userRouter.put("/users/update", updateUser)

userRouter.delete("/users/delete", deleteUser)


module.exports = userRouter