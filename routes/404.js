module.exports = function (req, res, next) {

  res.json({ 'not found': {
    url: req.url,
    originalUrl: req.originalUrl
  }});
};