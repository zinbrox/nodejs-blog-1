const express = require('express')
const router = express.Router()

const blogController = require('../controllers/blogController');

// router.post('/newBlog', blogController);
router.post('/updateBlog', blogController.updateBlog);
router.post('/deleteBlog', blogController.deleteBlog);
router.post('/addComment', blogController.addComment);
router.post('/updateComment', blogController.updateComment);
router.post('/deleteComment', blogController.deleteComment);

module.exports = router;