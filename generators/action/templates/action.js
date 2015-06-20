var dispatcher = require('../dispatchers/dispatcher.js');

var type = "<%= action.name %>";

var <%= action.name %> = {
  create: function() {
    dispatcher.dispatch({
      actionType: type
    });
  }
};

module.exports = <%= action.name %>;
