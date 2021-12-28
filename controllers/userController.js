const User = require('../models/User')

function createUser(req, res) {
  User.create(req.body, (err, user) => {
    if (err || !user) {
      console.log({ error: err });
      res.redirect("/auth/newuser");
    } else {
      req.session.userId = user._id;
      res.redirect("/");
    }
  });
};

module.exports = {createUser};
