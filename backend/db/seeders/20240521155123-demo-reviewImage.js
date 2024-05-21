'use strict';

const {ReviewImages} = require('../models');

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
   await ReviewImages.bulkCreate([
    {
      reviewId:1,
      url:"../../images/demographySpot.jpg"
    },
    {
      reviewId:2,
      url:'../../images/spot2.jpg'
    },
    {
      reviewId:3,
      url:'../../images/spot3.jpg'
    }
   ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'ReviewImages'
    return 
  }
};
