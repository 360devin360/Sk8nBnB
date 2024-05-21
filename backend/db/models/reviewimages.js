'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReviewImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ReviewImages.init({
    reviewId: {
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'Reviews'
      }
    },
    url: {
      type:DataTypes.STRING,
      allowNull:false,
      unique:true,
      validate:{
        isUrl:true
      }
    }
  }, {
    sequelize,
    modelName: 'ReviewImages',
  });
  return ReviewImages;
};