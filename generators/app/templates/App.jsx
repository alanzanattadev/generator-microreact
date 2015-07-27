var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

var App = React.createClass({
  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {

  },
  componentWillUnmount: function() {

  },
  render: function() {
    return (
      <div>
        <RouteHandler/>
      </div>
    );
  }
});

module.exports = App;
