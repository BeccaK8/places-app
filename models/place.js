//=======================================
//===== Our Schema and Dependencies =====
//=======================================
const mongoose = require('../utils/connection');

// destructuring the Schema and model from mongoose
const { Schema, model } = mongoose;

//=======================================
//===== Schema Definition           =====
//=======================================
const PlaceSchema = new Schema({
    name: { type: String, required: true },
    region: { type: String, required: true },
    subRegion: { type: String, required: true },
    mapLink: { type: String, required: true },
    lat: { type: Number, required: true },
    long: { type: Number, required: true },
    flag: { type: String, required: true },
    flagSmall: { type: String, required: true },
    visited: { type: Boolean, required: true },
    wishList: { type: Boolean, required: true },
    favorite: { type: Boolean, required: true },
    owner: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    }
}, {
    timestamps: true
});

//=======================================
//===== Create Place Model           =====
//=======================================
const Place = model('Place', PlaceSchema);

//=======================================
//===== Export Place Model           =====
//=======================================
module.exports = Place;