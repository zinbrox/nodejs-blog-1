const session = require('express-session');
const Blog = require('../models/schemas.js');
var {ObjectId} = require('mongodb');

const updateBlog = (req, res, next) => {
    var blogId = req.body.blogId;
    var title = req.body.title;
    var body = req.body.body;
    console.log(blogId);

    if(typeof req.session.userId === "undefined") {
        console.log("Can't edit blog without logging in first");
        res.json({message: "Can't edit blog without logging in first"})
      } 
      else if(req.session.userId !== req.body.email) {
        console.log("Can't edit. Not the author of the blog");
        res.json({message: "Can't edit. Not the author of the blog"});
      } 
      else {
        Blog.blogModel.findByIdAndUpdate(blogId, {'title': title, 'body': body}, function(err, result) {
            if(err) {
                console.log(`Couldn't update: ${err}`);
            }
            else {
                console.log(`Updated Blog: ${res}`);
                // res.render('index');
                res.redirect('/viewBlog');
            }
        }); 
      }

    //   Blog.blogModel.findByIdAndUpdate(blogId, {'title': title, 'body': body}, function(err, result) {
    //     if(err) {
    //         console.log(`Couldn't update: ${err}`);
    //     }
    //     else {
    //         console.log(`Updated Blog: ${res}`);
    //         // res.render('index');
    //         res.redirect('/viewBlog');
    //     }
    // });
}

const deleteBlog = (req, res, next) => {
    var blogId = req.body.blogId;

    
    if(typeof req.session.userId === "undefined") {
        console.log("Can't delete blog without logging in first");
        res.json({message: "Can't delete blog without logging in first"})
      } 
      else if(req.session.userId !== req.body.email) {
        console.log("Can't edit. Not the author of the blog");
        res.json({message: "Can't edit. Not the author of the blog"});
      } 
      else {
        Blog.blogModel.deleteOne({_id: blogId}, function(err) {
            if(err)
                console.log(`Couldn't delete: ${err}`);
            else 
                console.log("Successful deletion");
            res.redirect('/viewBlog');
        })
      }

    //   Blog.blogModel.deleteOne({_id: blogId}, function(err) {
    //     if(err)
    //         console.log(`Couldn't delete: ${err}`);
    //     else 
    //         console.log("Successful deletion");
    //     res.redirect('/viewBlog');
    // })

}

const addComment = (req, res, next) => {
    var blogId = req.body.blogId;
    var commentBody = req.body.commentBody;
    console.log(`BlogId: ${blogId}`);
    console.log(`Email: ${req.session.email}`);
    console.log(`Comment Author: ${req.session.name}`);
    console.log(`Comment: ${commentBody}`);

    const comment = new Blog.commentModel({userId: req.session.email, userName: req.session.name, blogId: blogId, comment: commentBody});
    Blog.blogModel.findById(blogId, function (err, docs) {
        if (err){
            console.log(err);
        }
        else{
            console.log("Result : ", docs);
            var comments = docs.comments;
            comments.push(comment);
            console.log(comments);
            Blog.blogModel.findByIdAndUpdate(blogId, {'comments': comments}, function(err, result) {
                if(err) {
                    console.log(`Couldn't add comment: ${err}`);
                }
                else {
                    console.log(`Added Comment: ${res}`);
                    // res.render('index');
                    res.redirect('/viewBlog');
                }
            });
        }
    });
}

const updateComment = (req, res, next) => {
    var blogId = req.body.blogId;
    var commentId = req.body.commentId;
    var commentBody = req.body.commentBody;

    Blog.blogModel.findById(blogId, function(err, docs) {
        if (err){
            console.log(err);
        } else {
            var comments = docs.comments;
            objIndex = myArray.findIndex((obj => obj.id === commentId));
            comments[objIndex].comment = commentBody;
            Blog.blogModel.findByIdAndUpdate(blogId, {'comments': comments}, function(err, result) {
                if(err) {
                    console.log(`Couldn't delete comment: ${err}`);
                }
                else {
                    console.log(`Deleted Comment: ${result}`);
                    res.redirect('/viewBlog');
                }
            });
        }
    });
}

const deleteComment = (req, res, next) => {
    var blogId = req.body.blogId;
    var commentId = req.body.commentId;
    console.log(blogId);
    console.log(req.body._id);
    console.log(req.session.email);
    console.log(req.body.commentEmail);
    console.log(commentId);
    if(typeof req.session.userId === "undefined") {
        console.log("Can't delete comment without logging in first");
        res.json({message: "Can't delete comment without logging in first"})
      } 
      else if(req.session.email !== req.body.commentEmail) {
        console.log("Can't delete. Not the author of the comment");
        res.json({message: "Can't delete. Not the author of the comment"});
      }
      else {
        Blog.blogModel.findById(blogId, function(err, docs) {
            if (err){
                console.log(err);
            } else {
                //Delete the comment from the array and then update the doc with the new array
                var comments = docs.comments;
                console.log(comments);
                comments.splice(comments.findIndex(a => a._id === commentId) , 1);
                console.log(comments);
                Blog.blogModel.findByIdAndUpdate(blogId, {'comments': comments}, function(err, result) {
                    if(err) {
                        console.log(`Couldn't delete comment: ${err}`);
                    }
                    else {
                        console.log(`Deleted Comment: ${result}`);
                        res.redirect('/viewBlog');
                    }
                }); 
            }
        });
      }
}

module.exports = {
    updateBlog,
    deleteBlog,
    addComment,
    updateComment,
    deleteComment
}