const Review = require('../models/review');
const Hotel = require('../models/hotel');

module.exports.createReview = async (req, res) => {
    const hotel = await Hotel.findById(req.params.id);
    const review = new Review(req.body.review);
    hotel.reviews.push(review);
    await review.save();
    await hotel.save();
    req.flash('success', 'Created new Review!');
    res.redirect(`/hotels/${hotel._id}`);
}

module.exports.deleteReview = async (req, res) =>{
    const {id, reviewId} = req.params;
    await Hotel.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted Review');
    res.redirect(`/hotels/${id}`);

}