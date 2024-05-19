require('dotenv').config();
const {port} = require('../config');
const app = require('../app');
const db = require('../db/models');

db.sequelize
    .authenticate()
    .then(()=>{
        // console.log('Database conneciton success! Sequelize is ready to use...');
        // app.listen(port,()=>console.log(`Listening on port ${port}...`));
        app.listen(port)
    })
    .catch((err)=>{
        // console.log("Database connection failure.");
        // console.error(err);
    })