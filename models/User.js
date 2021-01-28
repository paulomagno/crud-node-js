const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

userSchema.plugin(passportLocalMongoose,{usernameField:'email'});

module.exports = mongoose.model('User',userSchema);