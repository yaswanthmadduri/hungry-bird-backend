const restaurantBackendService = require('../services/restaurant.service');

const doAddItem =function(){
    return restaurantBackendService.doAddItemService().then(
        (res)=>{
            console.log("promise completed no error")
        },
        (err)=>{
            console.log('error exists');
        }
    );
}

module.exports = {
    doAddItem
};
