const {Bug} = require("../models/Bug");

function getBug(req, res) {
  Bug.findById(req.params.bugID, (err, bug) => {
    if (!err && bug) {
      return res.json(bug);
    } else {
      return res.send({ error: "bug not found" })
    }
  })
};

function updateBug(req, res) {
  let bug = {};
  for (let k in req.body) {
    if (k !== "_id") {
      bug[k] = req.body[k]
    }
  }
  bug.updatedOn = new Date();
  console.log({bug: bug});
  Bug.findByIdAndUpdate(req.params.bugID, bug, (err, savedBug) => {
    if (!err && savedBug) {
      return res.json({ returnCode: 0 });
    } else {
      return res.json({ returnCode: 9, err });
    }
  })
};

function createBug(req, res) {
  const b = new Bug({
    title: req.body.title,
    desc: req.body.desc,
    priority: req.body.priority,
    assignedTo: req.body.assignedTo || null,
    createdBy: req.session.userId
    // the || "" part is necessary otherwise, the field may not be stored when undefined
  });
  b.save(function(err, data) {
    if (err || !data) {
      res.json({ error: err.messages })
    }
    else {
      return res.json(data)
    }
  });
};

module.exports = {getBug, updateBug, createBug};