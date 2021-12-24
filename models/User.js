const mongoose = require("mongoose");

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    trim: true,
    required: "User Name is required", 
    unique: true 
    },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    validate: [validateEmail, 'Please fill a valid email address']
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;