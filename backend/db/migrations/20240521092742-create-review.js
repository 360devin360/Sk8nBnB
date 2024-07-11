'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {}
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA
};

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        unique:'unique_key',
        references:{
          model:'Users'
        },
        onDelete:'cascade'
      },
      spotId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        unique:'unique_tag',
        references:{
          model:'Spots'
        },
        onDelete:"cascade"
      },
      review: {
          type: Sequelize.TEXT,
          allowNull:false,
      },
      stars: {
        type:Sequelize.INTEGER,
        allowNull:false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:new Date()
      }
    },{
      schema:options.schema,
      uniqueKeys:{
        unique_tag:{
          customIndex:true,
          fields:['spotId','userId']
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.dropTable(options);
  }
};