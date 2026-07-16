'use strict';

require('dotenv').config();

const path = require('path');

module.exports = {
  // Server
  PORT: process.env.PORT || 3000,

  // JWT
  JWT_SECRET:     process.env.JWT_SECRET || 'blogverse-dev-secret-change-before-deploying',
  JWT_EXPIRES_IN: '7d',

  // bcrypt
  BCRYPT_SALT_ROUNDS: 10,

  // Data storage
  DATA_DIR:   path.join(__dirname, '..', 'data'),
  POSTS_FILE: path.join(__dirname, '..', 'data', 'posts.json'),
  USERS_FILE: path.join(__dirname, '..', 'data', 'users.json'),
};
