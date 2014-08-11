#!/usr/bin/env node

if ( ! process.send ) {
  process.send = console.log;
}

var pronto = require('prontojs');

var app = pronto('jade', 'cookies');

// app.views('jade');

/**
 *  ## Router Site Map
 *
 *  └── /
 *      ├── posts/
 *      │   ├── edit
 *      │   ├── language/:language
 *      │   ├── tags/:tag
 *      │   └── :id/
 *      │       └── edit
 *      └── sign/
 *          ├── in
 *          └── out
 *  
 */

app
  .rewrite('?q',      '/search')

  .render('/',        'pages/home')

  .render('/search',  require('./routes/search').bind(app),
                      'pages/results')

  .error()

  .listen(process.env.PORT || 3012);