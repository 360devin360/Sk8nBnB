'use strict';
const{Model} = require('sequelize');

module.exports = (sequelize, Datatype) => {
    // async function dateCheck(value){
    //     const booking = await Booking.findAll()
    //     throw new Error
    // }
    class Booking extends Model{
        static associate(models){
            
        };
    }
    Booking.init({
        userId:{
            type:Datatype.INTEGER,
            allowNull:false,
            references:{
                model:'Users'
            }
        },
        spotId:{
            type:Datatype.INTEGER,
            allowNull:false,
            references:{
                model:'Spots'
            }
        },
        startDate:{
            type:Datatype.DATE,
            allowNull:false,
            validate:{
                isAfter:new Date(),
                isBefore:this.endDate
            }
        },
        endDate:{
            type:Datatype.DATE,
            allowNull:false,
            validate:{
                isAfter:this.startDate
            }
        },
    },{
        sequelize,
        modelName:'Booking',
    });
  
    return Booking;
};