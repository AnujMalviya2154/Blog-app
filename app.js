'use strict';

const express      = require('express');
const helmet       = require('helmet');
const compression  = require('compression');
const rateLimit    = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path         = require('path');

const config      = require('./config/app.config');  // loads dotenv
const helpers     = require('./utils/helpers');
const { optionalAuth } = require('./middleware/auth.middleware');
const authRoutes  = require('./routes/auth.routes');
const postRoutes  = require('./routes/post.routes');
const { notFound, serverError } = require('./middleware/error.middleware');

const app = express();

// ── Security & Performance ────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc:   ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      fontSrc:    ["'self'", 'fonts.gstatic.com'],
      imgSrc:     ["'self'", 'data:'],
      scriptSrc:  ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com'],
    },
  },
}));

app.use(compression());

app.use(rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             200,
  standardHeaders: true,
  legacyHeaders:   false,
  message: 'Too many requests, please try again later.',
}));

// ── Parsing ───────────────────────────────────────────────────────
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// ── Static Files ──────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1h',
  etag:   true,
}));

// ── View Engine ───────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Template Helpers ──────────────────────────────────────────────
app.locals.formatDate  = helpers.formatDate;
app.locals.timeAgo     = helpers.timeAgo;
app.locals.readingTime = helpers.readingTime;
app.locals.excerpt     = helpers.excerpt;

// ── Auth (runs on every request to populate res.locals.user) ──────
app.use(optionalAuth);

// ── Routes ────────────────────────────────────────────────────────
app.use('/', authRoutes);
app.use('/', postRoutes);

// ── Error Handling (must be last) ─────────────────────────────────
app.use(notFound);
app.use(serverError);

// ── Start Server ──────────────────────────────────────────────────
app.listen(config.PORT, () => {
  console.log(`✨ BlogVerse running at http://localhost:${config.PORT}`);
});
