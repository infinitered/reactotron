#!/usr/bin/env node

'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _ramdasauce = require('ramdasauce');

var _ramdasauce2 = _interopRequireDefault(_ramdasauce);

var _strman = require('strman');

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

var _gemoji = require('gemoji');

var _gemoji2 = _interopRequireDefault(_gemoji);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// command validation
var isValidCommand = _ramda2.default.allPass([_ramdasauce2.default.isNotNil, _ramda2.default.is(Object), _ramda2.default.has('process'), _ramda2.default.propSatisfies(function (x) {
  return typeof x === 'function';
}, 'process')]);

// message validation
var isValidMessage = _ramda2.default.allPass([_ramdasauce2.default.isNotNil, _ramda2.default.is(Object), _ramda2.default.has('type'), _ramda2.default.propIs(String, 'type'), _ramda2.default.propSatisfies(function (x) {
  return _ramda2.default.not(_ramda2.default.isEmpty(x));
}, 'type')]);

var createRouter = function createRouter() {
  // holds the list of commands
  var commands = {};

  // registers a command
  var register = function register(command) {
    // sanity
    if (_ramda2.default.isNil(command) || !isValidCommand(command)) {
      throw new Error('Invalid command');
    }

    // add the command
    commands[command.name] = command;
  };

  // posts a message
  var post = function post(context, message) {
    // sanity
    if (_ramda2.default.isNil(message) || !isValidMessage(message)) return false;

    var command = commands[message.type];
    command && command.process(context, message);

    return true;
  };

  return {
    commands: commands,
    register: register,
    post: post
  };
};

var publicInterface = {
  createRouter: createRouter,
  isValidCommand: isValidCommand,
  isValidMessage: isValidMessage
};

var Context = function () {
  function Context(parts) {
    _classCallCheck(this, Context);

    this.io = parts.io;
    this.ui = parts.ui;
    this.router = parts.router;
    this.menuStack = [];
    this.clients = {};
    this.lastRepeatableMessage = null;
    this.reduxActionLoggingStyle = 'short';
    this.apiLoggingStyle = 'short';
    this.config = {};
  }

  _createClass(Context, [{
    key: 'send',
    value: function send(action) {
      var body = action;
      var bodyJson = JSON.stringify(body);
      this.io.sockets.emit('command', bodyJson);
    }
  }, {
    key: 'post',
    value: function post(message) {
      // sanity
      if (_ramda2.default.isNil(message) || !publicInterface.isValidMessage(message)) return false;
      // send each command the message
      var command = this.router.commands[message.type];
      if (command) {
        // kick off the command
        command.process(this, message);

        // unless this is a command to repeat, then record the command
        if (command.repeatable) {
          this.lastRepeatableMessage = message;
        }
      }
    }
  }, {
    key: 'prompt',
    value: function prompt(title, callback) {
      var _this = this;

      this.ui.promptBox.setFront();
      this.ui.screen.render();
      this.ui.promptBox.input(title, '', function (err, value) {
        if (!err) {
          callback(value);
          _this.ui.screen.render();
        }
      });
    }
  }, {
    key: 'message',
    value: function message(displayText) {
      var _this2 = this;

      var callback = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      this.ui.messageBox.setFront();
      this.ui.screen.render();
      this.ui.messageBox.display(displayText, 0, function (err, value) {
        if (!err) {
          if (callback) callback(value);
          _this2.ui.screen.render();
        }
      });
    }
  }, {
    key: 'info',
    value: function info(title, displayText) {
      var _this3 = this;

      var callback = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      this.ui.infoBox.setFront();
      this.ui.screen.render();
      this.ui.infoBox.setLabel(title);
      this.ui.infoBox.display(displayText, 0, function (err, value) {
        if (!err) {
          if (callback) callback(value);
          _this3.ui.screen.render();
        }
      });
    }
  }, {
    key: 'timeStamp',
    value: function timeStamp() {
      var t = (0, _moment2.default)();
      return t.format('HH:mm:') + '{white-fg}' + t.format('ss.SS') + '{/}';
    }
  }, {
    key: 'log',
    value: function log(message) {
      var time = this.timeStamp();
      if (_ramda2.default.is(Object, message)) {
        this.ui.logBox.log(time);
        this.ui.logBox.log(message);
        this.ui.logBox.log('');
      } else {
        this.ui.logBox.log(time + ' ' + message);
      }

      this.ui.screen.render();
    }
  }]);

  return Context;
}();

var COMMAND = 'redux.dispatch';

/**
 Sends a request to dispatch an action into Redux.
 */
var process$1 = function process$1(context, action) {
  context.send(action);
};

var reduxDispatch = {
  name: COMMAND,
  repeatable: true,
  process: process$1
};

var COMMAND$1 = 'redux.value.request';

/**
 Sends a request to get the values at the path in redux.
 */
var process$2 = function process$2(context, action) {
  context.send(action);
};

var reduxValueRequest = {
  name: COMMAND$1,
  repeatable: true,
  process: process$2
};

var COMMAND$2 = 'redux.key.request';

/**
 Sends a request to get the keys at the path in redux.
 */
var process$3 = function process$3(context, action) {
  context.send(action);
};

var reduxKeyRequest = {
  name: COMMAND$2,
  repeatable: true,
  process: process$3
};

var COMMAND$3 = 'redux.value.response';

/**
 Receives some values inside redux.
 */
var process$4 = function process$4(context, action) {
  var _action$message = action.message;
  var path = _action$message.path;
  var values = _action$message.values;

  var time = context.timeStamp();
  if (_ramdasauce2.default.isNilOrEmpty(path)) {
    context.ui.logBox.log('{white-fg}' + time + '{/} {blue-fg}values in{/} {cyan-fg}/{/}');
  } else {
    context.ui.logBox.log('{white-fg}' + time + '{/} {blue-fg}values in{/} {cyan-fg}' + path + '{/}');
  }
  context.ui.logBox.log(values);
  context.ui.logBox.log('');
  context.ui.screen.render();
};

var reduxValueResponse = {
  name: COMMAND$3,
  process: process$4
};

var COMMAND$4 = 'redux.key.response';

/**
 Receives a list of keys from the server.
 */
var process$5 = function process$5(context, action) {
  var _action$message2 = action.message;
  var path = _action$message2.path;
  var keys = _action$message2.keys;

  var time = context.timeStamp();

  var keyPrefix = _ramdasauce2.default.isNilOrEmpty(path) ? '' : path + '.';

  var sayKeys = _ramdasauce2.default.isNilOrEmpty(keys) ? '  {red-fg}(no keys found at that path){/}' : _ramda2.default.join('\n', _ramda2.default.map(function (k) {
    return '  ' + keyPrefix + '{cyan-fg}' + k + '{/}';
  }, _ramda2.default.without([null], keys) || []));

  var title = _ramdasauce2.default.isNilOrEmpty(path) ? '{blue-fg}keys in /{/}' : '{blue-fg}keys in{/} {cyan-fg}' + path + '{/}';

  var fullMessage = '{white-fg}' + time + '{/} ' + title + ' \n' + sayKeys;

  context.ui.logBox.log(fullMessage);
  context.ui.screen.render();
};

var reduxKeyResponse = {
  name: COMMAND$4,
  process: process$5
};

var COMMAND$5 = 'redux.value.prompt';

/**
 Prompts for a path to grab some redux values from.
 */
var process$6 = function process$6(context, action) {
  context.prompt('Enter a redux path', function (value) {
    var path = _ramdasauce2.default.isNilOrEmpty(value) ? null : value;
    context.post({ type: 'redux.value.request', path: path });
  });
};

var reduxValuePrompt = {
  name: COMMAND$5,
  repeatable: true,
  process: process$6
};

var COMMAND$6 = 'redux.key.prompt';

/**
 Prompts for a path to grab some redux keys from.
 */
var process$7 = function process$7(context, action) {
  context.prompt('Enter a redux path:  eg. weather.temperature', function (value) {
    var path = _ramdasauce2.default.isNilOrEmpty(value) ? null : value;
    context.post({ type: 'redux.key.request', path: path });
  });
};

var reduxKeyPrompt = {
  name: COMMAND$6,
  repeatable: true,
  process: process$7
};

var COMMAND$7 = 'redux.dispatch.prompt';

/**
Prompts for a path to grab some redux keys from.
 */
var process$8 = function process$8(context, action) {
  context.prompt('Action to dispatch (e.g. {type: \'MY_ACTION\'})', function (value) {
    var action = null;

    // try not to blow up the frame
    try {
      eval('action = ' + value); // lulz
    } catch (e) {}

    // try harder to not blow up the frame
    if (_ramdasauce2.default.isNilOrEmpty(action)) return;

    // got an object?  ship an object.
    context.post({ type: 'redux.dispatch', action: action });
  });
};

var reduxDispatchPrompt = {
  name: COMMAND$7,
  repeatable: true,
  process: process$8
};

var COMMAND$8 = 'redux.action.done';

/**
 Received when a redux action is complete.
 */
var process$9 = function process$9(context, action) {
  var _action$message3 = action.message;
  var type = _action$message3.type;
  var ms = _action$message3.ms;

  var time = context.timeStamp();
  context.ui.reduxActionBox.log(time + ' {cyan-fg}' + type + '{/}{|}{white-fg}' + ms + '{/}ms');
  if (context.reduxActionLoggingStyle === 'full') {
    context.ui.reduxActionBox.log(action.message.action);
    context.ui.reduxActionBox.log('');
  }
};

var reduxActionDone = {
  name: COMMAND$8,
  process: process$9
};

var COMMAND$9 = 'redux.subscribe.request';

/**
 Sends a request to get the keys at the path in redux.
 */
var process$10 = function process$10(context, action) {
  var paths = _ramda2.default.without([null], _ramdasauce2.default.dotPath('config.subscriptions', context) || []);
  context.send(_ramda2.default.merge(action, { paths: paths }));
};

var reduxSubscribeRequest = {
  name: COMMAND$9,
  repeatable: true,
  process: process$10
};

var COMMAND$10 = 'redux.subscribe.values';

/**
  Receive the subscribed key paths.
 */
var process$11 = function process$11(context, action) {
  var values = action.message.values;

  var each = _ramda2.default.map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var k = _ref2[0];
    var v = _ref2[1];
    return '{cyan-fg}' + k + '{/}{|}{white-fg}' + v + '{/}';
  }, values);
  var message = _ramda2.default.join('\n', each);
  context.ui.reduxWatchBox.setContent(message);
  context.ui.screen.render();
};

var reduxSubscribeValues = {
  name: COMMAND$10,
  process: process$11
};

var COMMAND$11 = 'redux.subscribe.add';

/**
 Prompts for a path to grab some redux keys from.
 */
var process$12 = function process$12(context, action) {
  var path = action.path;
  // create the config.subscriptions unless it exist
  if (_ramda2.default.isNil(context.config.subscriptions)) {
    context.config.subscriptions = [];
  }
  // subscribe
  if (!_ramda2.default.contains(path, context.config.subscriptions)) {
    context.config.subscriptions.push(path);
    context.post({ type: 'redux.subscribe.request' });
  }
};

var reduxSubscribeAdd = {
  name: COMMAND$11,
  process: process$12
};

var COMMAND$12 = 'redux.subscribe.add.prompt';

/**
 Prompts for a path to grab some redux keys from.
 */
var process$13 = function process$13(context, action) {
  context.prompt('Enter a redux path:  eg. weather.temperature', function (value) {
    // logical default
    var path = _ramdasauce2.default.isNilOrEmpty(value) ? null : value;
    context.post({ type: 'redux.subscribe.add', path: path });
  });
};

var reduxSubscribeAddPrompt = {
  name: COMMAND$12,
  process: process$13
};

var COMMAND$13 = 'redux.subscribe.delete';

/**
 Prompts for a path to grab some redux keys from.
 */
var process$14 = function process$14(context, action) {
  var path = action.path;
  // create the config.subscriptions unless it exist
  if (_ramda2.default.isNil(context.config.subscriptions)) {
    context.config.subscriptions = [];
  }
  // remove
  context.config.subscriptions = _ramda2.default.without([path], context.config.subscriptions);
  // refresh
  context.post({ type: 'redux.subscribe.request' });
};

var reduxSubscribeDelete = {
  name: COMMAND$13,
  process: process$14
};

var COMMAND$14 = 'redux.subscribe.delete.prompt';

/**
 Prompts for a path to grab some redux keys from.
 */
var process$15 = function process$15(context, action) {
  context.prompt('Enter a redux path:  eg. weather.temperature', function (value) {
    // logical default
    var path = _ramdasauce2.default.isNilOrEmpty(value) ? null : value;
    context.post({ type: 'redux.subscribe.delete', path: path });
  });
};

var reduxSubscribeDeletePrompt = {
  name: COMMAND$14,
  process: process$15
};

var COMMAND$15 = 'redux.subscribe.clear';

/**
 Clears the subscriptions being watched.
 */
var process$16 = function process$16(context, action) {
  context.config.subscriptions = [];
  context.post({ type: 'redux.subscribe.request' });
};

var reduxSubscribeClear = {
  name: COMMAND$15,
  process: process$16
};

var COMMAND$16 = 'devMenu.reload';

/**
 Sends a request to reload the app.
 */
var process$17 = function process$17(context, action) {
  context.send(action);
};

var devMenuReload = {
  name: COMMAND$16,
  process: process$17
};

var COMMAND$17 = 'bench.report';

var drawStep = function drawStep(step) {
  var elapsed = (0, _strman.leftPad)(step.time.toFixed(0), 7, ' ');
  var delta = (0, _strman.leftPad)('+' + step.delta.toFixed(0), 7, ' ');
  return '  ' + step.title + '{|}{white-fg}' + elapsed + '{/}ms {yellow-fg}' + delta + '{/}ms';
};

var process$18 = function process$18(context, action) {
  var timeStamp = context.timeStamp();
  var _action$message4 = action.message;
  var title = _action$message4.title;
  var steps = _action$message4.steps;

  var first = _ramda2.default.head(steps);

  if (steps.length === 2) {
    var time = _ramda2.default.last(steps).time - _ramda2.default.head(steps).time;
    var timeString = time.toFixed(0);
    context.ui.benchBox.log(timeStamp + ' {blue-fg}' + title + '{/}{|}{yellow-fg}' + timeString + '{/}ms');
    context.ui.screen.render();
    return;
  }
  context.ui.benchBox.log(timeStamp + ' {blue-fg}' + title + '{/}');

  // transform the data
  var i = 0;
  var last = first.time;
  var data = _ramda2.default.map(function (step) {
    var stepTitle = i === 0 ? 'Start' : i === steps.length - 1 ? 'Finished' : step.title || 'Lap ' + i;
    var delta = step.time - last;
    var time = step.time - first.time;
    i = _ramda2.default.inc(i);
    last = step.time;
    return { time: time, title: stepTitle, delta: delta };
  }, steps);

  var lines = _ramda2.default.map(drawStep, data);
  _ramda2.default.forEach(function (line) {
    return context.ui.benchBox.log(line);
  }, lines);

  // repaint
  context.ui.screen.render();
};
var benchReport = {
  name: COMMAND$17,
  process: process$18
};

var COMMAND$18 = 'program.die';

/**
  Shuts the program down.
 */
var execute = function execute(context, action) {
  var exitCode = action.exitCode || 0;
  context.ui.screen.destroy();
  console.log('> You are eaten by a grue.');
  process.exit(exitCode);
};

var die = {
  name: COMMAND$18,
  process: execute // remapped because of a node.js global variable collision
};

var COMMAND$19 = 'api.log';

var process$19 = function process$19(context, action) {
  var time = context.timeStamp();
  var problem = _ramdasauce2.default.dotPath('response.problem', action.message);
  var status = _ramdasauce2.default.dotPath('response.status', action.message);
  if (!_ramda2.default.is(Number, status)) {
    context.ui.apiBox.log(time + ' {red-fg}' + problem + '{/}');
    return;
  }

  var url = _ramdasauce2.default.dotPath('response.config.url', action.message);
  var baseURL = _ramdasauce2.default.dotPath('response.config.baseURL', action.message);
  var path = _ramda2.default.replace(baseURL, '', url);

  var rawMethod = _ramdasauce2.default.dotPath('response.config.method')(action.message) || '???';
  var method = _ramda2.default.pipe(_ramda2.default.take(3), _ramda2.default.toUpper)(rawMethod);
  var statusMessage = _ramda2.default.cond([[_ramdasauce2.default.isWithin(200, 299), _ramda2.default.always('{green-fg}' + status + '{/}')], [_ramdasauce2.default.isWithin(400, 599), _ramda2.default.always('{red-fg}' + status + '{/}')], [_ramda2.default.T, _ramda2.default.identity]])(status);
  var durationMs = _ramdasauce2.default.dotPath('response.duration', action.message);
  var duration = '{white-fg}' + durationMs + '{/}ms';
  context.ui.apiBox.log(time + ' ' + statusMessage + ' {blue-fg}' + method + '{/} ' + path + '{|}' + duration);
  if (context.apiLoggingStyle === 'full') {
    var data = _ramdasauce2.default.dotPath('response.data', action.message);
    if (_ramda2.default.is(Object, data)) {
      var json = JSON.stringify(data, null, 2);
      context.ui.apiBox.log(json);
    }
  }
};

var apiLog = {
  name: COMMAND$19,
  process: process$19
};

var formatClient = function formatClient() {
  var client = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var prefix = arguments.length <= 1 || arguments[1] === undefined ? "-" : arguments[1];

  return prefix + ' {green-fg}[' + client.ip + ']{/} ' + client.name + ' <' + client.userAgent + '> <' + client.version + '>';
};

var formatClients = function formatClients() {
  var clients = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var prefix = arguments.length <= 1 || arguments[1] === undefined ? "-" : arguments[1];

  return _ramda2.default.pipe(_ramda2.default.values, _ramda2.default.map(function (c) {
    return formatClient(c, prefix);
  }), _ramda2.default.join('\n'))(clients);
};

// displays a message in the log when this client connects
var displayConnectedMessage = function displayConnectedMessage(context, client) {
  var message = formatClient(client);
  context.log(message);
  context.ui.screen.render();
};

// updates the connected client count
var updateClients = function updateClients(context) {
  context.ui.connectionBox.setContent(context.ui.clientCount(_ramda2.default.values(context.clients).length));

  context.ui.screen.render();
};

var COMMAND$20 = 'client.add';

var process$20 = function process$20(context, action) {
  var clients = context.clients;

  var clientInfo = action.client;

  clients[clientInfo.socket.id] = clientInfo;

  displayConnectedMessage(context, clientInfo);
  updateClients(context);
};

var clientAdd = {
  name: COMMAND$20,
  process: process$20
};

var COMMAND$21 = 'client.remove';

var process$21 = function process$21(context, action) {
  var clients = context.clients;
  var socket = action.socket;


  delete clients[socket.id];
  updateClients(context);
};

var clientRemove = {
  name: COMMAND$21,
  process: process$21
};

var COMMAND$22 = 'command.repeat';

var process$22 = function process$22(context, action) {
  var lastRepeatableMessage = context.lastRepeatableMessage;
  if (lastRepeatableMessage) {
    context.post(lastRepeatableMessage);
  }
};

var commandRepeat = {
  name: COMMAND$22,
  process: process$22
};

var COMMAND$23 = 'content.log';

var process$23 = function process$23(context, action) {
  context.log(action.message);
};

var contentLog = {
  name: COMMAND$23,
  process: process$23
};

var COMMAND$24 = 'content.clear';

var process$24 = function process$24(context, action) {
  context.ui.logBox.setContent('');
  context.ui.apiBox.setContent('');
  context.ui.reduxActionBox.setContent('');
  context.ui.reduxWatchBox.setContent('');
  context.ui.benchBox.setContent('');
  context.ui.screen.render();
};

var contentClear = {
  name: COMMAND$24,
  process: process$24
};

var COMMAND$25 = 'content.score';
var SCORE = '\n-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\n';

var process$25 = function process$25(context, action) {
  context.ui.logBox.log(SCORE);
  context.ui.apiBox.log(SCORE);
  context.ui.reduxActionBox.log(SCORE);
  context.ui.benchBox.log(SCORE);
  context.ui.screen.render();
};

var contentScore = {
  name: COMMAND$25,
  process: process$25
};

/**
 Remove any key events bound to the items in this menu.
 */
var unregisterKeys = function unregisterKeys(context, menu) {
  _ramda2.default.forEach(function (item) {
    context.ui.screen.unkey(item.key);
  }, menu.commands);
};

/**
 Add key events for the items in this menu.
 */
var registerKeys = function registerKeys(context, menu) {
  _ramda2.default.forEach(function (item) {
    context.ui.screen.key(item.key, function () {
      _ramda2.default.forEach(function (command) {
        return context.post(command);
      }, item.commands);
    });
  }, menu.commands);
};

/**
 Draws the instructions for the items in this menu.
 */
var drawInstructions = function drawInstructions(context, menu) {
  var content = _ramda2.default.pipe(_ramda2.default.map(function (item) {
    return '{white-fg}' + item.key + '{/} = ' + item.name;
  }), _ramda2.default.join(' | '))(menu.commands);

  context.ui.instructionsBox.setContent('{center}' + content + '{/}');
  context.ui.screen.render();
};

var COMMAND$26 = 'menu.push';

/**
  Installs a new menu.
 */
var process$26 = function process$26(context, action) {
  var menu = action.menu;
  var menuStack = context.menuStack;

  // unregister the old menu if possible

  var previousMenu = _ramda2.default.last(menuStack);
  previousMenu && unregisterKeys(context, previousMenu);

  // register and draw the new menu
  menuStack.push(menu);
  registerKeys(context, menu);
  drawInstructions(context, menu);
};

var menuPush = {
  name: COMMAND$26,
  process: process$26
};

var COMMAND$27 = 'menu.pop';

/**
  Installs the previous menu from the menu stack.
 */
var process$27 = function process$27(context, action) {
  // unbind our current menu
  var currentMenu = _ramda2.default.last(context.menuStack);
  unregisterKeys(context, currentMenu);

  // shrink the list and assign the new menu
  var menuStack = _ramda2.default.slice(0, -1, context.menuStack);
  context.menuStack = menuStack;
  var nextMenu = _ramda2.default.last(menuStack);

  // hook it up and draw
  registerKeys(context, nextMenu);
  drawInstructions(context, nextMenu);
};

var menuPop = {
  name: COMMAND$27,
  process: process$27
};

var COMMAND$28 = 'menu.main';

var process$28 = function process$28(context, action) {
  var menu = {
    name: 'main',
    commands: [{ key: 'r', name: 'redux', commands: [{ type: 'menu.redux' }] }, { key: 'c', name: 'clients', commands: [{ type: 'menu.clients' }] }, { key: 'h', name: 'help', commands: [{ type: 'menu.help' }] }, { key: 'q', name: 'quit', commands: [{ type: 'program.die' }] }]
  };

  context.post({ type: 'menu.push', menu: menu });
};

var menuMain = {
  name: COMMAND$28,
  process: process$28
};

var COMMAND$29 = 'menu.redux';

var process$29 = function process$29(context, action) {
  var menu = {
    name: 'redux',
    commands: [{ key: 'v', name: 'values', commands: [{ type: 'redux.value.prompt' }, { type: 'menu.pop' }] }, { key: 'k', name: 'keys', commands: [{ type: 'redux.key.prompt' }, { type: 'menu.pop' }] }, { key: 'd', name: 'dispatch', commands: [{ type: 'redux.dispatch.prompt' }, { type: 'menu.pop' }] }, { key: 's', name: 'subscribe', commands: [{ type: 'menu.redux.subscribe' }] }, { key: 'escape', name: 'back', commands: [{ type: 'menu.pop' }] }]
  };

  context.post({ type: 'menu.push', menu: menu });
};

var menuRedux = {
  name: COMMAND$29,
  process: process$29
};

var COMMAND$30 = 'menu.help';

var process$30 = function process$30(context, action) {
  var messageText = '\n\n    {bold}Hotkeys{/bold}\n    ---------------------------------\n      {bold}.{/bold}       Repeat last command\n      {bold}-{/bold}       Insert separator\n      {bold}del{/bold}     Clear reactotron\n      {bold}ctrl-c{/bold}  Quit\n\n  ';

  context.info(' {yellow-fg}reactotron{/} {blue-fg}help{/} ', messageText);
};

var menuHelp = {
  name: COMMAND$30,
  process: process$30
};

var COMMAND$31 = 'menu.redux.subscribe';

var process$31 = function process$31(context, action) {
  var menu = {
    name: 'subscribe',
    commands: [{ key: 'a', name: 'add', commands: [{ type: 'redux.subscribe.add.prompt' }, { type: 'menu.pop' }, { type: 'menu.pop' }] }, { key: 'd', name: 'delete', commands: [{ type: 'redux.subscribe.delete.prompt' }, { type: 'menu.pop' }, { type: 'menu.pop' }] }, { key: 'c', name: 'clear', commands: [{ type: 'redux.subscribe.clear' }, { type: 'menu.pop' }, { type: 'menu.pop' }] }, { key: 'escape', name: 'back', commands: [{ type: 'menu.pop' }] }]
  };

  context.post({ type: 'menu.push', menu: menu });
};

var menuReduxSubscribe = {
  name: COMMAND$31,
  process: process$31
};

var COMMAND$32 = 'menu.devMenu';

var process$32 = function process$32(context, action) {
  var menu = {
    name: 'Dev Menu',
    commands: [{ key: 'r', name: 'reload', commands: [{ type: 'devMenu.reload' }, { type: 'menu.pop' }] }, { key: 'escape', name: 'back', commands: [{ type: 'menu.pop' }] }]
  };

  context.post({ type: 'menu.push', menu: menu });
};

var menuDevMenu = {
  name: COMMAND$32,
  process: process$32
};

var COMMAND$33 = 'menu.clients';

var process$33 = function process$33(context, action) {
  var clients = formatClients(context.clients, '   ');

  var messageText = '\n    {bold}Clients{/bold}\n    ---------------------------------\n' + clients + '\n';

  context.info(' {yellow-fg}reactotron{/} {blue-fg}clients{/} ', messageText);
};

var menuClients = {
  name: COMMAND$33,
  process: process$33
};

var COMMAND$34 = 'console.error';

/**
  Receives a console.error from the app.
 */
var process$34 = function process$34(context, action) {
  var message = action.message.message;

  var time = context.timeStamp();
  var isWarning = _ramdasauce2.default.startsWith('Warning: ', message);
  var color = isWarning ? 'yellow' : 'red';
  context.ui.logBox.log(time + ' {' + color + '-fg}' + message + '{/}');
  context.ui.screen.render();
};

var consoleError = {
  name: COMMAND$34,
  process: process$34
};

// come together. right now. over me.
var commands = [clientAdd, clientRemove, reduxDispatch, reduxValueRequest, reduxKeyRequest, reduxValueResponse, reduxKeyResponse, reduxValuePrompt, reduxKeyPrompt, reduxDispatchPrompt, reduxActionDone, reduxSubscribeRequest, reduxSubscribeValues, reduxSubscribeAdd, reduxSubscribeAddPrompt, reduxSubscribeDelete, reduxSubscribeDeletePrompt, reduxSubscribeClear, apiLog, contentLog, contentClear, contentScore, menuPush, menuPop, menuMain, menuRedux, menuHelp, menuReduxSubscribe, menuDevMenu, menuClients, commandRepeat, devMenuReload, consoleError, benchReport, die];

var screen = _blessed2.default.screen({
  smartCSR: true,
  title: 'reactotron',
  dockBorders: false,
  fullUnicode: true
});

var promptBox = _blessed2.default.prompt({
  parent: screen,
  top: 'center',
  left: 'center',
  height: 'shrink',
  width: 'shrink',
  border: 'line',
  label: ' {blue-fg}Prompt{/} ',
  tags: true,
  keys: true,
  mouse: true,
  hidden: true
});

var messageBox = _blessed2.default.message({
  parent: screen,
  top: 'center',
  left: 'center',
  height: 'shrink',
  width: 'shrink',
  border: 'line',
  label: ' {blue-fg}Message{/} ',
  tags: true,
  keys: true,
  mouse: true,
  hidden: true
});

var infoBox = _blessed2.default.message({
  parent: screen,
  top: 'center',
  left: 'center',
  height: 'shrink',
  width: '40%',
  // width: 'shrink',
  border: 'line',
  label: ' {blue-fg}Info{/} ',
  tags: true,
  keys: true,
  mouse: true,
  hidden: true,
  style: {
    bg: '#023f00',
    border: {
      fg: '#f0f0f0'
    }
  }
});

var logBox = _blessed2.default.log({
  parent: screen,
  scrollable: true,
  left: 0,
  top: 0,
  width: '33%',
  height: '100%-1',
  border: 'line',
  tags: true,
  keys: true,
  vi: true,
  mouse: true,
  scrollback: 400,
  label: ' {white-fg} Log {/} ',
  scrollbar: {
    ch: ' ',
    inverse: true
  }
});

var reduxContainer = _blessed2.default.box({
  parent: screen,
  left: 'center',
  width: '33%',
  top: 0,
  height: '100%-1'
});

var reduxActionBox = _blessed2.default.log({
  parent: reduxContainer,
  scrollable: true,
  left: '0',
  top: 0,
  height: '50%',
  width: '100%',
  border: 'line',
  tags: true,
  keys: true,
  vi: true,
  mouse: true,
  label: ' {white-fg}Redux Actions{/} ',
  scrollbar: {
    ch: ' ',
    inverse: true
  }
});

var reduxWatchBox = _blessed2.default.log({
  parent: reduxContainer,
  scrollable: true,
  left: 0,
  width: '100%',
  bottom: 0,
  height: '50%',
  border: 'line',
  tags: true,
  keys: false,
  vi: false,
  mouse: true,
  label: ' {white-fg}Redux Subscriptions{/}',
  scrollbar: {
    ch: ' ',
    inverse: true
  }
});

var rightContainer = _blessed2.default.box({
  parent: screen,
  right: 0,
  top: 0,
  height: '100%-1',
  width: '33%'
});

var apiBox = _blessed2.default.log({
  parent: rightContainer,
  scrollable: true,
  border: 'line',
  height: '75%',
  width: '100%',
  tags: true,
  keys: true,
  vi: true,
  mouse: true,
  scrollback: 400,
  label: ' {white-fg}Api{/} ',
  scrollbar: {
    ch: ' ',
    inverse: true
  }
});

var benchBox = _blessed2.default.log({
  parent: rightContainer,
  scrollable: true,
  border: 'line',
  height: '25%',
  bottom: 0,
  width: '100%',
  tags: true,
  keys: true,
  vi: true,
  mouse: true,
  scrollback: 400,
  label: ' {white-fg}Benchmark{/} ',
  scrollbar: {
    ch: ' ',
    inverse: true
  }
});

var statusBox = _blessed2.default.box({
  parent: screen,
  bottom: 0,
  height: 1,
  left: 0,
  right: 0,
  width: '100%',
  tags: true
});

var instructionsBox = _blessed2.default.box({
  parent: statusBox,
  left: 0,
  top: 0,
  height: '100%',
  width: '100%',
  tags: true
});

_blessed2.default.box({
  parent: statusBox,
  width: 'shrink',
  height: '100%',
  left: 0,
  top: 0,
  tags: true,
  content: '{yellow-fg}reactotron{/}'
});

var clientCount = function clientCount() {
  var numberOfClients = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

  if (numberOfClients > 0) {
    return '{right}{black-bg}{green-fg}' + numberOfClients + ' Online{/}{/}{/}';
  } else {
    return '{right}{black-bg}{red-fg}' + numberOfClients + ' Online{/}{/}{/}';
  }
};

var connectionBox = _blessed2.default.box({
  parent: statusBox,
  top: 0,
  right: 0,
  height: '100%',
  width: 'shrink',
  content: clientCount(),
  tags: true
});

var ui = {
  screen: screen,
  connectionBox: connectionBox,
  promptBox: promptBox,
  messageBox: messageBox,
  infoBox: infoBox,
  logBox: logBox,
  reduxActionBox: reduxActionBox,
  reduxWatchBox: reduxWatchBox,
  apiBox: apiBox,
  benchBox: benchBox,
  instructionsBox: instructionsBox,
  statusBox: statusBox,
  clientCount: clientCount
};

// A way to add extra spacing for emoji characters. As it
// turns out, the emojis are double-wide code points, but
// the terminal renders it as a single slot.  I literally
// understand nothing anymore.  Seems to work great tho!
var keys = _ramda2.default.keys(_gemoji2.default.unicode);
var emojiPattern = '(' + keys.join('|') + ')+';
var emojiRegex = new RegExp(emojiPattern, 'g');
var addSpaceForEmoji = function addSpaceForEmoji(str) {
  return str.replace(emojiRegex, '$1 ');
};

var PORT = 3334;
var io = (0, _socket2.default)(PORT);
var router = publicInterface.createRouter();
_ramda2.default.forEach(function (command) {
  return router.register(command);
}, commands);
var context = new Context({
  ui: ui,
  io: io,
  router: router
});

io.on('connection', function (socket) {
  // When a socket connects, we also want to wait for
  // additional context about the client.
  socket.on('ready', function (clientConfig) {
    var socketInfo = {
      socket: socket,
      ip: socket.request.connection.remoteAddress === '::1' ? 'localhost' : socket.request.connection.remoteAddress,
      userAgent: socket.request.headers['user-agent'] || 'Unknown'
    };

    var clientInfo = _ramda2.default.merge(socketInfo, clientConfig);
    // const clientInfo = {
    //   ...socketInfo,
    //   ...clientConfig
    // }

    // Add new client
    context.post({ type: 'client.add', client: clientInfo });

    // new connects need the subscribe redux
    context.post({ type: 'redux.subscribe.request' });
  });

  ui.screen.render();

  socket.on('command', function (data) {
    var action = JSON.parse(addSpaceForEmoji(data));
    context.post(action);
    ui.screen.render();
  });

  socket.on('disconnect', function () {
    context.post({ type: 'client.remove', socket: socket });
    ui.screen.render();
  });
});

// always control-c to die
ui.screen.key('C-c', function () {
  return context.post({ type: 'program.die' });
});

// . to replay
ui.screen.key('.', function () {
  return context.post({ type: 'command.repeat' });
});

// - to score
ui.screen.key('-', function () {
  return context.post({ type: 'content.score' });
});

// del to clear
ui.screen.key(['delete', 'backspace'], function () {
  return context.post({ type: 'content.clear' });
});

// let's start with the main menu
context.post({ type: 'menu.main' });

// initial render
ui.screen.render();