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

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

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
  context.prompt('Action to dispatch', function (value) {
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

var COMMAND$17 = 'program.die';

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
  name: COMMAND$17,
  process: execute // remapped because of a node.js global variable collision
};

var COMMAND$18 = 'api.log';

// const pad = (value, length) => {
//   return (value.toString().length < length) ? pad(' ' + value, length) : value
// }

var process$18 = function process$18(context, action) {
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
  name: COMMAND$18,
  process: process$18
};

var COMMAND$19 = 'command.repeat';

var process$19 = function process$19(context, action) {
  var lastRepeatableMessage = context.lastRepeatableMessage;
  if (lastRepeatableMessage) {
    context.post(lastRepeatableMessage);
  }
};

var commandRepeat = {
  name: COMMAND$19,
  process: process$19
};

var COMMAND$20 = 'content.log';

var process$20 = function process$20(context, action) {
  context.log(action.message);
};

var contentLog = {
  name: COMMAND$20,
  process: process$20
};

var COMMAND$21 = 'content.clear';

var process$21 = function process$21(context, action) {
  context.ui.logBox.setContent('');
  context.ui.apiBox.setContent('');
  context.ui.reduxActionBox.setContent('');
  context.ui.reduxWatchBox.setContent('');
  context.ui.screen.render();
};

var contentClear = {
  name: COMMAND$21,
  process: process$21
};

var COMMAND$22 = 'content.score';
var SCORE = '\n-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\n';

var process$22 = function process$22(context, action) {
  context.ui.logBox.log(SCORE);
  context.ui.apiBox.log(SCORE);
  context.ui.reduxActionBox.log(SCORE);
  context.ui.reduxWatchBox.log(SCORE);
  context.ui.screen.render();
};

var contentScore = {
  name: COMMAND$22,
  process: process$22
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

var COMMAND$23 = 'menu.push';

/**
  Installs a new menu.
 */
var process$23 = function process$23(context, action) {
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
  name: COMMAND$23,
  process: process$23
};

var COMMAND$24 = 'menu.pop';

/**
  Installs the previous menu from the menu stack.
 */
var process$24 = function process$24(context, action) {
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
  name: COMMAND$24,
  process: process$24
};

var COMMAND$25 = 'menu.main';

var process$25 = function process$25(context, action) {
  var menu = {
    name: 'main',
    commands: [{ key: 'r', name: 'redux', commands: [{ type: 'menu.redux' }] }, { key: 'd', name: 'dev menu', commands: [{ type: 'menu.devMenu' }] }, { key: 'q', name: 'quit', commands: [{ type: 'program.die' }] }]
  };

  context.post({ type: 'menu.push', menu: menu });
};

var menuMain = {
  name: COMMAND$25,
  process: process$25
};

var COMMAND$26 = 'menu.redux';

var process$26 = function process$26(context, action) {
  var menu = {
    name: 'redux',
    commands: [{ key: 'v', name: 'values', commands: [{ type: 'redux.value.prompt' }, { type: 'menu.pop' }] }, { key: 'k', name: 'keys', commands: [{ type: 'redux.key.prompt' }, { type: 'menu.pop' }] }, { key: 'd', name: 'dispatch', commands: [{ type: 'redux.dispatch.prompt' }, { type: 'menu.pop' }] }, { key: 's', name: 'subscribe', commands: [{ type: 'menu.redux.subscribe' }] }, { key: 'escape', name: 'back', commands: [{ type: 'menu.pop' }] }]
  };

  context.post({ type: 'menu.push', menu: menu });
};

var menuRedux = {
  name: COMMAND$26,
  process: process$26
};

var COMMAND$27 = 'menu.redux.subscribe';

var process$27 = function process$27(context, action) {
  var menu = {
    name: 'subscribe',
    commands: [{ key: 'a', name: 'add', commands: [{ type: 'redux.subscribe.add.prompt' }, { type: 'menu.pop' }, { type: 'menu.pop' }] }, { key: 'd', name: 'delete', commands: [{ type: 'redux.subscribe.delete.prompt' }, { type: 'menu.pop' }, { type: 'menu.pop' }] }, { key: 'c', name: 'clear', commands: [{ type: 'redux.subscribe.clear' }, { type: 'menu.pop' }, { type: 'menu.pop' }] }, { key: 'escape', name: 'back', commands: [{ type: 'menu.pop' }] }]
  };

  context.post({ type: 'menu.push', menu: menu });
};

var menuReduxSubscribe = {
  name: COMMAND$27,
  process: process$27
};

var COMMAND$28 = 'menu.devMenu';

var process$28 = function process$28(context, action) {
  var menu = {
    name: 'Dev Menu',
    commands: [{ key: 'r', name: 'reload', commands: [{ type: 'devMenu.reload' }, { type: 'menu.pop' }] }, { key: 'escape', name: 'back', commands: [{ type: 'menu.pop' }] }]
  };

  context.post({ type: 'menu.push', menu: menu });
};

var menuDevMenu = {
  name: COMMAND$28,
  process: process$28
};

var COMMAND$29 = 'console.error';

/**
  Receives a console.error from the app.
 */
var process$29 = function process$29(context, action) {
  var _action$message4 = action.message;
  var message = _action$message4.message;
  var stack = _action$message4.stack;

  var time = context.timeStamp();
  var isWarning = _ramdasauce2.default.startsWith('Warning: ', message);
  var color = isWarning ? 'yellow' : 'red';
  context.ui.logBox.log(time + ' {' + color + '-fg}' + message + '{/}');
  // if (stack) {
  //   context.ui.logBox.log(stack)
  // }
  context.ui.screen.render();
};

var consoleError = {
  name: COMMAND$29,
  process: process$29
};

// come together. right now. over me.
var commands = [reduxDispatch, reduxValueRequest, reduxKeyRequest, reduxValueResponse, reduxKeyResponse, reduxValuePrompt, reduxKeyPrompt, reduxDispatchPrompt, reduxActionDone, reduxSubscribeRequest, reduxSubscribeValues, reduxSubscribeAdd, reduxSubscribeAddPrompt, reduxSubscribeDelete, reduxSubscribeDeletePrompt, reduxSubscribeClear, apiLog, contentLog, contentClear, contentScore, menuPush, menuPop, menuMain, menuRedux, menuReduxSubscribe, menuDevMenu, commandRepeat, devMenuReload, consoleError, die];

var screen = _blessed2.default.screen({
  smartCSR: true,
  title: 'reactotron',
  dockBorders: false
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
  label: ' {white-fg}Log{/} ',
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

var apiBox = _blessed2.default.log({
  parent: screen,
  scrollable: true,
  right: 0,
  top: 0,
  height: '100%-1',
  width: '33%',
  border: 'line',
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

var OFFLINE = '{right}{black-bg}{red-fg}Offline{/}{/}{/}';
var ONLINE = '{right}{black-bg}{green-fg}Online{/}{/}{/}';

var connectionBox = _blessed2.default.box({
  parent: statusBox,
  top: 0,
  right: 0,
  height: '100%',
  width: 'shrink',
  content: OFFLINE,
  tags: true
});

var ui = {
  screen: screen,
  connectionBox: connectionBox,
  promptBox: promptBox,
  logBox: logBox,
  reduxActionBox: reduxActionBox,
  reduxWatchBox: reduxWatchBox,
  apiBox: apiBox,
  instructionsBox: instructionsBox,
  statusBox: statusBox,
  OFFLINE: OFFLINE,
  ONLINE: ONLINE
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
  ui.connectionBox.setContent(ui.ONLINE);
  // new connects need the subscribe redux
  context.post({ type: 'redux.subscribe.request' });
  ui.screen.render();
  socket.on('command', function (data) {
    var action = JSON.parse(data);
    context.post(action);
    ui.screen.render();
  });

  socket.on('disconnect', function () {
    ui.connectionBox.setContent(ui.OFFLINE);
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