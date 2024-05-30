const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews')
const Review = require('../models/review');
const Hotel = require('../models/hotel')

router.post('/', catchAsync(reviews.createReview))

router.delete('/:reviewId', catchAsync(reviews.deleteReview))

module.exports = router;