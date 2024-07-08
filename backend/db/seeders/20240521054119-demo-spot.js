'use strict';
/** @type {import('sequelize-cli').Migration} */
// import Spot model and bycryptjs
const {Spot} = require('../models');

// define the schema name
let options = {};
if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA
}

module.exports = {
  async up (_queryInterface, _Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await Spot.bulkCreate([
    {
      ownerId:1,
      name:"demography's spot",
      address:'123 new spot',
      city:"the City",
      state:"Idaho",
      country:'USA',
      lat:12.3478,
      lng:43.2156,
      description:'Nestled in the heart of the City, Idaho, Demography Spot offers a serene retreat perfect for those seeking a blend of comfort and natural beauty. This charming location is renowned for its picturesque backyard, a true haven for nature lovers. Imagine waking up to the sight of lush greenery, vibrant flowers, and the gentle rustling of leaves. The backyard is a meticulously landscaped oasis, featuring a variety of native plants and trees that provide a tranquil and refreshing atmosphere. Guests can enjoy their morning coffee on the spacious patio, overlooking a serene pond that reflects the clear blue sky. The sound of birds chirping and the occasional sighting of local wildlife add to the enchanting experience. As the sun sets, the backyard transforms into a magical space with soft lighting that highlights the natural beauty of the surroundings. Whether you’re looking to relax with a good book, enjoy a family barbecue, or simply take in the stunning views, the backyard at Demography Spot is the perfect place to unwind and connect with nature. This idyllic location offers a unique blend of comfort and natural beauty, making it an ideal choice for your next getaway.',
      price:123456.99
    },
    {
      ownerId:2,
      name:"Fake Palace",
      address:'999 Palace Rd',
      city:"Oasis",
      state:"Youdaho",
      country:'Mexico',
      lat:46.9634,
      lng:72.2521,
      description:'Located at 999 Palace Rd. in the charming town of Oasis, Youdaho, Mexico, Fake Palace offers a unique and enchanting stay. This whimsical location is renowned for its stunning architecture and beautifully designed interiors that transport guests to a world of elegance and grandeur. The palace, though playfully named, is anything but ordinary. It boasts intricate designs, luxurious furnishings, and a sense of timeless beauty that captivates all who visit. The palace’s exterior is equally impressive, with its majestic facade and grand entrance that welcome guests into a realm of opulence. Inside, each room is thoughtfully decorated, blending classic and contemporary styles to create a luxurious yet comfortable atmosphere. High ceilings, ornate chandeliers, and exquisite artwork adorn the spaces, providing a feast for the eyes at every turn. Guests can enjoy a variety of amenities, including spacious lounges, a well-equipped fitness center, and a gourmet restaurant that serves delectable local and international cuisine. The attentive staff at Fake Palace are dedicated to ensuring a memorable stay, offering personalized service and attention to detail. This enchanting location combines luxury and natural beauty, making it an ideal destination for those seeking a memorable and serene getaway.',
      price:99999999.99
    },
    {
      ownerId:3,
      name:"Best Place Ever",
      address:'1 The Moon',
      city:"Apollo",
      state:"Darkside",
      country:'Earth',
      lat:89,
      lng:179,
      description:'Located at 1 The Moon in Apollo, Darkside on Earth, Best Place Ever offers an extraordinary and otherworldly experience. This unique destination is renowned for its stunning architecture and captivating design, blending futuristic elements with a touch of classic elegance. The moment you arrive, you’re greeted by a grand entrance that sets the tone for the luxurious experience that awaits. Inside, the interiors are nothing short of spectacular. High ceilings, expansive windows, and exquisite decor create an atmosphere of opulence and comfort. Each room is thoughtfully designed to provide the utmost in luxury and relaxation, with plush furnishings and state-of-the-art amenities. The attention to detail is evident in every corner, from the intricate artwork adorning the walls to the carefully curated furniture. Best Place Ever also boasts a range of top-notch facilities, including a gourmet restaurant serving delectable cuisine, a well-equipped fitness center, and a serene spa offering a variety of treatments. The staff are dedicated to providing exceptional service, ensuring that every guest’s stay is memorable and enjoyable. This enchanting location combines luxury and innovation, making it an ideal destination for those seeking a truly unique and unforgettable getaway. Whether you’re here for relaxation or adventure, Best Place Ever promises an experience like no other.',
      price:0.01
    },
    {
      ownerId:1,
      name:"Dreamland",
      address:'0000 In Your Sleep',
      city:"The Brain",
      state:"Your Head",
      country:'Body of Yourself',
      lat:-89,
      lng:-179,
      description:'Located at 0000 In Your Sleep, in the city of The Brain, state of Your Head, within the country of Body of Yourself, Dreamland offers an unparalleled escape into a realm of imagination and tranquility. This enchanting destination is renowned for its surreal and captivating ambiance, blending the ethereal with the familiar to create a truly unique experience. Upon arrival, guests are greeted by a mesmerizing entrance that sets the tone for the dreamlike journey ahead. Inside, the interiors are a harmonious blend of comfort and fantasy, with each room designed to evoke a sense of wonder and relaxation. Plush furnishings, soft lighting, and whimsical decor create an atmosphere that is both soothing and inspiring. Dreamland boasts a variety of amenities designed to enhance your stay. Enjoy a gourmet dining experience with dishes that tantalize the senses, or unwind in the serene spa, offering treatments that rejuvenate both body and mind. The attentive staff are dedicated to ensuring your stay is as comfortable and memorable as possible, providing personalized service with a touch of magic. This extraordinary location combines luxury and imagination, making it an ideal destination for those seeking a truly unique and unforgettable getaway. Whether you’re here to relax or explore the depths of your imagination, Dreamland promises an experience like no other.',
      price:1.99
    },
    {
      ownerId:2,
      name:"This Last Location",
      address:'Unkown',
      city:"Somewhere",
      state:"A Place",
      country:'Has A Name',
      lat:47.873,
      lng:72.1699,
      description:'Located at the mysterious address “Unknown” in the enigmatic city of Somewhere, within the state of A Place, in the country of Has A Name, This Last Location offers an intriguing and unforgettable experience. This hidden gem is shrouded in mystery, inviting only the most adventurous souls to uncover its secrets. The allure of This Last Location lies in its very name—if you can find it, you can stay. Upon arrival, guests are greeted by an atmosphere of wonder and curiosity. The architecture is a blend of eclectic styles, creating a unique and captivating environment. Inside, each room is designed to evoke a sense of discovery and enchantment, with whimsical decor and unexpected details that delight at every turn. Plush furnishings and modern amenities ensure a comfortable and luxurious stay. This Last Location also offers a range of exceptional facilities, including a gourmet restaurant serving exquisite cuisine, a cozy lounge for relaxation, and a library filled with rare and intriguing books. The staff are dedicated to providing personalized service, ensuring that every guest’s stay is as memorable as it is unique. This extraordinary destination combines mystery and luxury, making it an ideal choice for those seeking an adventure like no other. If you can find it, you can stay, and you will be rewarded with an experience that is truly one of a kind.',
      price:99.99
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
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options,{
      name:{[Op.in]:["demography's spot","Fake Palace","Best Place Ever","Dreamland","This Last Location"]}
    },{});
  }
};
