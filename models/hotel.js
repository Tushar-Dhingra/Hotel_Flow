const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const HotelSchema = new Schema({
    title: String,
    price: Number,
    images: [
        {url: String,
         filename: String
        }
    ],
    location: String,
    description: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

HotelSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


module.exports = mongoose.model('Hotel', HotelSchema)