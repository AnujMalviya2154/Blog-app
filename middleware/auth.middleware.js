'use strict';

const jwt    = require('jsonwebtoken');
const config = require('../config/app.config');

/**
 * optionalAuth — Non-blocking auth check.
 *
 * Reads the JWT from the cookie and attaches the decoded user
 * to res.locals.user if valid. If missing or invalid, sets
 * res.locals.user to null. Always calls next().
 *
 * Used globally so every view knows whether a user is logged in.
 */
exports.optionalAuth = (req, res, next) => {
  const token = req.cookies && req.cookies.token;
  if (!token) {
    res.locals.user = null;
    return next();
  }
  try {
    res.locals.user = jwt.verify(token, config.JWT_SECRET);
  } catch {
    // Token is expired or tampered — treat as logged out
    res.clearCookie('token');
    res.locals.user = null;
  }
  next();
};

/**
 * requireAuth — Hard auth guard.
 *
 * Verifies the JWT and blocks the request if absent or invalid.
 * Redirects to /login. Use on any route that requires a logged-in user.
 */
exports.requireAuth = (req, res, next) => {
  const token = req.cookies && req.cookies.token;
  if (!token) return res.redirect('/login');
  try {
    res.locals.user = jwt.verify(token, config.JWT_SECRET);
    next();
  } catch {
    res.clearCookie('token');
    res.redirect('/login');
  }
};
