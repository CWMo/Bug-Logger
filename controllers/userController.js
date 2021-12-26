const User = require('../models/User')

function createUser(req, res) {
  User.create(req.body, (err, user) => {
    if (err || !user) {
      console.log({ error: err });
      res.redirect("/auth/newUser");
    } else {
      res.redirect("/");
    }
  });
};

module.exports = {createUser};
