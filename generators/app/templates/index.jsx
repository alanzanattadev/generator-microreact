var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var App = require('./components/App.jsx');

var routes = (
  <Route handler={App}>
    // <Route path="path" handler={Component}/>
  </Route>
)

Router.run(routes, Router.HashLocation, function(Root) {
  React.render(
    <Root>

    </Root>,
    document.getElementById('reactContainer')
  );
});
