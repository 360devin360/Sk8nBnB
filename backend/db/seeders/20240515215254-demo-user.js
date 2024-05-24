'use strict';

// imnport User model and bycryptjs
const {User} = require('../models');
const bcrypt = require('bcryptjs');

// define schema name
let options = {};
<<<<<<< HEAD
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA
};
=======

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
>>>>>>> a799391ea5e6844fc4ad2b60ff6f26f985c20a23
module.exports = {
  async up (_queryInterface, _Sequelize) {
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
