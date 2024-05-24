'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Spot.belongsTo(models.User,{
      //   foreignKey:'ownerId',
      //   as:'Owner',
      //   onDelete:'set null'
      // });
      // Spot.hasMany(models.Review,{
      //   foreignKey:'spotId',
      //   onDelete:'cascade'
      // })
      // Spot.hasMany(models.Booking,{
      //   foreignKey:'spotId',
      //   onDelete:'cascade'
      // })
      // Spot.hasMany(models.SpotImage,{
      //   foreignKey:'spotId',
      //   onDelete:'cascade'
      // })
    }
  }
  Spot.init({
    ownerId: {
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'User'
      },
      onDelete:'set null',
      validate:{
        notNull:true
      }
    },
    address: {
      type:DataTypes.TEXT,
      allowNull:false,
      validate:{
        is:/^[A-Za-z0-9 .]+$/,
        notEmpty:true
      }
    },
    city: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        is:/^[A-Za-z0-9 ]+$/,
        notNull:true,
        notEmpty:true
      }
    },
    state: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        is:/^[A-Za-z0-9 ]+$/,
        notEmpty:true,
        notNull:true
      }
    },
    country: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:true,
        notEmpty:true,
        is:/^[A-Za-z0-9 ]+$/
      }
    },
    lat: {
      type:DataTypes.FLOAT,
      validator:{
        isFloat:true,
        min:-90,
        max:90
      }
    },
    lng: {
      type:DataTypes.FLOAT,
      validator:{
        isFloat:true,
        min:-180,
        max:180
      }
    },
    name: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        is: /^[A-Za-z0-9 '.,!?><@#$%^&*-]+$/,
        len:[1,49],
        notNull:true,
        notEmpty:true
      }
    },
    description: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:true,
        len:[1,150],
        notEmpty:true
      }
    },
    price: {
      type:DataTypes.DECIMAL,
      allowNull:false,
      validate:{
        isDecimal:true,
        notNull:true,
        min:0.01,
        max:1000000000
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};