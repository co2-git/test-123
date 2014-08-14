/**
 *    HOME ROUTE
 *    ==========
 *
 *    This is the middleware that renders the home page
 *
 *    Questions to Francois <francoisrvespa@gmail.com>
 */

module.exports = function (req, res, next) {
  res.render('pages/home');
};