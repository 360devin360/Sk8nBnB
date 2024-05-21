'use strict';
/** @type {import('sequelize-cli').Migration} */
const {Review} = require('../models');
//define schema
let options = {}
if(process.env.NODE_ENV==='production'){
  options.schema = process.env.SCHEMA
};

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
   await Review.bulkCreate([
    {
      spotId:1,
      userId:1,
      stars:5,
      review:'This is the best!'
    },
    {
      spotId:2,
      userId:2,
      stars:4,
      review:'This is great!'
    },
    {
      spotId:3,
      userId:3,
      stars:2,
      review:'This is not so good.'
    },
    {
      spotId:4,
      userId:2,
      stars:3,
      review:'This is ok.'
    },
    {
      spotId:5,
      userId:3,
      stars:4,
      review:'This is great!'
    },
    {
      spotId:3,
      userId:1,
      stars:5,
      review:'This is awesome!'
    },
  ],{validate: true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,{
      UserId:{[Op.in]:[1,2,3]},
    },{})
  }
};
