'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var R = _interopDefault(require('ramda'));
var RS = _interopDefault(require('ramdasauce'));

var isIoValid = function isIoValid(io) {
  return !R.isNil(io);
};
var isHostValid = R.allPass([R.complement(RS.isNilOrEmpty), R.is(String)]);
var isPortValid = R.allPass([R.complement(R.isNil), R.is(Number), RS.isWithin(1, 65535)]);
var onCommandValid = function onCommandValid(fn) {
  return typeof fn === 'function';
};

/**
 * Ensures the options are sane to run this baby.  Throw if not.  These
 * are basically sanity checks.
 */
var validate = function validate(options) {
  var io = options.io;
  var host = options.host;
  var port = options.port;
  var onCommand = options.onCommand;


  if (!isIoValid(io)) throw new Error('invalid io function');
  if (!isHostValid(host)) throw new Error('invalid host');
  if (!isPortValid(port)) throw new Error('invalid port');
  if (!onCommandValid(onCommand)) throw new Error('invalid onCommand handler');
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

var DEFAULTS = {
  io: null, // the socket.io function to create a socket
  host: 'localhost', // the server to connect (required)
  port: 9090, // the port to connect (required)
  name: 'reactotron-core-client', // some human-friendly session name
  onCommand: R.identity // the function called when we receive a command
};

var Client = function () {
  function Client() {
    classCallCheck(this, Client);
    this.options = R.merge({}, DEFAULTS);
    this.connected = false;
    this.socket = null;
  }

  // the configuration options


  createClass(Client, [{
    key: 'configure',


    /**
     * Set the configuration options.
     */
    value: function configure() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      // options get merged & validated before getting set
      var newOptions = R.merge(this.options, options);
      validate(newOptions);
      this.options = newOptions;

      return this;
    }

    /**
     * Connect to the Reactotron server.
     */

  }, {
    key: 'connect',
    value: function connect() {
      var _this = this;

      this.connected = true;
      var _options = this.options;
      var io = _options.io;
      var host = _options.host;
      var port = _options.port;
      var onCommand = _options.onCommand;

      // establish a socket.io connection to the server

      var socket = io('ws://' + host + ':' + port, {
        // jsonp: false,
        // transports: ['websocket', 'polling']
      });

      // fires when we talk to the server
      socket.on('connect', function () {
        socket.emit('hello.client', _this.options);
      });

      // fires when we receive a command, just forward it off
      socket.on('command', function (command) {
        return onCommand(command);
      });

      // assign the socket to the instance
      this.socket = socket;

      return this;
    }

    /**
     * Sends a command to the server
     */

  }, {
    key: 'send',
    value: function send(type, payload) {
      this.socket.emit('command', { type: type, payload: payload });
    }
  }]);
  return Client;
}();

// convenience factory function
var createClient = function createClient(options) {
  var client = new Client();
  client.configure(options);
  return client;
};

exports.Client = Client;
exports.createClient = createClient;