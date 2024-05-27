'use strict';
/** @type {import('sequelize-cli').Migration} */
// define schema name
// create an option object
let options = {}
// check environment (production or development)
if(process.env.NODE_ENV === 'production'){
  // if enviorment is production then create schema property in options equal to .env.SCHEMA
  options.schema = process.env.SCHEMA;
}
// add constraints to fields
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName:{
        type:Sequelize.STRING,
        allowNull:false,
      },
      lastName:{
        type:Sequelize.STRING,
        allowNull:false,
      },
      email: {
        type: Sequelize.STRING(256),
        allowNull:false,
        unique:true
      },
      username: {
        type: Sequelize.STRING(30),
        allowNull:false,
        unique:true
      },
      hashedPassword: {
        type: Sequelize.STRING.BINARY,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:new Date()
      }
    },options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    return queryInterface.dropTable(options);
  }
};