'use strict';
const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

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

const sList = ['Open', 'In Progress', 'Closed', 'Cancelled', 'Suspended'];
const pList = ['Topmost', 'Severe', 'Medium', 'Low'];
const bugSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  priority: {
    type: String,
    enum: pList,
    required: true
  },
  assignedTo: String,
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: sList,
    default: "Open"
  }
});

let Bug = mongoose.model('Bug', bugSchema);
let bug = { title: "", desc: "", _id: "" };

app.route('/')
  .get(function(req, res) {
    Bug.find((err, bList) => {
      console.log(bList);
      res.render('pug/listbug', { bList });
    })
  });

app.route('/newbug')
  .get(function(req, res) {
    res.render('pug/newbug', { pList, bug });
  });

app.route('/editbug/:bugID').get(function(req, res) {
  const id = req.params.bugID;
  Bug.findById(id, (err, bug) => {
    if (!err && bug) {
      res.render('pug/editbug', { sList, pList, bug });
    } else {
      return res.send({ error: "bug not found" })
    }
  })
});

app.route('/api/bugs/:bugID')
  .get(function(req, res) {
    const id = req.params.bugID;
    Bug.findById(id, (err, bug) => {
      if (!err && bug) {
        return res.json(bug);
      } else {
        return res.send({ error: "bug not found" })
      }
    })
  })
  .put(function(req, res) {
    const id = req.params.bugID;
    let bug = {};
    for (let k in req.body) {
      if (k !== "_id") {
        bug[k] = req.body[k]
      }
    }
    bug.updatedOn = new Date();
    Bug.findByIdAndUpdate(id, bug, (err, savedBug) => {
      if (!err && savedBug) {
        return res.json({ returnCode: 0 });
      } else {
        return res.json({ returnCode: 9, err });
      }
    })
  });

app.route('/api/bugs')
  .post(function(req, res) {
    const b = new Bug({
      title: req.body.title,
      desc: req.body.desc,
      priority: req.body.priority,
      assignedTo: req.body.assignedTo || ""
      // the || "" part is necessary otherwise, the field may not be stored when undefined
    });
    b.save(function(err, data) {
      if (err || !data) {
        console.log(`error: ${err}`);
        console.log(err);
        res.json({ error: err.messages })
      }
      else {
        console.log(`data: ${data}`);
        return res.json(data)
      }
    });
  });
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Sorry, this request cannot be handled.');
});

