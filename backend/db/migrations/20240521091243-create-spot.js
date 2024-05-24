'use strict';

let options = {};

if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA
};

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
        // references:{
        //   model:'Users'
        // },
        // onDelete:"set null"
      },
      address: {
        type: Sequelize.STRING,
        allowNull:false,
        // unique:"unique_tag"
      },
      city: {
        type: Sequelize.STRING,
        allowNull:false,
        // unique:'unique_tag'
      },
      state: {
        type: Sequelize.STRING,
        allowNull:false,
        // unique:'unique_tag'
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
      name: {
        type: Sequelize.STRING(50),
        allowNull:false
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
    },options);

    await queryInterface.addIndex(options.tableName,[
        "address",
        "city",
        "state"
      ])
  },

  async down(queryInterface, _Sequelize) {
    options.tableName = "Spots"
    await queryInterface.dropTable(options);
  }
};