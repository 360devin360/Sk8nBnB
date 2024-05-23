'use strict';

/** @type {import('sequelize-cli').Migration} */
const {SpotImage} = require('../models')
let options = {}
if(process.env.NODE_ENV==='production'){
  options.schema = process.env.SCHEMA
}
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await SpotImage.bulkCreate([
    {
      spotId:1,
      url:'https://www.dreamstime.com/stock-photo-hotel-bed-room-image21064950',
      preview:true
    },
    {
      spotId:2,
      url:'https://www.dreamstime.com/royalty-free-stock-image-hotel-room-image27254386',
      preview:true
    },
    {
      spotId:3,
      url:'https://www.dreamstime.com/editorial-image-hotel-room-beautiful-orange-sofa-included-image43642330',
      preview:true
    }
   ],{validate:true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,{
      spotId:{
        [Op.in]:[1,2,3]
      }
    },{})
  }
};
