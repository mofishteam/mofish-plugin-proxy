'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Koa = require('koa');
var process = require('process');
var Proxy = require('koa-server-http-proxy');
var _ = require('lodash');
var Mount = require('koa-mount');
var Static = require('koa-static');
var Router = require('koa-router');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

var arrayToObject = function arrayToObject(arr) {
  var result = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      result[item[0]] = item[1];
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return result;
};

process.on('message', function (options) {
  var app = new Koa();

  var _loop = function _loop(locationOpt) {
    var mergedOption = _.merge({}, locationOpt);
    console.log(mergedOption.url);
    switch (mergedOption.type) {
      case 'proxyPass':
        mergedOption.proxyPass.router = arrayToObject(mergedOption.proxyPass.router);
        mergedOption.proxyPass.pathRewrite = arrayToObject(mergedOption.proxyPass.pathRewrite);
        mergedOption.proxyPass.secure = false;
        app.use(Proxy(mergedOption.url, mergedOption.proxyPass));
        break;
      case 'static':
        var staticApp = new Koa();
        staticApp.use(Static(mergedOption.static.path, mergedOption.static));
        app.use(Mount(mergedOption.url, staticApp));
        break;
      case 'mock':
        // const mockApp = new Koa()
        // mockApp.use(async (ctx, next) => {
        //   ctx.body =
        // })
        var mockRouter = new Router();
        mockRouter[mergedOption.mock.method](mergedOption.url, function () {
          var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx, next) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.t0 = mergedOption.mock.type;
                    _context.next = _context.t0 === 'json' ? 3 : 5;
                    break;

                  case 3:
                    ctx.body = mergedOption.mock.json;return _context.abrupt('break', 5);

                  case 5:
                    _context.next = 7;
                    return next();

                  case 7:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, undefined);
          }));

          return function (_x, _x2) {
            return _ref.apply(this, arguments);
          };
        }());
        // staticApp.use(Static(mergedOption.static.path, mergedOption.static))
        app.use(mockRouter.routes());
        app.use(mockRouter.allowedMethods());
        break;
    }
  };

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = options.locations.reverse()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var locationOpt = _step2.value;

      _loop(locationOpt);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  console.log('serverName: ', options.name);
  app.listen(options.listen, options.name || []);
});