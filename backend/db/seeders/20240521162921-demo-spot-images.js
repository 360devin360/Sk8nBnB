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
      url:'https://thumbs.dreamstime.com/z/hotel-bed-room-21064950.jpg?ct=jpeg',
      preview:true
    },
    {
      spotId:2,
      url:'https://thumbs.dreamstime.com/z/hotel-room-27254386.jpg?ct=jpeg',
      preview:true
    },
    {
      spotId:3,
      url:'https://thumbs.dreamstime.com/z/hotel-room-beautiful-orange-sofa-included-43642330.jpg?ct=jpeg',
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
    await queryInterface.bulkDelete(options,{
      spotId:{
        [Op.in]:[1,2,3]
      }
    },{})
  }
};
