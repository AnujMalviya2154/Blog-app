'use strict';

const Post = require('../models/Post.model');

// ── GET / ────────────────────────────────────────────────────────
/**
 * List all posts, sorted by newest first.
 * Supports optional ?q= search query.
 */
exports.listPosts = (req, res) => {
  const search = (req.query.q || '').trim().toLowerCase();
  let posts = Post.getAll();

  if (search) {
    posts = posts.filter(p =>
      p.title.toLowerCase().includes(search) ||
      p.content.toLowerCase().includes(search)
    );
  }

  posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.render('home', { posts, search });
};

// ── GET /compose ─────────────────────────────────────────────────
exports.showCompose = (req, res) => {
  res.render('compose', { error: null, title: '', content: '' });
};

// ── POST /compose ────────────────────────────────────────────────
exports.createPost = (req, res) => {
  const title   = (req.body.postTitle   || '').trim();
  const content = (req.body.postContent || '').trim();

  if (!title || !content) {
    return res.status(400).render('compose', {
      error: 'Title and content are required.',
      title,
      content,
    });
  }
  if (title.length > 200) {
    return res.status(400).render('compose', {
      error: 'Title must be under 200 characters.',
      title,
      content,
    });
  }
  if (content.length > 50000) {
    return res.status(400).render('compose', {
      error: 'Content must be under 50,000 characters.',
      title,
      content,
    });
  }

  Post.create({ title, content });
  res.redirect('/');
};

// ── GET /posts/:id ───────────────────────────────────────────────
exports.viewPost = (req, res) => {
  const post = Post.getById(req.params.id);
  if (!post) {
    return res.status(404).render('error', {
      title:   'Post Not Found',
      message: "The post you're looking for doesn't exist or has been deleted.",
    });
  }
  res.render('post', { post });
};

// ── GET /edit/:id ────────────────────────────────────────────────
exports.showEdit = (req, res) => {
  const post = Post.getById(req.params.id);
  if (!post) {
    return res.status(404).render('error', {
      title:   'Post Not Found',
      message: "The post you're looking for doesn't exist or has been deleted.",
    });
  }
  res.render('edit', { post, error: null });
};

// ── POST /edit/:id ───────────────────────────────────────────────
exports.updatePost = (req, res) => {
  const post = Post.getById(req.params.id);
  if (!post) {
    return res.status(404).render('error', {
      title:   'Post Not Found',
      message: "The post you're trying to edit doesn't exist.",
    });
  }

  const title   = (req.body.postTitle   || '').trim();
  const content = (req.body.postContent || '').trim();

  if (!title || !content) {
    return res.status(400).render('edit', {
      post: { ...post, title, content },
      error: 'Title and content are required.',
    });
  }
  if (title.length > 200) {
    return res.status(400).render('edit', {
      post: { ...post, title, content },
      error: 'Title must be under 200 characters.',
    });
  }

  const updated = Post.update(req.params.id, { title, content });
  res.redirect(`/posts/${updated.id}`);
};

// ── POST /delete/:id ─────────────────────────────────────────────
exports.deletePost = (req, res) => {
  const deleted = Post.delete(req.params.id);
  if (!deleted) {
    return res.status(404).render('error', {
      title:   'Post Not Found',
      message: "The post you're trying to delete doesn't exist.",
    });
  }
  res.redirect('/');
};
