import React from 'react';
import Router, {RouteHandler} from 'react-router';

var App = React.createClass({
  getInitialState: function() {
    return {};
  },
  getDefaultProps: function() {
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

export default App;
