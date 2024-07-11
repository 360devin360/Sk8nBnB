'use strict';
/** @type {import('sequelize-cli').Migration} */
const {Review} = require('../models');
//define schema
let options = {}
if(process.env.NODE_ENV==='production'){
  options.schema = process.env.SCHEMA
};

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
   await Review.bulkCreate([
    {
      spotId:1,
      userId:2,
      stars:5,
      review:"I recently stayed at Demography's Spot located at 123 New Spot, the City in Idaho, USA, and it was an exceptional experience! The highlight of my stay was undoubtedly the backyard. It was a beautifully landscaped oasis, perfect for relaxation. The lush greenery and vibrant flowers created a serene atmosphere. There was a cozy seating area where I enjoyed my morning coffee while listening to the birds chirping. The backyard also featured a well-maintained barbecue area, which was great for evening cookouts. The attention to detail in the design and upkeep of the backyard truly made my stay memorable. Demography's Spot is a gem, and I highly recommend it for anyone looking for a peaceful retreat."
    },
    {
      spotId:2,
      userId:1,
      stars:4,
      review:"I was thoroughly impressed by the architecture. The building seamlessly blends traditional Mexican design with modern elements, creating a unique and captivating aesthetic. The intricate tile work and vibrant colors throughout the property are truly eye-catching. The spacious courtyard, adorned with beautiful arches and fountains, adds to the charm and elegance of the place. While there were a few minor issues, such as occasional noise from the street, the stunning architecture made my stay memorable. I highly recommend Fake Palace for its architectural beauty."
    },
    {
      spotId:3,
      userId:2,
      stars:2,
      review:"I recently stayed at Best Place Ever located at 1 The Moon, Apollo in Darkside, Earth, and it was quite underwhelming. While the idea of staying on the Moon sounded exciting, the reality was disappointing. The space-themed decor was interesting, but the overall experience left much to be desired. The room was cramped and lacked basic amenities. The view of space was obstructed by constant dust storms, making it hard to enjoy the scenery. Additionally, the lack of gravity made simple tasks incredibly difficult and uncomfortable. The advertised \"spacewalk\" was nothing more than a short, guided tour with very limited exploration. Overall, Best Place Ever did not live up to its name."
    },
    {
      spotId:4,
      userId:2,
      stars:3,
      review:"I recently visited Dreamland located at 0000 In Your Sleep, The Brain in Your Head, Body of Yourself. The experience was quite mixed. The place had a whimsical charm with ever-changing landscapes and vivid colors, making each visit unique. However, the inconsistency in the environment was a bit disorienting at times. Some dreams were pleasant and relaxing, while others were confusing and even unsettling. The transitions between different scenes were abrupt, disrupting the overall experience. Despite these issues, Dreamland offered a fascinating escape from reality. With more stability, it could be a truly magical place to visit."
    },
    {
      spotId:3,
      userId:1,
      stars:5,
      review:"Staying at Best Place Ever located at 1 The Moon, Apollo in Darkside, Earth was an absolutely phenomenal experience! The space-themed decor was out of this world, and the attention to detail was incredible. The room was spacious and comfortable, with a breathtaking view of the Earth from the window. The zero-gravity bed was a unique touch that made sleeping feel like floating on a cloud. The highlight of my stay was the spacewalk experience. It was thrilling to explore the lunar surface and take in the stunning views of the cosmos. The staff were knowledgeable and friendly, making sure every aspect of my stay was perfect. The amenities were top-notch, and the food was surprisingly delicious for space cuisine. Overall, Best Place Ever truly lives up to its name. It's a must-visit for anyone looking for a once-in-a-lifetime adventure in space. Highly recommended!"
    },
  ],{validate: true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options,{
      UserId:{[Op.in]:[1,2,3]},
    },{})
  }
};
