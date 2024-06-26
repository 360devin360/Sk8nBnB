'use strict';
const{Model} = require('sequelize');
const { Sequelize } = require('.');

module.exports = (sequelize, Datatype) => {
    class Booking extends Model{
        static associate(models){

            Booking.belongsTo(models.Spot,{
                foreignKey:"spotId",
                onDelete:'cascade'
            })
            Booking.belongsTo(models.User,{
                foreignKey:'userId',
                onDelete:'cascade'
            })
        };
    }
    Booking.init({
        spotId:{
            type:Datatype.INTEGER,
            allowNull:false,
            references:{
                model:'Spots'
            },
            onDelete:'cascade'
        },
        userId:{
            type:Datatype.INTEGER,
            allowNull:false,
            references:{
                model:'Users'
            },
            onDelete:'cascade'
        },
        startDate:{
            type:Datatype.DATE,
            allowNull:false,
            validate:{
                // isAfter:new Date().toDateString(),
                isBefore(value){
                    if(value>=this.endDate){
                        throw new Error('endDate cannot be on or before startDate')
                    }
                }
            }
        },
        endDate:{
            type:Datatype.DATE,
            allowNull:false,
            validate:{
                isAfter(value){
                    if(value<=this.startDate){
                        throw new Error('endDate cannot be on or before startdate')
                    }
                }
            }
        },
    },{
        sequelize,
        modelName:'Booking',
    });
  
    return Booking;
};