'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.closeChild = exports.restartChild = exports.addChild = undefined;

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var childPath = _path2.default.join(__dirname, 'child.js');
var childList = {};

var addChild = exports.addChild = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(options) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.t0 = console;
            _context.next = 3;
            return global.utils.portIsOccupied(options.server.listen);

          case 3:
            _context.t1 = _context.sent;
            _context.t2 = options.server.listen;

            _context.t0.log.call(_context.t0, _context.t1, _context.t2);

            if (!options.id) {
              _context.next = 18;
              break;
            }

            if (childList[options.id]) {
              _context.next = 18;
              break;
            }

            _context.next = 10;
            return global.utils.portIsOccupied(options.server.listen);

          case 10:
            if (!_context.sent) {
              _context.next = 17;
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
            _context.next = 18;
            break;

          case 17:
            console.log('Port ' + options.server.listen + ' is already in use.');

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function addChild(_x) {
    return _ref.apply(this, arguments);
  };
}();

var restartChild = exports.restartChild = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(options) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!(options.id && childList[options.id])) {
              _context2.next = 4;
              break;
            }

            _context2.next = 3;
            return closeChild(options.id);

          case 3:
            addChild(options);

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function restartChild(_x2) {
    return _ref2.apply(this, arguments);
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