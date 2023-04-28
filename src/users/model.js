const { DataTypes } = require("sequelize")
const connection = require("../db/connection")

const User = connection.define("user", 
    {username: 
        {type: DataTypes.STRING
        ,allowNull: false
        ,unique:true
        }
    ,email: 
        {type: DataTypes.STRING
        ,allowNull: false
        ,unique:true
        }
    ,password: 
        {type: DataTypes.STRING
        ,allowNull: false,
        }
    }
)

module.exports = User