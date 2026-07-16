'use strict';

const express        = require('express');
const router         = express.Router();
const postController = require('../controllers/postController');

// Public routes — no auth required in Phase 1
router.get( '/',            postController.listPosts);
router.get( '/compose',     postController.showCompose);
router.post('/compose',     postController.createPost);
router.get( '/posts/:id',   postController.viewPost);
router.get( '/edit/:id',    postController.showEdit);
router.post('/edit/:id',    postController.updatePost);
router.post('/delete/:id',  postController.deletePost);

module.exports = router;
