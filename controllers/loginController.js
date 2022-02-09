const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = (req, res) =>{
  const { userName, password } = req.body;
  User.findOne({userName}, (e,user) => {
    if (user) {
      bcrypt.compare(
        password, 
        user.password, 
        (e, same) =>{
          if(same){
            req.session.userId = user._id;
            res.redirect('/');
          } else {
            // store an error message to be shown later
            req.session.errors = ["Invalid user name and/or password"];
            res.redirect('/auth/login')  
          }
        })
    } else {
      // store an error message to be shown later
      req.session.errors = ["Invalid user name and/or password"];
      res.redirect('/auth/login')
    }
  })
} 