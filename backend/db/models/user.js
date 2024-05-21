'use strict';
const {Model,Validator} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Spot,{
        foreignKey:'ownerId'
      })
      // define association here
      // User.belongsToMany(models.Spots,{
      //   through:models.Reviews,
      //   foreignKey:'userId',
      //   otherKey:'spotId'
      // })
    }
  }
  User.init({
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
    firstName:{
      type:DataTypes.STRING,
      validate:{
        len:[4,30],
        isNotEmail(value){
          if(Validator.isEmail(value)){
            throw new Error("Cannot be an email.")
          }
        }
      }
    },
    lastName:{
      type:DataTypes.STRING,
      validate:{
        len:[4,30],
        isNotEmail(value){
          if(Validator.isEmail(value)){
            throw new Error("Cannot be an email.")
          }
        }
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
  });
  return User;
};