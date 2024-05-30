const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const Hotel = require('../models/hotel');
const hotels = require('../controllers/hotels')
const { isLoggedIn } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload =  multer({storage});


router.route('/')
    .get( hotels.index)
    .post(upload.array('image'), catchAsync(hotels.createHotel))
    

router.get('/new',isLoggedIn, hotels.renderNewForm)

router.route('/:id')
    .get(catchAsync(hotels.showHotel))
    .put(catchAsync(hotels.updateHotel))
    .delete(isLoggedIn, catchAsync(hotels.deleteHotel))

router.get('/:id/edit', isLoggedIn, catchAsync(hotels.renderEditForm))

module.exports = router;