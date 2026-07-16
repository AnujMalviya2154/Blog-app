'use strict';

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User.model');
const config = require('../config/app.config');

// ── Helpers ───────────────────────────────────────────────────────

/**
 * Issue a JWT and set it as an httpOnly cookie.
 */
function issueToken(res, user) {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });
}

// ── GET /register ─────────────────────────────────────────────────
exports.showRegister = (req, res) => {
  if (res.locals.user) return res.redirect('/');
  res.render('register', { error: null, username: '' });
};

// ── POST /register ────────────────────────────────────────────────
exports.register = async (req, res, next) => {
  try {
    const username = (req.body.username || '').trim();
    const password = (req.body.password || '').trim();

    // ── Validation ───────────────────────────────────────────────
    if (!username || !password) {
      return res.status(400).render('register', {
        error: 'Username and password are required.',
        username,
      });
    }
    if (username.length < 3 || username.length > 20) {
      return res.status(400).render('register', {
        error: 'Username must be between 3 and 20 characters.',
        username,
      });
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).render('register', {
        error: 'Username can only contain letters, numbers, and underscores.',
        username,
      });
    }
    if (password.length < 6) {
      return res.status(400).render('register', {
        error: 'Password must be at least 6 characters.',
        username,
      });
    }

    // ── Uniqueness check ─────────────────────────────────────────
    if (User.getByUsername(username)) {
      return res.status(409).render('register', {
        error: 'That username is already taken.',
        username,
      });
    }

    // ── Hash password & create user ───────────────────────────────
    const hashed = await bcrypt.hash(password, config.BCRYPT_SALT_ROUNDS);
    const user   = User.create({ username, password: hashed });

    issueToken(res, user);
    res.redirect('/');
  } catch (err) {
    next(err);
  }
};

// ── GET /login ────────────────────────────────────────────────────
exports.showLogin = (req, res) => {
  if (res.locals.user) return res.redirect('/');
  res.render('login', { error: null, username: '' });
};

// ── POST /login ───────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const username = (req.body.username || '').trim();
    const password = (req.body.password || '').trim();

    if (!username || !password) {
      return res.status(400).render('login', {
        error: 'Username and password are required.',
        username,
      });
    }

    // ── Lookup user ───────────────────────────────────────────────
    const user = User.getByUsername(username);

    // Use a deliberate constant-time comparison to prevent timing attacks.
    // We always run bcrypt.compare even if user is not found.
    const DUMMY_HASH = '$2a$10$abcdefghijklmnopqrstuvuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu';
    const passwordToCheck = user ? user.password : DUMMY_HASH;
    const match = await bcrypt.compare(password, passwordToCheck);

    if (!user || !match) {
      return res.status(401).render('login', {
        error: 'Invalid username or password.',
        username,
      });
    }

    issueToken(res, user);
    res.redirect('/');
  } catch (err) {
    next(err);
  }
};

// ── POST /logout ──────────────────────────────────────────────────
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
};
