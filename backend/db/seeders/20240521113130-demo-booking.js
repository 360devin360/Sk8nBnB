'use strict';

/** @type {import('sequelize-cli').Migration} */
const {Booking} = require('../models');
let options = {};
if(process.env.NODE_ENV === 'production'){
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
   await Booking.bulkCreate([
    {
      userId:1,
      spotId:1,
      startDate:'2024-5-25',
      endDate:'2024-5-28'
    },
    {
      userId:2,
      spotId:2,
      startDate:'2024-5-24',
      endDate:'2024-6-25'
    },
    {
      userId:3,
      spotId:4,
      startDate:'2024-5-27',
      endDate:'2024-5-28'
    },
    {
      userId:2,
      spotId:3,
      startDate:'2024-9-24',
      endDate:'2024-10-05'
    },
    {
      userId:3,
      spotId:5,
      startDate:'2024-8-04',
      endDate:'2024-09-11'
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
    options.tableName = 'Bookings';
    await queryInterface.bulkDelete(options,{
      userId:1,
      userId:2,
      userId:3
    })
  }
};
