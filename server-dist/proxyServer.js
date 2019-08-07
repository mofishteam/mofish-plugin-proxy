'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.closeChild = exports.restartChild = exports.addChild = exports.resumeChild = exports.pauseChild = exports.getChild = undefined;

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var childPath = _path2.default.join(__dirname, 'child.js');
var childList = {};
var childOptionList = {};
var childPauseList = {};

var getChild = exports.getChild = function getChild(id) {
  return childList[id];
};

var pauseChild = exports.pauseChild = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(id) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            childPauseList[id] = childOptionList[id];
            _context.next = 3;
            return closeChild(id);

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function pauseChild(_x) {
    return _ref.apply(this, arguments);
  };
}();

var resumeChild = exports.resumeChild = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(id) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return addChild(childPauseList[id]);

          case 2:
            delete childPauseList[id];

          case 3:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function resumeChild(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var addChild = exports.addChild = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(options) {
    var pauseImmediately = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!options.id) {
              _context3.next = 18;
              break;
            }

            if (childList[options.id]) {
              _context3.next = 18;
              break;
            }

            _context3.next = 4;
            return global.utils.portIsOccupied(options.server.listen);

          case 4:
            if (!_context3.sent) {
              _context3.next = 17;
              break;
            }

            childOptionList[options.id] = options;

            if (pauseImmediately) {
              _context3.next = 13;
              break;
            }

            childList[options.id] = _child_process2.default.fork(childPath, {
              // execPath: 'babel-node',
              // silent: true
            });
            childList[options.id].send(options.server);
            console.log('Child is started, pid "' + childList[options.id].pid + '"');
            // setTimeout(() => {
            //   console.log(child)
            // }, 1000)
            // child.stdout.on('data', (data) => {
            //   console.log(`stdout: ${data}`)
            // })
            // child.stderr.on('data', (data) => {
            //   console.log(`stderr: ${data}`)
            // })
            childList[options.id].on('close', function (data) {
              console.log('close:  ' + data);
            });
            _context3.next = 15;
            break;

          case 13:
            _context3.next = 15;
            return pauseChild(options.id);

          case 15:
            _context3.next = 18;
            break;

          case 17:
            console.log('Port ' + options.server.listen + ' is already in use.');

          case 18:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function addChild(_x4) {
    return _ref3.apply(this, arguments);
  };
}();

var restartChild = exports.restartChild = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(options) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!(options.id && childList[options.id])) {
              _context4.next = 4;
              break;
            }

            _context4.next = 3;
            return closeChild(options.id);

          case 3:
            addChild(options);

          case 4:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function restartChild(_x5) {
    return _ref4.apply(this, arguments);
  };
}();

var closeChild = exports.closeChild = function closeChild(id) {
  return new Promise(function (resolve, reject) {
    if (id && childList[id]) {
      childList[id].on('close', function () {
        resolve(true);
      });
      setTimeout(function () {
        reject();
      }, 1000);
      childList[id].kill();
      delete childList[id];
    }
  });
};