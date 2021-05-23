const mongoose = require('mongoose');
const user = require('./userinfo');
const foodinCartSchema = mongoose.Schema({
    foodName:{
        type:String,
        required: true,
        unique: true
    },
    Quantity:{
        type: Number,
        required: true
    },
    BoughtorNot:{
        type: Boolean,
        required: true
    },
    totalCost:{
        type: Number
    }
},{ collection: 'foodincart'});

foodincart = new user()
const foodItem = module.exports = mongoose.model('foodincart',foodinCartSchema);