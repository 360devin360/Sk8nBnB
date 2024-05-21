'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Spot.init({
    ownerId: {
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'Users'
      },
      validate:{
        notNull:true
      }
    },
    name: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        isAlpha:true,
        len:[1,49],
        notNull:true,
        notEmpty:true
      }
    },
    address: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        isAlphanumeric:true,
        isUnique:true,
        notEmpty:true
      }
    },
    city: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        isAlpha:true,
        notNull:true,
        notEmpty:true
      }
    },
    state: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        isAlpha:true,
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
        isAlpha:true
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