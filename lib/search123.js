function search123 (query, options, callback) {

  if ( typeof options === 'function' && ! callback ) {
    callback = options;
    options = {};
  }

  if ( typeof callback !== 'function' ) {
    throw new Error('Missing callback');
  }

  var domain = require('domain').create();

  domain.on('error', function (error) {
    callback(error);
  });

  domain.run(function () {

  });
}

search123('test', console.log);