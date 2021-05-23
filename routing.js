const express = require('express');
const router = new express.Router();
const dataController = require('./controllers/restaurantcontroller')

// Home page route.
router.get('/', function (req, res) {
  res.send('Wiki home page');
})


router.post('/additem', dataController.doAddItem);



//Exporting router module.

module.exports = router;