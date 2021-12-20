const mongoose = require("mongoose");

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
module.exports = {Bug, sList, pList};