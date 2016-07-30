'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var R = _interopDefault(require('ramda'));
var RS = _interopDefault(require('ramdasauce'));
var reactotronCoreClient = require('reactotron-core-client');

var isHostValid = R.allPass([R.complement(RS.isNilOrEmpty), R.is(String)]);
var isPortValid = R.allPass([R.complement(R.isNil), R.is(Number), RS.isWithin(1, 65535)]);

/**
 * Ensures the options are sane to run this baby.  Throw if not.  These
 * are basically sanity checks.
 */
var validate = function validate(options) {
  var host = options.host;
  var port = options.port;


  if (!isHostValid(host)) throw new Error('invalid host');
  if (!isPortValid(port)) throw new Error('invalid port');
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

// -------------
// THE HACK ZONE
// -------------

// set a userAgent manually so socket.io works.
if (!window.navigator || !window.navigator.userAgent) {
  window.navigator.userAgent = 'reactotron-react-native';
}

// Only then do we load socket.io. This has to be done as a require to preserve
// the order of user agent being set first.  Also, it's a var so it doesn't get
// hoisted.
var io = require('socket.io-client');

// ---------------------
// DEFAULT CONFIGURATION
// ---------------------

var DEFAULTS = {
  host: 'localhost',
  port: 9090,
  name: 'reactotron-react-native'
};

// -----------
// HERE WE GO!
// -----------

var Reactotron = function () {
  function Reactotron() {
    classCallCheck(this, Reactotron);
    this.options = R.merge({}, DEFAULTS);
    this.client = null;
    this.count = 0;
  }

  /**
   * The configuration options for this library.
   */


  /**
   * The reactotron-core-client.
   */


  /**
   * A count of messages received this session.  Really just for debugging.
   */


  createClass(Reactotron, [{
    key: 'connect',


    /**
     * Connect to the server with these options.
     */
    value: function connect() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      // sanity check the options
      var newOptions = R.merge(this.options, options);
      validate(newOptions);
      this.options = newOptions;

      // create the client
      this.client = reactotronCoreClient.createClient({
        io: io,
        name: this.options.name,
        host: this.options.host,
        port: this.options.port,
        onCommand: this.onCommand.bind(this)
      });

      // let's connect
      this.client.connect();

      return this;
    }

    /**
     * Fires when a command comes in from the server.
     */

  }, {
    key: 'onCommand',
    value: function onCommand(command) {
      this.count++;
    }

    /**
     * Send this command to the server.
     */

  }, {
    key: 'send',
    value: function send(type, payload) {
      this.client.send(type, payload);
    }
  }]);
  return Reactotron;
}();

// the app-wide one-and-only


var reactotron = new Reactotron();

module.exports = reactotron;