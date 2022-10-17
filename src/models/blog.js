const mongoose = require("mongoose");

const Schema = mongoose.Schema;
 
const blogSchema = new Schema({
  userId: {
    type: String,
    required: true,
    default: 0
  },
  title: {
    type: String,
    required: true,
    max: 50,
    default: ""
  },
  body: {
    type: String,
    required: true,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const blogModel = mongoose.model("Blog", blogSchema);
module.exports = blogModel;