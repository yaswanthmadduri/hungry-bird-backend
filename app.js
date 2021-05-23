var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cors = require("cors");
require('./config/config');
require('./config/passportconfig');

//instantiating the express
var app = express();

//instantiating passport
const passport = require('passport');


//importing the route.js file, so that, all routes are transferred to it.
const route = require('./routes/routes');

//connecting to mongodb
const connectionString = "mongodb+srv://yaswanth:tknIDZPoWYFgz3Xr@hungrybirdcluster.fokxh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(connectionString,{ useUnifiedTopology: true, useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
//on connection to mongodb
mongoose.connection.on('connected', ()=>{
    console.log("Connected to Mongo DataBase Compass");
});

//on error in connecting to mongodb
mongoose.connection.on('error', (err)=>{
    console.log(err);
});



// error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
});



//middleware adding - cors

app.use(cors());

//middleware adding - body-parser.json

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(passport.initialize());



//changing the route scope to routes.js

app.use('/api/', route)

const PORT = 3000;

app.get('/',(req,res)=>{
    res.send('getting this data for /')
})

app.listen(PORT, ()=>{
    console.log('server has been started on port: '+ PORT);
})