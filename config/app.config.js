'use strict';

const path = require('path');

module.exports = {
  PORT: process.env.PORT || 3000,
  DATA_DIR: path.join(__dirname, '..', 'data'),
  POSTS_FILE: path.join(__dirname, '..', 'data', 'posts.json'),
};
