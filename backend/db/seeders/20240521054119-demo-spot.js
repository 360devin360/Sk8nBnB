'use strict';
/** @type {import('sequelize-cli').Migration} */
// import Spot model and bycryptjs
const {Spot} = require('../models');

// define the schema name
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
   await Spot.bulkCreate([
    {
      ownerId:1,
      name:"demography's spot",
      address:'123 new spot',
      city:"the City",
      state:"Idaho",
      country:'USA',
      lat:12.3478,
      lng:43.2156,
      description:'A new place to live',
      price:123456.99
    },
    {
      ownerId:2,
      name:"Fake Palace",
      address:'999 Palace Rd',
      city:"Oasis",
      state:"Youdaho",
      country:'Mexico',
      lat:46.9634,
      lng:72.2521,
      description:'The beautiful Palace Place',
      price:99999999.99
    },
    {
      ownerId:3,
      name:"Best Place Ever",
      address:'1 The Moon',
      city:"Apollo",
      state:"Darkside",
      country:'Earth',
      lat:89,
      lng:179,
      description:'The first place on the moon to stay',
      price:0.01
    },
    {
      ownerId:1,
      name:"Dreamland",
      address:'0000 In Your Sleep',
      city:"The Brain",
      state:"Your Head",
      country:'Body of Yourself',
      lat:-89,
      lng:-179,
      description:'Where all your dreams come true.',
      price:1.99
    },
    {
      ownerId:2,
      name:"This Last Location",
      address:'Unkown',
      city:"Somewhere",
      state:"A Place",
      country:'Has A Name',
      lat:47.873,
      lng:72.1699,
      description:'If you can find it you can stay',
      price:99.99
    },
   ],{validate:true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options,{
      name:{[Op.in]:["demography's spot","Fake Palace","Best Place Ever","Dreamland","This Last Location"]}
    },{});
  }
};
