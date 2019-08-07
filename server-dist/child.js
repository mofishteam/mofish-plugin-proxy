'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Koa = require('koa');
var process = require('process');
var Proxy = require('http-proxy-middleware');
var _ = require('lodash');
var Mount = require('koa-mount');
var Static = require('koa-static');
var Router = require('koa-router');
var http = require('http');
var https = require('https');
var Connect = require('koa2-connect');

var _require = require('node-gzip'),
    gzip = _require.gzip,
    ungzip = _require.ungzip;
// const KoaSSL = require('koa-sslify').default


var fs = require('fs');

var AsyncFunction = (0, _getPrototypeOf2.default)((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, this);
}))).constructor;

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
var arrayToObject = function arrayToObject(arr) {
  var result = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(arr), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
    if (!mergedOption.isClose) {
      switch (mergedOption.type) {
        case 'proxyPass':
          mergedOption.proxyPass.router = arrayToObject(mergedOption.proxyPass.router);
          mergedOption.proxyPass.pathRewrite = arrayToObject(mergedOption.proxyPass.pathRewrite);
          mergedOption.proxyPass.secure = false;
          // mergedOption.proxyPass.selfHandleResponse = true
          // app.use(async (ctx, next) => {
          //   if (mergedOption.proxyPass.interceptors && mergedOption.proxyPass.interceptors.request) {
          //     for (const req of mergedOption.proxyPass.interceptors.request || []) {
          //       await (new AsyncFunction('ctx', req.handler))(ctx)
          //     }
          //   }
          //
          //   if (mergedOption.proxyPass.interceptors && mergedOption.proxyPass.interceptors.response) {
          //     for (const res of mergedOption.proxyPass.interceptors.response || []) {
          //       await (new AsyncFunction('ctx', res.handler))(ctx)
          //     }
          //   }
          //   // cawait next()tx.body = []
          // })
          var proxyOptions = _.merge({}, mergedOption.proxyPass);
          var fn = function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(body) {
              var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, res;

              return _regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      if (!(mergedOption.proxyPass.interceptors && mergedOption.proxyPass.interceptors.response)) {
                        _context2.next = 28;
                        break;
                      }

                      _iteratorNormalCompletion3 = true;
                      _didIteratorError3 = false;
                      _iteratorError3 = undefined;
                      _context2.prev = 4;
                      _iterator3 = (0, _getIterator3.default)(mergedOption.proxyPass.interceptors.response || []);

                    case 6:
                      if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                        _context2.next = 14;
                        break;
                      }

                      res = _step3.value;
                      _context2.next = 10;
                      return new AsyncFunction('body', res.handler)(body);

                    case 10:
                      body = _context2.sent;

                    case 11:
                      _iteratorNormalCompletion3 = true;
                      _context2.next = 6;
                      break;

                    case 14:
                      _context2.next = 20;
                      break;

                    case 16:
                      _context2.prev = 16;
                      _context2.t0 = _context2['catch'](4);
                      _didIteratorError3 = true;
                      _iteratorError3 = _context2.t0;

                    case 20:
                      _context2.prev = 20;
                      _context2.prev = 21;

                      if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                      }

                    case 23:
                      _context2.prev = 23;

                      if (!_didIteratorError3) {
                        _context2.next = 26;
                        break;
                      }

                      throw _iteratorError3;

                    case 26:
                      return _context2.finish(23);

                    case 27:
                      return _context2.finish(20);

                    case 28:
                      return _context2.abrupt('return', body);

                    case 29:
                    case 'end':
                      return _context2.stop();
                  }
                }
              }, _callee2, undefined, [[4, 16, 20, 28], [21,, 23, 27]]);
            }));

            return function fn(_x) {
              return _ref2.apply(this, arguments);
            };
          }();
          proxyOptions.onProxyRes = function (proxyRes, req, res) {
            var oriWriteHead = res.writeHead;
            var oriWrite = res.write;
            var oriEnd = res.end;
            var jsonString = new Buffer('');
            (0, _assign2.default)(res, {
              writeHead: function writeHead() {},
              write: function write(chunk) {
                jsonString = Buffer.concat([jsonString, chunk]);
              },
              end: function () {
                var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                  var headers, handledRes;
                  return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          headers = _.merge({}, proxyRes.headers);
                          handledRes = null;

                          if (!(headers['content-encoding'] === 'gzip')) {
                            _context3.next = 16;
                            break;
                          }

                          _context3.t0 = gzip;
                          _context3.t1 = fn;
                          _context3.next = 7;
                          return ungzip(jsonString);

                        case 7:
                          _context3.t2 = _context3.sent;
                          _context3.next = 10;
                          return (0, _context3.t1)(_context3.t2);

                        case 10:
                          _context3.t3 = _context3.sent;
                          _context3.next = 13;
                          return (0, _context3.t0)(_context3.t3);

                        case 13:
                          handledRes = _context3.sent;
                          _context3.next = 19;
                          break;

                        case 16:
                          _context3.next = 18;
                          return fn(jsonString);

                        case 18:
                          handledRes = _context3.sent;

                        case 19:
                          // const buffer = new Buffer(handledRes) // 一定要转成buffer，buffer长度和string长度不一样
                          headers['content-length'] = handledRes.length;
                          oriWriteHead.apply(res, [proxyRes.statusCode, headers]);
                          oriWrite.call(res, handledRes);
                          oriEnd.call(res);

                        case 23:
                        case 'end':
                          return _context3.stop();
                      }
                    }
                  }, _callee3, undefined);
                }));

                function end() {
                  return _ref3.apply(this, arguments);
                }

                return end;
              }()
            });
          };
          var proxy = Proxy(mergedOption.url, proxyOptions);
          app.use(Connect(proxy));
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
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(ctx, next) {
              return _regenerator2.default.wrap(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      _context4.t0 = mergedOption.mock.type;
                      _context4.next = _context4.t0 === 'json' ? 3 : 5;
                      break;

                    case 3:
                      ctx.body = mergedOption.mock.json;return _context4.abrupt('break', 5);

                    case 5:
                      _context4.next = 7;
                      return next();

                    case 7:
                    case 'end':
                      return _context4.stop();
                  }
                }
              }, _callee4, undefined);
            }));

            return function (_x2, _x3) {
              return _ref4.apply(this, arguments);
            };
          }());
          // staticApp.use(Static(mergedOption.static.path, mergedOption.static))
          app.use(mockRouter.routes());
          app.use(mockRouter.allowedMethods());
          break;
      }
    }
  };

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = (0, _getIterator3.default)(options.locations.reverse()), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
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

  if (options.ssl && options.sslOptions) {
    var key = '';
    var cert = '';
    try {
      key = fs.readFileSync(options.sslOptions.key).toString();
      cert = fs.readFileSync(options.sslOptions.cert).toString();
    } catch (err) {
      console.log('Error when reading cert files, Error: \n' + err + '\n=====================');
    }
    // app.use(KoaSSL())
    if (key && cert) {
      https.createServer({
        key: key, cert: cert
      }, app.callback()).listen(options.listen, options.name[0]);
    } else {
      console.error('Cert Error, please check your cert and key path.');
    }
  } else {
    http.createServer(app.callback()).listen(options.listen, options.name[0]);
  }
  // app.listen(options.listen, options.name[0])
});