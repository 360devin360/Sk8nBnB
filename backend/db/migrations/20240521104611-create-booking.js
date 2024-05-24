'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {}
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA
}

module.exports = {
  async up(queryInterface, Sequelize) { 
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Users'
        },
        onDelete:'cascade'
      },
      spotId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Spots'
        },
        onDelete:'cascade'
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull:false,
      },
      endDate: {
        type: Sequelize.DATE,
      //   allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:new Date()
      }
    },options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings'
    await queryInterface.dropTable(options);
  }
};