'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SpotImage.belongsTo(models.Spot,{
        foreignKey:'spotId',
        onDelete:'cascade'
      })
    }
  }
  SpotImage.init({
    spotId: {
      type:DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'Spots'
      },
      onDelete:'cascade'
    },
    url: {
      type:DataTypes.STRING,
      allowNull:false,
      unique:true,
      // validate:{
      //   isUrl:true
      // }
    },
    preview: {
      type:DataTypes.BOOLEAN,
      validate:{
        isBool(value){
          if(typeof value !== 'boolean')throw new Error('must be true or false')
        }
      }
    },
  }, {
    sequelize,
    modelName: 'SpotImage',
  });
  return SpotImage;
};