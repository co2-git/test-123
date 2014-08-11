module.exports = function () {

  var app = require('express')();

  app.start = function (port) {
    var server = require('http').createServer(app);

    server.listen(port, function () {
      process.send({ message: 'started', port: port, pid: process.pid });
    });

    server.on('error', function (error) {
      process.send({ 'server error': error });
    });
  };

  app.render = function (view) {
    return function (req, res, next) {
      res.render(view);
    };
  };

  app.redirect = function (location) {
    return function (req, res, next) {
      res.redirect(location);
    };
  };

  var settings = {
    port: 33369,
    'view engine': 'jade',
    views: 'views'
  };

  for ( var key in settings ) {
    app.set(key, settings[key]);
  }

  app.error = function () {
    app.use(require('./error'));
  };

  app['404'] = function () {
    app.use(require('./404'));
  };

  return app;
};