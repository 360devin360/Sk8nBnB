'use strict';
/** @type {import('sequelize-cli').Migration} */

// imnport User model and bycryptjs
const {User} = require('../models');
const bcrypt = require('bcryptjs');

// define schema name
let options = {};
if(process.env.NODE_ENV === 'production'){
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
   await User.bulkCreate([
    {
      email: 'demo@user.io',
      username: 'Demo-lition',
      firstName: 'demography',
      lastName: 'litionate',
      hashedPassword: bcrypt.hashSync('password')
    },
    {
      email: 'user1@user.io',
      username: 'FakeUser1',
      firstName:'Fakeer',
      lastName:'Thanyou',
      hashedPassword: bcrypt.hashSync('password2')
    },
    {
      email: 'user2@user.io',
      username: 'FakeUser2',
      firstName:'Fakest',
      lastName:'Usery',
      hashedPassword: bcrypt.hashSync('password3')
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
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options,{
      username:{[Op.in]:['Demo-lition','FakeUser1','FakeUser2']}
    },{});
  }
};
