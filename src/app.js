const path = require('path');
const express = require('express');
const response = require('express');
const bodyParser = require('body-parser');
const blogModel = require('./models/schemas.js');
//For persistent sessions:
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
var session;

const app = new express();

// import {databaseConnect} from './database.js';
const databaseConnect = require('./database.js');
// import { userInfo } from 'os';
databaseConnect();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')
// app.get("/", (req, res) => {
//   console.log("")
//     res.render("index");
//   });

//For reading form for Express
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'));

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: true
}));

// cookie parser middleware
app.use(cookieParser());

//Routes:
const authRoute = require('./routes/authRoute');
const blogRoute = require('./routes/blogRoute'); 

app.use('/api', authRoute); 
app.use('/blog', blogRoute);

app.get('/', (req, res) => {
  console.log(`Id: ${req.session.userId}`)
    res.render('index');
});

// Using normal html way
// app.get('/', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'views/index.html'));
// });

app.listen(3000, () => {
    console.log('App listening on port 3000');
});


app.post('/addPost', async (req, res) => {
  console.log(req.body)
  blogModel.blogModel.create({title: req.body.title, body: req.body.body, createdAt: req.body.createdAt, userId: req.session.email, userName: req.session.name}, (error, post) => {
    res.redirect('/');
  });
  console.log("Done");
})

app.get('/viewBlog', async (req, res) => {
  const blogs = await blogModel.blogModel.find({});
  res.render('viewBlog', {
    blogs: blogs
  })
  //res.redirect('/');
  console.log("The blogs: ");
  console.log(blogs);
});

app.get('/createBlog', (req, res) => {
  if(typeof req.session.userId == "undefined") {
    console.log("User undefined. Please login first!");
    res.json({message: "Can't create blog without logging in first"})
    //res.render('login');
  }
  else {
    console.log("User exists");
    console.log(req.session.userId);
    console.log(req.session.name);
    console.log(req.session.email);
    res.render('createBlog');
  }
});

app.post('/viewComment', async (req, res) => {
  const blog = await blogModel.blogModel.findOne({"_id": req.body.blogId});
  console.log(blog);
  console.log(req.session);
  res.render('commentPage', {
    blog,
    req
  });
});

app.get('/loginUser', (req, res) => {
  res.render('login');
})

app.get('/registerUser', (req, res) => {
  res.render('register');
})

app.post('/updatePost', async (req, res) => {
  const blog = await blogModel.blogModel.findOne({"_id": req.body.blogId});
  if(typeof req.session.userId == "undefined") {
    console.log("Can't update blog without logging in first");
    res.json({message: "Can't update blog without logging in first"})
  } 
  else if(req.session.userId != req.body.email) {
    console.log("Can't edit. Not the author of the blog");
    res.json({message: "Can't edit. Not the author of the blog"});
  } 
  else {
  console.log(blog);
  res.render('updateBlog', {
    blog
  });
  }
})

app.post('/updateComment', async (req, res) => {

  if(typeof req.session.userId == "undefined") {
    console.log("Can't update blog without logging in first");
    res.json({message: "Can't update blog without logging in first"})
  } 
  else if(req.session.userId != req.body.email) {
    console.log("Can't edit. Not the author of the blog");
    res.json({message: "Can't edit. Not the author of the blog"});
  } 
  else {
    console.log(blog);
    res.render('updateComment', {
      req
    });
  }
})