const {Bug, sList, pList} = require("../models/Bug");
const User = require("../models/User");

function newBug(req, res) {
  User.find().exec((err, uList)=>{
    res.render('pug/newbug', { pList, uList });
  })
};

function editBug(req, res) {
  const id = req.params.bugID;
  Bug.findById(id)
    .populate("createdBy")
    .populate("assignedTo")
    .exec((err, bug) => {
      if (!err && bug) {
        User.find().exec((err, uList)=>{
          res.render('pug/editbug', { 
            sList, pList, uList, bug 
          })
        });
      } else {
        return res.send({ error: "bug not found" })
      }
    })
};

function listBug(req, res) {
  Bug.find()
    .populate("createdBy")
    .populate("assignedTo")
    .exec((err, bList) => {
      if (!err && bList) {
        res.render('pug/listbug', { bList });
      } else {
        console.log(err);
        res.render('pug/listbug', { bList:{} });
      }
    })
};

module.exports = {newBug, editBug, listBug};