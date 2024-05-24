'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Review.hasMany(models.ReviewImage,{
      //   foreignKey:'reviewId',
      //   onDelete:'cascade'
      // })
      // Review.belongsTo(models.Spot,{
      //   foreignKey:'spotId',
      //   onDelete:'cascade'
      // })
    }
  }
  // spotId userId combo needs to be unique
  Review.init({
    spotId: {
      type:DataTypes.INTEGER,
      allowNull:false,
      // references:{
      //   model:'Spots',
      // },
      // onDelete:'cascade'
    },
    userId: {
      type:DataTypes.INTEGER,
      allowNull:false,
      // references:{
      //   model:"Users"
      // },
      // onDelete:'cascade'
    },
    stars: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notNull:true,
        isInt:true,
        min:1,
        max:5,
      }
    },
    review: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:true,
        len:[1,100],
        is:/^[A-Za-z0-9 .,!?]+$/,
        notEmpty:true
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};