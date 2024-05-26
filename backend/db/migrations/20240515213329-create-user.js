'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING(30),
        allowNull:false,
        unique:true
      },
      email: {
        type: Sequelize.STRING(256),
        allowNull:false,
        unique:true
      },
      firstName:{
        type: Sequelize.STRING(30),
        allowNull:false
      },
      lastName:{
        type:Sequelize.STRING(30),
        allowNull:false
      },
      hashedPassword: {
        type: Sequelize.STRING.BINARY,
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
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    await queryInterface.dropTable(options);
  }
};