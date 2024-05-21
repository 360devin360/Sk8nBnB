'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {}
if(process.env.NODE_ENV==='production'){
  options.schema = process.env.SCHEMA
};

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Spots', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      ownerId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Users'
        }
      },
      name: {
        type: Sequelize.STRING(49),
        allowNull:false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull:false,
        isUnique:true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull:false,
      },
      state: {
        type: Sequelize.STRING,
        allowNull:false
      },
      country: {
        type: Sequelize.STRING,
        allowNull:false
      },
      lat: {
        type: Sequelize.FLOAT,
      },
      lng: {
        type: Sequelize.FLOAT,
      },
      description: {
        type: Sequelize.STRING(150),
        allowNull:false
      },
      price: {
        type: Sequelize.DECIMAL(12,2),
        allowNull:false
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
    });
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.dropTable(options);
  }
};