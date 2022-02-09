'use strict';
const express = require("express");
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const {Bug, sList, pList} = require("./models/Bug");
const {listBug, editBug, newBug} = require("./controllers/bugController");
const bugApi = require("./controllers/bugApiController");
const login = require("./controllers/loginController");
const logout = require("./controllers/logoutController");
const {createUser, newUser} = require("./controllers/userController");
const authMiddleware = require("./controllers/authMiddleware");

let app = express();
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
  limit: '50mb',
  extended: true }));
app.use(expressSession({
    secret: 'Mo Chau Woon'
}))
app.set('view engine', 'pug');

// enable dynamic port for heroku
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
console.log("after connect");

app.route('/').get(authMiddleware, listBug);

app.route('/auth/login')
  .get((req, res) => {
    const errors = req.session.errors || null;
    req.session.errors = null;
    res.render('pug/login', {errors})
  })
  .post(login);

app.route('/auth/newuser')
  .get(newUser)
  .post(createUser);

app.route('/auth/logout')
  .get(logout);
  
app.route('/newbug').get(authMiddleware,newBug);
app.route('/editbug/:bugID').get(authMiddleware,editBug);

app.route('/api/bugs/:bugID')
  .get(authMiddleware, bugApi.getBug)
  .put(authMiddleware, bugApi.updateBug);

app.route('/api/bugs').post(authMiddleware,bugApi.createBug);

//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Sorry, this request cannot be handled.');
});

