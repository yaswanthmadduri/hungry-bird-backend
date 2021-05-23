const express = require('express');
const app = express();
var cors = require("cors");
const MongoClient = require('mongodb').MongoClient;




const route = require('./routing');
//routing to routing.js file
app.use('/route', route)



app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


//mongo connect

const connectionString = "mongodb+srv://yaswanth:tknIDZPoWYFgz3Xr@hungrybirdcluster.fokxh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('HungryBird')
        const users = db.collection('users')

    })


//app listening to the requests at 3000
app.listen(3000, function () {
    console.log('listening on 3000')
})


//middleware adding - cors

app.use(cors());
