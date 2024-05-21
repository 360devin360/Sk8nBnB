'use strict';
/** @type {import('sequelize-cli').Migration} */
let options = {}
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Spots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ownerId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Users'
        }
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull:false
      },
      address: {
        type: Sequelize.STRING,
        allowNull:false,
        unique:'unique_tag'
      },
      city: {
        type: Sequelize.STRING,
        allowNull:false,
        unique:'unique_tag'
      },
      state: {
        type: Sequelize.STRING,
        allowNull:false,
        unique:'unique_tag'
      },
      country: {
        type: Sequelize.STRING,
        allowNull:false
      },
      lat: {
        type: Sequelize.FLOAT,
      },
      lng: {
        type: Sequelize.FLOAT
      },
      description: {
        type: Sequelize.STRING(150),
        allowNull:false
      },
      price: {
        type: Sequelize.DECIMAL,
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
    },{
      uniqueKeys:{
        unique_tag:{
          customeIndex:true,
          fields:['address','city','state']
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Spots');
  }
};