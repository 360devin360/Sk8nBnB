'use strict';


/** @type {import('sequelize-cli').Migration} */
let options  = {};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ReviewImages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reviewId: {
        type: Sequelize.INTEGER,
        references:{
          model:'Reviews'
        },
        onDelete:'cascade'
      },
      url: {
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
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
    options.tableName = 'ReviewImages'
    await queryInterface.dropTable(options);
  }
};