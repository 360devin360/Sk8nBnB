'use strict';

const {ReviewImage} = require('../models');

/** @type {import('sequelize-cli').Migration} */
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
   await ReviewImage.bulkCreate([
    {
      reviewId:1,
      url:"https://thumbs.dreamstime.com/b/hotel-bed-room-21064950.jpg"
    },
    {
      reviewId:2,
      url:'https://www.dreamstime.com/royalty-free-stock-image-hotel-room-image27254386'
    },
    {
      reviewId:3,
      url:'https://www.dreamstime.com/editorial-image-hotel-room-beautiful-orange-sofa-included-image43642330'
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
    const Op = Sequelize.Op
    options.tableName = 'ReviewImages'
    await queryInterface.bulkDelete(options,{
      reviewId:{
        [Op.in]:[1,2,3]
      }
    })
  }
};
