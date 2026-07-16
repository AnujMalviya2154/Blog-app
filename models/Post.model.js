'use strict';

const fs   = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/app.config');

// ── Private helpers ──────────────────────────────────────────────

/**
 * Read and parse the posts JSON file.
 * Returns an empty array if the file is missing or corrupt.
 */
function readPosts() {
  try {
    if (fs.existsSync(config.POSTS_FILE)) {
      const raw = fs.readFileSync(config.POSTS_FILE, 'utf-8');
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    }
  } catch (err) {
    console.error('[Post.model] Failed to read posts:', err.message);
  }
  return [];
}

/**
 * Serialize and persist the posts array to disk.
 */
function writePosts(posts) {
  if (!fs.existsSync(config.DATA_DIR)) {
    fs.mkdirSync(config.DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(config.POSTS_FILE, JSON.stringify(posts, null, 2), 'utf-8');
}

// ── Public API ───────────────────────────────────────────────────

const Post = {
  /**
   * Return all posts from storage.
   * @returns {Array}
   */
  getAll() {
    return readPosts();
  },

  /**
   * Find a single post by its UUID.
   * @param {string} id
   * @returns {Object|null}
   */
  getById(id) {
    return readPosts().find(p => p.id === id) || null;
  },

  /**
   * Create and persist a new post.
   * @param {Object} data - { title, content, authorId, authorName }
   * @returns {Object} The newly created post
   */
  create({ title, content, authorId = null, authorName = 'Anonymous' }) {
    const posts = readPosts();
    const post = {
      id:         uuidv4(),
      title,
      content,
      authorId,
      authorName,
      createdAt:  new Date().toISOString(),
      updatedAt:  new Date().toISOString(),
    };
    posts.push(post);
    writePosts(posts);
    return post;
  },

  /**
   * Update an existing post's title and content.
   * @param {string} id
   * @param {Object} data - { title, content }
   * @returns {Object|null} The updated post, or null if not found
   */
  update(id, { title, content }) {
    const posts = readPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) return null;
    posts[index] = {
      ...posts[index],
      title,
      content,
      updatedAt: new Date().toISOString(),
    };
    writePosts(posts);
    return posts[index];
  },

  /**
   * Remove a post by ID.
   * @param {string} id
   * @returns {boolean} true if deleted, false if not found
   */
  delete(id) {
    const posts = readPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) return false;
    posts.splice(index, 1);
    writePosts(posts);
    return true;
  },
};

module.exports = Post;
