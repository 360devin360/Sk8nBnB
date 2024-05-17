'use strict';
<<<<<<< HEAD
const {
  Model
} = require('sequelize');
=======
const {Model,Validator} = require('sequelize');

>>>>>>> c2b6a77e7797d18d40915966640ba1dbd8528582
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
<<<<<<< HEAD
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    hashedPassword: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
=======
    username: {
      type:DataTypes.STRING,
      allowNull:false,
      unique:true,
      validate:{
        len:[4,30],
        isNotEmail(value){
          if(Validator.isEmail(value)){
            throw new Error("Cannot be an email.")
          }
        }
      }
    },
    email: {
      type:DataTypes.STRING,
      allowNull:false,
      unique:true,
      validate:{
        len:[3,256],
        isEmail:true
      }
    },
    hashedPassword: {
      type:DataTypes.STRING.BINARY,
      allowNull:false,
      validate:{
        len:[60,60]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope:{
      attributes:{
        exclude:['email','hashedPassword','createdAt','updatedAt']
      }
    }
>>>>>>> c2b6a77e7797d18d40915966640ba1dbd8528582
  });
  return User;
};