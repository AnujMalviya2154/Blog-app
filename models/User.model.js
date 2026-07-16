'use strict';

const fs     = require('fs');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/app.config');

// ── Private helpers ──────────────────────────────────────────────

/**
 * Read and parse users.json.
 * Returns an empty array if the file is missing or corrupt.
 */
function readUsers() {
  try {
    if (fs.existsSync(config.USERS_FILE)) {
      const raw  = fs.readFileSync(config.USERS_FILE, 'utf-8');
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    }
  } catch (err) {
    console.error('[User.model] Failed to read users:', err.message);
  }
  return [];
}

/**
 * Serialize and persist the users array to disk.
 */
function writeUsers(users) {
  if (!fs.existsSync(config.DATA_DIR)) {
    fs.mkdirSync(config.DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(config.USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

// ── Public API ───────────────────────────────────────────────────

const User = {
  /**
   * Return all users from storage.
   * @returns {Array}
   */
  getAll() {
    return readUsers();
  },

  /**
   * Find a user by their UUID.
   * @param {string} id
   * @returns {Object|null}
   */
  getById(id) {
    return readUsers().find(u => u.id === id) || null;
  },

  /**
   * Find a user by username (case-insensitive).
   * @param {string} username
   * @returns {Object|null}
   */
  getByUsername(username) {
    return readUsers().find(
      u => u.username.toLowerCase() === username.toLowerCase()
    ) || null;
  },

  /**
   * Create and persist a new user.
   * Password must already be hashed before passing to this method.
   * @param {Object} data - { username, password }
   * @returns {Object} The newly created user (with hashed password)
   */
  create({ username, password }) {
    const users = readUsers();
    const user  = {
      id:        uuidv4(),
      username,
      password,  // pre-hashed by authController
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    writeUsers(users);
    return user;
  },
};

module.exports = User;
