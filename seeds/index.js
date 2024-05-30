const mongoose = require('mongoose');
const Hotel = require('../models/hotel');

const location = ["Mumbai, Maharashtra", "Delhi, Delhi", "Bangalore, Karnataka", "Hyderabad, Telangana", "Chennai, Tamil Nadu", "Kolkata, West Bengal", "Pune, Maharashtra", "Ahmedabad, Gujarat", "Jaipur, Rajasthan", "Surat, Gujarat"];
const title = ["Royal Palace", "Sunset Inn", "City Lights Hotel", "Grand Hotel", "Golden Sands Resort", "Palm Tree Inn", "Mountain View Lodge", "Ocean Breeze Hotel", "Starlight Suites", "Lakeside Retreat"];
const description = ["Luxurious stay with breathtaking views", "Cozy atmosphere in the heart of the city", "Modern amenities and friendly staff", "Exquisite dining and spa services", "Relaxation by the poolside", "Spectacular mountain views", "Steps away from the beach", "Elegant rooms with a touch of class", "Perfect blend of comfort and convenience", "Tranquil escape from the bustling city life"];
const price = [3000, 5000, 10000, 4000, 7000, 15000, 5000, 13000, 9000, 15000]

mongoose
    .connect('mongodb://127.0.0.1:27017/hotel')
    .then(()=>console.log("Database Connected!"))
    .catch(err=>console.log(err))

const seedDB = async ()=>{
    await Hotel.deleteMany();
    for(let i=0; i<10; i++){
        const random = Math.floor(Math.random() * 10)
        const hotel = new Hotel({
            location: `${location[random]}`,
            title: `${title[random]}`,
            description: `${description[random]}`,
            price: `${price[random]}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/dzemf840s/image/upload/v1715859207/hotel/fllyf32mbpzmccsdxkkb.jpg',     
                  filename: 'hotel/pbtypw1abhlj0wmypc9n',
                },
                {
                  url: 'https://res.cloudinary.com/dzemf840s/image/upload/v1715856478/hotel/od9m39sgzmaed8agbcew.jpg',     
                  filename: 'hotel/od9m39sgzmaed8agbcew',
                }
              ]
    })
    await hotel.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})