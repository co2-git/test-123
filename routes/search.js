module.exports = function (req, res, next) {

  var app = this;

  var request = require('request');

  var url = 'http://cgi.search123.uk.com/xmlfeed?';

  var urlOptions = require('../package.json').config.search123;

  urlOptions.query = req.query.q;

  urlOptions.ip = req.ip;

  urlOptions.organic_start = '0';
  urlOptions.organic_size = '10';
  urlOptions.start = '0';
  urlOptions.size = '20';



  urlOptions.uid = 's123_' + process.pid;

  urlOptions.client_ref = require('url').format({
    protocol: req.protocol,
    hostname: req.host,
    port: app.get('port')
  });

  urlOptions.client_ref += '?' + require('querystring').stringify(req.query);

  urlOptions.client_ref = encodeURIComponent(urlOptions.client_ref);

  urlOptions.client_ua = encodeURIComponent(req.get('User-Agent'));

  var cookie = req.cookies.s123user;
  var usid;

  if ( cookie ) {
    usid = [req.cookies.s123user, +new Date()].join('.');
  }

  else {
    var md5 = require('MD5');

    var values = [
      require('../package.json').config.search123.aid,
      req.ip,
      +new Date(),
      req.get('User-Agent')];

    usid = [md5(values.join()), +new Date()].join('.');

    cookie = res.cookie('s123user', usid, {
      expires: new Date(Date.now() + (10000 * 60 * 30))
    });
  }

  urlOptions.usid = usid;

  // return res.json(urlOptions);

  var urlParameters = [];

  for ( var option in urlOptions ) {
    urlParameters.push(require('util').format('%s=%s', option, urlOptions[option]));
  }

  url += urlParameters.join('&');

  // return res.send(url);

  request(url, function (error, response, body) {
    if ( error ) {
      return next(error);
    }
    var parseString = require('xml2js').parseString;
    parseString(body, function (err, result) {
      if ( err ) {
        return next(err);
      }
      res.json(result);
    });
  });
};