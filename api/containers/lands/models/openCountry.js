const mongoose = require('mongoose');
const openCountrySchema = new mongoose.Schema({
	name: String,
	releaseDate: Date,
    minLat: Number,
    minLng: Number,
    maxLat: Number,
    maxLng: Number,
    ranges: [{
    	description: { type: String, default: '' },
        lat: [],
        lng: [],
    },{ _id : false }]
});

module.exports = openCountrySchema;
