var express = require('express');
var router = express.Router();

const foodItem = require('../model/fooditem');
const userInfo = require('../model/userinfo');
const foodInCart = require('../model/foodincart');


const passport = require('passport');

const jwtHelper = require('../config/jwtHelper');

const _ = require('lodash');




////////////////// RESTAURANT DATA/////////////////////////



// retrieving food available at the restaurant from database
router.get('/restaurant/available-food-items',(req, res, next) => {
    foodItem.find(function (err, items) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(items);
        }
    })
});

// posting new food in the restaurant to database
router.post('/restaurant/add-item-to-list',jwtHelper.verifyJwtToken, (req, res, next) => {
    let newFoodItem = new foodItem();
    newFoodItem.itemName = req.body.itemName,
        newFoodItem.itemQuantityAvailable = req.body.itemQuantityAvailable,
        newFoodItem.itemQuantityBought = req.body.itemQuantityBought,
        newFoodItem.itemCost = req.body.itemCost,
        newFoodItem.itemType = req.body.itemType

        
    newFoodItem.save((err, newitem) => {
        if (!err)
            res.send(newitem + "Item has been added to the available list");
        else {
            if (err.code == 11000)
                res.status(422).send([newFoodItem.itemName + ' already exists.']);
            else
                return next(err);
        }
    });
});


//update food-item availability in the restuarant in database
router.put('/restaurant/food-item-list/:itemName', (req, res, next) => {

    foodItem.findOneAndUpdate(
        { "itemName": req.params.itemName },
        {
            $set: {
                itemQuantityAvailable: req.body.itemQuantityAvailable
            }
        }
        , function (err, updateditem) {
            if (err) {
                res.json(err);
            }
            else {
                res.json("item updated");
            }
        });

});


router.delete('/restaurant/food-item-list/:itemName', (req, res, next) => {
    foodItem.findByIdAndDelete({ "itemName": req.params.itemName },
        function (err, res) {
            if (err) {
                res.json(err);
            }
            else {
                res.json({ res: "item deleted from list" });
            }

        });
});

////////////// USER INFORMATION //////////////////////////////////////////

//Posting new user signup data to db.
router.post('/user-signup', (req, res, next) => {
    let newuserInfo = new userInfo();
    newuserInfo.email = req.body.userEmailId,
        newuserInfo.password = req.body.userPassword,
        newuserInfo.userName = req.body.userName,
        newuserInfo.userPhoneNumber = req.body.userPhoneNumber,
        newuserInfo.termsAccepted = req.body.termsAccepted,
        newuserInfo.signedUp = true,

        newuserInfo.save((err, newuser) => {
            if (!err)
                res.send(newuser);
            else {
                if (err.code == 11000)
                    res.status(422).send(['Email address already exists.']);
                else
                    return next(err);
            }
        });
});
//Getting all the user info from the db.

usersintheDB = router.get('/all-user-data', (req, res, next) => {

    userInfo.find(function (err, users) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(users);
        }
    })
});

//update user password in database
router.put('/user-info/change-password/:userEmailId',jwtHelper.verifyJwtToken ,(req, res, next) => {
    userInfo.findOneAndUpdate(
        { "userEmailId": req.params.userEmailId },
        {
            $set: {
                userPassword: req.body.userPassword,
            }
        }
        , function (err, users) {
            if (err) {
                res.json(err);
            }
            else {
                res.json(users);
            }
        });


});

// delete a user account
router.delete('/user-info/delete-account/:userEmailId', jwtHelper.verifyJwtToken,(req, res, next) => {
    userInfo.findOneAndDelete(
        { "userEmailId": req.params.userEmailId }
        , function (err, users) {
            if (err) {
                res.json(err);
            }
            else {
                res.json(users);
            }
        });
});

// authenticating the user to log in. i dont know clearly
router.post('/authenticate', (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt() });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);

});


// displaying the logged in user info i dont knwo whats being done here. 

router.get('/user-profile', jwtHelper.verifyJwtToken, (req, res, next) => {
    userInfo.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user: _.pick(user, ['userName', 'email', 'password' ,'userPhoneNumber']) });
        }
    );
});








// retrieving data from cart
router.get('/user/cart/foodincart', jwtHelper.verifyJwtToken, (req, res, next) => {
    foodInCart.find(function (err, items) {
        if (err) {
            res.json(err);
        }
        else {
            res.json(items);
        }
    })
});

// posting data to cart. we have to pass the verification jwt token as well
router.post('/user/cart/addtocart', jwtHelper.verifyJwtToken, (req, res, next) => {
    let foodincart = new foodInCart();

    nameOfFoodRequested = foodItem.find({ "itemName": req.body.foodName }
        , function (err, existingItem) {

            if (existingItem.length > 0) {
                //console.log(existingItem); checks if its not returning an empty object array
                foodincart.foodName = req.body.foodName;
                foodincart.Quantity = req.body.Quantity;
                foodincart.totalCost = req.body.totalCost;
                foodincart.BoughtorNot = req.body.BoughtorNot;

                foodincart.save((err, newitem) => {
                    if (!err)
                        res.send(newitem);
                    else {
                        if (err.code == 11000) {        
                            updateQuantity(res, foodincart.foodName, foodincart.Quantity);
                        }
                        else
                            return next(err);
                    }
                });
            }
            else {
                return res.json({ message: "Item doesnot exist" });
            }
        });
});

//updating quantity if item exists in cart
function updateQuantity(res, foodname, quantity) {

    foodInCart.findOneAndUpdate(
        { "foodName": foodname },
        {
            $set: {
                Quantity: quantity
            }
        }
        , function (err, response) {
            if (err) {
                console.log("err")
                return res.json(err);
            }
            else {
                return res.json({message: "Updated quantity to "+ quantity});
            }
        });
}




//update data in cart
router.put('/user/cart/update/:foodName/:Quantity', (req, res, next) => {
    foodInCart.findOneAndUpdate(
        { "foodName": req.params.foodName },
        {
            $set: {
                Quantity: req.params.Quantity
            }
        }
        , function (err, users) {
            if (err) {
                res.json(err);
            }
            else {
                res.json(users);
            }
        });
});

//On BUYING the ITEMS finally
router.put('/user/cart/update/boughtornot', (req, res, next) => {
    foodInCart.updateMany(
        {},
        {
            $set: {
                BoughtorNot: true
            }
        }
        , function (err, users) {
            if (err) {
                res.json(err);
            }
            else {
                res.json(users);
            }
        });
});



//Exporting router module.

module.exports = router;