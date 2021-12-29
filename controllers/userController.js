const User = require('../models/User')

function newUser(req, res) {
  const errors = req.session.errors || null;
  req.session.errors = null;
  const data = req.session.body || {
    userName: "",
    password: "",
    email: "",
    fullName: ""
    };
  req.session.body = null;
  res.render('pug/newuser', {errors, data})
}

function createUser(req, res) {
  User.create(req.body, (err, user) => {
    if (err || !user) {
      // get the error message and store in session
      req.session.errors = Object.keys(err.errors).map(k=>err.errors[k].message);
      // store the data for later pre-filling
      req.session.body = req.body;
      res.redirect("/auth/newuser");
    } else {
      req.session.userId = user._id;
      res.redirect("/");
    }
  });
};

module.exports = {createUser, newUser};
