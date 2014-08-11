module.exports = function (error, req, res, next) {

  if ( error ) {

    process.send({
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    res.statusCode = 500;

    if ( this.get('env') !== 'production' ) {

      var format = require('util').format;

      var trace = error.stack.split(/\n/);

      var html = format('<h1 style="color: #c00">%s: %s</h1>', error.name, error.message);

      html += format('<h2>%s</h2>', trace[1]);

      html += '<ul>';

      trace.forEach(function (stack, i) {
        if ( i > 1 ) {
          html += format('<li>%s</li>', stack.replace(/\((.+)\)/g, '<b>$1</b>'));
        }
      });

      html += '</ul>';

      res.send(html);
    }

    else {
      res.send('<h1 style="color: #c00">Oops! Something wrong happened!</h1>');
    }
  }
};