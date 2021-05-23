const mongoose = require('mongoose');

const foodItemsInRestaurantSchema = mongoose.Schema({

    itemName:{
        type:String,
        required: true,
        unique : true
    },
    itemType:{
        type:String,
        required: true
    },
    itemCost:{
        type: Number,
        required: true
    },
    itemQuantityAvailable:{
        type:Number,
        required: true
    },
    itemQuantityBought:{
        type: Number,
        required: true
    }
}
,{ collection: 'fooditemsinrestaurant'});

const foodItem = module.exports = mongoose.model('foodItem',foodItemsInRestaurantSchema);