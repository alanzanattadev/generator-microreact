var dispatcher = require('../dispatchers/dispatcher.js');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;

var <%= store.name %> = assign({}, EventEmitter.prototype, {

/*
  emitEvent: function() {
    this.emit(EVENT);
  },
*/
/*
  addChangeListener: function(cb) {
    this.on(EVENT, cb);
  },

  removeChangeListener: function(cb) {
    this.removeListener(EVENT, cb);
  },
*/

  dispatcherId: dispatcher.register(function(payload) {
    switch(payload.actionType) {

    }
    return true;
  })
});

module.exports = <%= store.name %>;
