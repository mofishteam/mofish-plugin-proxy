'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.closeChild = exports.restartChild = exports.addChild = exports.resumeChild = exports.pauseChild = exports.getChild = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var childPath = _path2.default.join(__dirname, 'child.js');
var childList = {};
var childOptionList = {};

var getChild = exports.getChild = function getChild(id) {
  return childList[id];
};

var pauseChild = exports.pauseChild = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(id) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return closeChild(id);

          case 2:
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
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(id) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return addChild(childOptionList[id]);

          case 2:
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
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(options) {
    var pauseImmediately = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!options.id) {
              _context4.next = 18;
              break;
            }

            if (childList[options.id]) {
              _context4.next = 18;
              break;
            }

            _context4.next = 4;
            return global.utils.portIsOccupied(options.server.listen);

          case 4:
            if (!_context4.sent) {
              _context4.next = 17;
              break;
            }

            childOptionList[options.id] = options;

            if (pauseImmediately) {
              _context4.next = 13;
              break;
            }

            childList[options.id] = _child_process2.default.fork(childPath, {
              // execPath: 'babel-node',
              // silent: true
            });
            childList[options.id].on('message', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
              return _regenerator2.default.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      childList[options.id].send({ ...options.server, startType: 'listen' });
                      console.log('Child is started, pid "' + childList[options.id].pid + '", port: ' + options.server.listen);

                    case 2:
                    case 'end':
                      return _context3.stop();
                  }
                }
              }, _callee3, undefined);
            })));
            childList[options.id].send({ ...options.server, startType: 'init' });
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
            _context4.next = 15;
            break;

          case 13:
            _context4.next = 15;
            return pauseChild(options.id);

          case 15:
            _context4.next = 18;
            break;

          case 17:
            console.log('Port ' + options.server.listen + ' is already in use.');

          case 18:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function addChild(_x4) {
    return _ref3.apply(this, arguments);
  };
}();

var restartChild = exports.restartChild = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(options) {
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (!(options.id && childList[options.id])) {
              _context5.next = 4;
              break;
            }

            _context5.next = 3;
            return closeChild(options.id);

          case 3:
            addChild(options);

          case 4:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function restartChild(_x5) {
    return _ref5.apply(this, arguments);
  };
}();

var closeChild = exports.closeChild = function closeChild(id) {
  return new _promise2.default(function (resolve, reject) {
    if (id && childList[id]) {
      childList[id].on('close', function () {
        resolve(true);
      });
      setTimeout(function () {
        reject();
      }, 1000);
      childList[id].kill();
      delete childList[id];
    } else {
      resolve();
    }
  });
};