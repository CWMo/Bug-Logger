const mongoose = require("mongoose");
var unique = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = new mongoose.Schema({
  userName: { 
    type: String, 
    trim: true,
    required: "User Name is required", 
    unique: true 
    },
  password: { type: String, required: true },
  fullName: { type: String, required: true, unique: true },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    validate: [validateEmail, 'Please fill a valid email address']
  }
});

userSchema.pre('save', function(next){
  const user = this;
  bcrypt.hash(user.password, 2, (error, hash) => {
    user.password = hash
    next()
  })
})

userSchema.plugin(unique);

const User = mongoose.model('User', userSchema);
module.exports = User;