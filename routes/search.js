/**
 *    SEARCH ROUTE
 *    ============
 *
 *    This is the middleware that connects to the search123 API and renders the results page consequently
 *
 *    Questions to Francois <francoisrvespa@gmail.com>
 */

var format = require('util').format;

module.exports = function (req, res, next) {

  // If no query string, skip to next middleware

  if ( typeof req.query.q !== 'string' ) {
    return next();
  }

  // The express app

  var app = this;

  /* ======== domain ceremony  ======== */

  var domain = require('domain').create();

  // On domain errors, call next() with error so error is picked up by error manager middlewares

  domain.on('error', function (error) {
    next(error);
  });

  // Run domain code

  domain.run(function () {

    var search123 = require('search123');

    var options = require('../package.json').config.search123;

    options.query = req.query.q;

    options.ip = req.ip;

    options.uid = 's123_' + options.aid;

    options.client_ref = format('%s?%s',
      
      require('url').format({
        protocol: req.protocol,
        hostname: req.hostname,
        port: app.get('port')
      }),

      require('querystring').stringify(req.query));

    options.client_ua = req.get('User-Agent');

    // The cookie

    var cookie = req.cookies.s123user;

    // The user session id, to be retrieved from cookie

    var usid;

    // If cookie exists, retrieve user session id from it

    if ( cookie ) {
      usid = [req.cookies.s123user, +new Date()].join('.');
    }

    // If cookie does not exist, create it

    else {

      // Use MD5 to encrypt cookie

      var md5 = require('MD5');

      // The values to be encrypted

      var values = [
        require('../package.json').config.search123.aid,
        req.ip,
        +new Date(),
        req.get('User-Agent')];

      // Create user session id

      usid = md5(values.join());

      // Create cookie, to expire in 30 minutes

      cookie = res.cookie('s123user', usid, {
        expires: new Date(Date.now() + (1000 * 60 * 30))
      });
    }

    options.usid = usid;

    search123(options)
      .then(
        function (response) {
          return res.json(options );
          res.locals.results = response;
          res.render('pages/results');
        },

        function (error) {
          next(error);
        });

  });
};
