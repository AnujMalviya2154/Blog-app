'use strict';

/**
 * 404 Not Found handler.
 * Must be registered AFTER all routes.
 */
exports.notFound = (req, res) => {
  res.status(404).render('error', {
    title:   'Page Not Found',
    message: "The page you're looking for doesn't exist.",
  });
};

/**
 * Global error handler (4-argument signature required by Express).
 * Must be the LAST middleware registered.
 */
exports.serverError = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error('[Error]', err.stack);
  res.status(500).render('error', {
    title:   'Server Error',
    message: 'Something went wrong on our end. Please try again later.',
  });
};
