'use strict';
const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const {Bug, sList, pList} = require("./models/Bug");
const {listBug, editBug, newBug} = require("./controllers/bugController");
const bugApi = require("./controllers/bugApiController");

let app = express();
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');

app.listen(3000, () => {
  console.log('App listening on port 3000')
})

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
console.log("after connect");

app.route('/').get(listBug);
app.route('/newbug').get(newBug);
app.route('/editbug/:bugID').get(editBug);

app.route('/api/bugs/:bugID')
  .get(bugApi.getBug)
  .put(bugApi.updateBug);

app.route('/api/bugs').post(bugApi.createBug);

//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Sorry, this request cannot be handled.');
});

