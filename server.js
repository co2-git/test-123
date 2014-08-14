#!/usr/bin/env node

/**
 *    EXPRESS SERVER
 *    ==============
 *
 *    Starts a new process that listens to traffic on port X and that handles HTTP requests
 *
 *    Questions to Francois <francoisrvespa@gmail.com>
 */

/* ======== cluster messaging ======== */

if ( ! process.send ) {
  process.send = console.log;
}

var domain = require('domain').create();

domain.on('error', function (error) {
  console.log('error', {
    name: error.name,
    message: error.message,
    stack: error.stack.split(/\n/)
  });
});

domain.run(function () {
  /* ======== start express app ======== */

  var express = require('express');
  var app = express();

  /* ======== middlewares  ======== */

  var cookieParser = require('cookie-parser');

  /* ======== app config  ======== */

  var config = {
    'view engine'   :   'jade',
    'views'         :   'views',
    'port'          :   process.env.PORT || 3012
  };

  for ( var middleware in config ) {
    app.set(middleware, config[middleware]);
  }

  /* ======== static router  ======== */

  app.use(express.static(require('path').join(__dirname, 'public')));

  /* ======== cookies & session  ======== */

  var secret = [process.pid, Math.random(), +new Date()].join();

  app.use(cookieParser(secret));

  /* ======== response locals  ======== */

  app.use(function (req, res, next) {
    res.locals.req = req;
    next();
  });

  /* ======== home page and results page  ======== */

  app.get('/',

    require('./routes/search').bind(app),

    require('./routes/home')
    );

  /* ======== error  ======== */

  app.use(function (error, req, res, next) {
    res.send({
      error: {
        message: error.message,
        stack: error.stack.split(/\n/)
      }
    });
  });

  /* ======== not found  ======== */

  app.use(function (req, res, next) {
    res.send('Page not found');
  });

  /* ======== start server  ======== */

  var server = require('http').createServer(app);

  server.listen(app.get('port'), function () {
    process.send({ message: 'started', port: app.get('port'), pid: process.pid });
  });

  server.on('error', function (error) {
    process.send({ 'server error': error });
  });
});
