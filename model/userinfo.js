const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

require('../config/passportconfig');

const userSignupSchema = mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password cannot be empty'],
        minlength: [6, 'Password cannot be less than 4 letters'],
        maxlength: [20, 'Password cannot be more than 20 letters']
    },
    userName: {
        type: String,
        required: true,
        minlength: [4, 'Name cannot be less than 4 letters'],
        maxlength: [15, 'Name cannot be more than 20 letters']
    },
    userPhoneNumber: {
        type: Number,
        required: true,
        min: [1000000000, 'Enter a valid number'],
        max: [9999999999, 'Enter a valid number']
    },

    termsAccepted: {
        type: Boolean,
        required: true

    },
    signedUp: {
        type: Boolean
    },
    saltSecret: {
        type: String
    }
},{ collection: 'users'});


// Custom validation for email
userSignupSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');


// Custom validation for phone number
userSignupSchema.path('userPhoneNumber').validate((val) => {
    phnumRegex = /^\d{10}$/;
    return phnumRegex.test(val);
}, 'Invalid Phone number.');


// Event for encrypting password
userSignupSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});


// Methods
userSignupSchema.methods.verifyPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

userSignupSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id},
        process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXP
    });
}



const userSchema = module.exports = mongoose.model('userSchema', userSignupSchema);