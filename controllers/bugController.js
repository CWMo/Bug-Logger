const {Bug, sList, pList} = require("../models/Bug");

function newBug(req, res) {
  res.render('pug/newbug', { pList });
};

function editBug(req, res) {
  const id = req.params.bugID;
  Bug.findById(id, (err, bug) => {
    if (!err && bug) {
      res.render('pug/editbug', { sList, pList, bug });
    } else {
      return res.send({ error: "bug not found" })
    }
  })
};

function listBug(req, res) {
  console.log({session: req.session});
  Bug.find((err, bList) => {
    res.render('pug/listbug', { bList });
  })
};

module.exports = {newBug, editBug, listBug};