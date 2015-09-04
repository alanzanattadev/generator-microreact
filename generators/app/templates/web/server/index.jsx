var express = require('express');
var React = require('react');
var Router = require('react-router');

var routes = require('../routes');

var app = express();

// ...express config...

app.set('view engine', 'jade');
app.set('views', './views');
app.use(express.static('public'));
app.use(express.static('bower_components'));

app.use(function(req, res, next) {
  var router = Router.create({location: req.url, routes: routes});
  router.run(function(Handler, state) {
    var html = React.renderToString(<Handler/>)
    return res.render('index', {html: html})
  });
});

app.listen(80);

module.exports = app;
