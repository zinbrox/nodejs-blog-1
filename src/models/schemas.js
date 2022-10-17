const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
      type: String,
      required: true,
      default: "Name unavailable",
    },
    email: {
      type: String,
      required: true,

    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024
    },
  });

  const commentSchema = new Schema({
    userId: {
      type: String, 
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    blogId: {
      type: String
    },
    comment: {
      type: String,
      require: true,

    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
})

  const blogSchema = new Schema({
    userId: {
      type: String,
      required: true,
      default: 0
    },
    userName: {
      type: String,
      required: true,
      default: ""
    },
    // blogId: {
    //   type: String,
    //   default: 0
    // },
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
    comments: [commentSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  
  const userModel = mongoose.model("User", userSchema);
  const blogModel = mongoose.model("Blog", blogSchema);
  const commentModel = mongoose.model("Comment", commentSchema);

  module.exports = {
    userModel,
    blogModel,
    commentModel
};