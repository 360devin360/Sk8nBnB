'use strict';

/** @type {import('sequelize-cli').Migration} */
const {SpotImage} = require('../models')
let options = {}
if(process.env.NODE_ENV==='production'){
  options.schema = process.env.SCHEMA
}
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await SpotImage.bulkCreate([
    {
      spotId:1,
      url:'https://thumbs.dreamstime.com/z/hotel-bed-room-21064950.jpg?ct=jpeg',
      preview:true
    },
    {
      spotId:2,
      url:'https://thumbs.dreamstime.com/z/hotel-room-27254386.jpg?ct=jpeg',
      preview:true
    },
    {
      spotId:3,
      url:'https://thumbs.dreamstime.com/z/hotel-room-beautiful-orange-sofa-included-43642330.jpg?ct=jpeg',
      preview:true
    },
    {
      spotId:4,
      url:'https://thumbs.dreamstime.com/z/modern-living-room-interior-brick-wall-blank-sofa-lounge-chair-table-wooden-floor-plants-carpet-hidden-lighting-d-render-143406624.jpg?w=992',
      preview:true
    },
    {
      spotId:5,
      url:'https://thumbs.dreamstime.com/z/modern-interior-design-small-apartment-modern-interior-design-small-apartment-open-space-kitchen-101784831.jpg?ct=jpeg',
      preview:true
    },
    {
      spotId:1,
      url:'https://thumbs.dreamstime.com/z/living-room-new-luxury-home-furnished-47971170.jpg?ct=jpeg',
      preview:false
    },
    {
      spotId:1,
      url:'https://thumbs.dreamstime.com/z/contemporary-grey-living-room-interior-stylish-sofa-coffe-table-side-table-floor-light-rug-33050033.jpg?ct=jpeg',
      preview:false
    },
    {
      spotId:1,
      url:'https://thumbs.dreamstime.com/z/beautiful-modern-living-room-interior-stone-wall-fireplace-luxury-home-firepl-125640393.jpg?ct=jpeg',
      preview:false
    },
    {
      spotId:1,
      url:'https://thumbs.dreamstime.com/z/modern-living-room-interior-interior-mockup-white-couch-near-empty-shiplap-wall-d-render-modern-living-room-interior-d-render-176907221.jpg?ct=jpeg',
      preview:false
    },
    {
      spotId:2,
      url:'https://thumbs.dreamstime.com/z/abstract-painting-grey-wall-retro-living-room-interior-beige-sofa-pillows-vintage-dark-green-armchair-yellow-pouf-140888820.jpg?ct=jpeg',
      preview:false
    },
    {
      spotId:2,
      url:'https://thumbs.dreamstime.com/z/modern-living-room-style-218591854.jpg?ct=jpeg',
      preview:false
    },
    {
      spotId:2,
      url:'https://thumbs.dreamstime.com/z/white-living-room-sofa-hipster-style-pouf-carpet-bike-90501674.jpg?ct=jpeg',
      preview:false
    },
    {
      spotId:2,
      url:'https://thumbs.dreamstime.com/z/living-room-lighting-scones-12662407.jpg?ct=jpeg',
      preview:false
    },
    {
      spotId:3,
      url:'https://thumbs.dreamstime.com/z/living-room-art-21663795.jpg?ct=jpeg',
      preview:false
    },
    {
      spotId:3,
      url:'https://thumbs.dreamstime.com/z/sleek-modern-living-room-elegant-marble-flooring-307888645.jpg?ct=jpeg',
      preview:false
    },
    {
      spotId:3,
      url:'https://thumbs.dreamstime.com/z/modern-living-room-bright-colors-63593641.jpg?ct=jpeg',
      preview:false
    },
    {
      spotId:3,
      url:'https://thumbs.dreamstime.com/z/hotel-room-clean-modern-40763276.jpg?ct=jpeg',
      preview:false
    },
    {
      spotId:4,
      url:'https://thumbs.dreamstime.com/z/office-room-8439522.jpg?ct=jpeg',
      preview:false
    },
    {
      spotId:4,
      url:'https://thumbs.dreamstime.com/z/living-room-wall-windows-12798035.jpg?ct=jpeg',
      preview:false
    },
    {
      spotId:4,
      url:'https://thumbs.dreamstime.com/z/modern-interior-design-living-room-d-rendering-113798257.jpg?ct=jpeg',
      preview:false
    },
    {
      spotId:4,
      url:'https://thumbs.dreamstime.com/z/interior-modern-living-room-sofa-furniture-d-rendering-interior-modern-living-room-sofa-furniture-d-128166586.jpg?ct=jpeg',
      preview:false
    },
    {
      spotId:5,
      url:'https://thumbs.dreamstime.com/z/sheer-white-curtains-window-living-room-interior-striped-linen-pillow-modern-wicker-chair-130193495.jpg?ct=jpeg',
      preview:false
    },
    {
      spotId:5,
      url:'https://thumbs.dreamstime.com/z/sitting-room-600230.jpg?ct=jpeg',
      preview:false
    },
    {
      spotId:5,
      url:'https://thumbs.dreamstime.com/z/living-room-luxury-condo-kuala-lumpur-malaysia-51101161.jpg?ct=jpeg',
      preview:false
    },
    {
      spotId:5,
      url:'https://thumbs.dreamstime.com/z/massage-room-10671204.jpg?ct=jpeg',
      preview:false
    },

   ],{validate:true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options,{
      spotId:{
        [Op.in]:[1,2,3]
      }
    },{})
  }
};
