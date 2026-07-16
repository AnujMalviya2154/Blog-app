'use strict';

const express        = require('express');
const router         = express.Router();
const postController = require('../controllers/postController');
const { requireAuth } = require('../middleware/auth.middleware');

// ── Public routes (no auth needed) ───────────────────────────────
router.get('/',          postController.listPosts);
router.get('/posts/:id', postController.viewPost);

// ── Protected routes (must be logged in) ─────────────────────────
router.get( '/compose',    requireAuth, postController.showCompose);
router.post('/compose',    requireAuth, postController.createPost);
router.get( '/edit/:id',   requireAuth, postController.showEdit);
router.post('/edit/:id',   requireAuth, postController.updatePost);
router.post('/delete/:id', requireAuth, postController.deletePost);

module.exports = router;
