const  User = require ("./model") 

const jwt = require("jsonwebtoken")

const controllers = {}

controllers.registerUser = async (req, res) => 
{
    try 
    { 
        const user = await User.create
          (
            {username: req.body.username
            ,email: req.body.email
            ,password: req.body.password
            }
          )
        
        res.status(201).json
        (
          {message: "create of user: '" + user.username + "' successful"
          ,user: user
          ,userCreated:true
          }
        )
    } 
    catch (error) 
    {
        res.status(501).json({errorMessage: 'Register User ' + error.message, error: error, userCreated:false})
    }
}

controllers.login = async (req, res) => 
{
    try 
    { /*
        if (req.authUser) 
        {
          res.status(200).json
          (
            {message: "success"
            ,user: 
              {username: req.authUser.username
              ,email: req.authUser.email
              }
            }
          )
          return
        }
*/
        const token = await jwt.sign({id: req.user.id}, process.env.SECRET_KEY);
        
        res.status(200).json
        (
          {message: "success"
          ,user: 
              {username: req.user.username
              ,email: req.user.email
              ,token: token
              }
          }
        )
    } 
    catch (error) 
    {
        res.status(501).json({ errorMessage: 'login error - ' + error.message, error: error });
    }
}

// get all the user data on the users table
controllers.getAllUsers = async (req, res) => 
{
    try 
    {
      const users = await User.findAll();

      res.status(201).json
      (
        {message:'get all users successful (' + users.length + ' found)'
        ,users:users
        }
      )
    } 
    catch (error) 
    {
      res.status(501).json({ errorMessage: 'getAllUsers ' + error.message, error: error })
    }
}

// edit a user(s) according to a particular criteria
// ie. {"criteria":{"email":"new email address"}, "where":{"id":4}}
// will upate the email with 'new email address' for user no 4
controllers.updateUser = async (req, res) =>
{
    try 
    {   
        //const criteria = req.body        
        const result = await User.update
                            (req.body.criteria,
                            {where:req.body.where}
                            )
        if (result == 0)
        {
          res.status(201).json({message:'update unsuccessful check input parameters'})
        }
        else
        {
          res.status(201).json({message:'update successful '})
        }
    } 
    catch (error)
    {
       console.log(error)
       res.status(501).json({message:error.message, error:error}) 
    }
}

/*
controllers.updateUser = async (req, res) => 
{
    try 
    {
      const updateResult = await User.update(
        { [req.body.updateKey]: req.body.updateValue },
        { where: { username: req.body.username } }
      )
  
      res.status(201).json({ message: "success", updateResult: updateResult })
    } 
    catch (error) 
    {
      res.status(501).json({ errorMessage: error.message, error: error })
    }
};
*/


// delete a user from the table users using the username
controllers.deleteUser = async (req, res) => 
{
    try 
    {
      const result = await User.destroy
      (
        {where: {username: req.body.username}}
      )

      if (result == 0)
      {
        res.status(202).json({ message: 'User ' + req.body.username + ' was not found on the database'})
      }
      else
      {
        res.status(202).json({ message: 'User ' + req.body.username + ' has been successfully deleted'})
      }
    } 
    catch (error) 
    {
      res.status(501).json({ errorMessage: error.message, error: error })
    }
}



module.exports = controllers