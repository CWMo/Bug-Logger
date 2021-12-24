const User = require('../models/User')
module.exports = (req, res) =>{
  const { username, password } = req.body;
  User.findOne({username}, (error,user) => {
    if (user) {
      res.redirect('/')
    } else {
      res.redirect('/auth/login')
    }
  })
} 