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

var app = new Koa();
process.on('message', function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(options) {
    var _loop, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, locationOpt, key, cert;

    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            if (!(options.startType === 'init')) {
              _context7.next = 24;
              break;
            }

            _loop = function _loop(locationOpt) {
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
                      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(body) {
                        var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, res;

                        return _regenerator2.default.wrap(function _callee2$(_context2) {
                          while (1) {
                            switch (_context2.prev = _context2.next) {
                              case 0:
                                if (!(mergedOption.proxyPass.interceptors && mergedOption.proxyPass.interceptors.response && mergedOption.proxyPass.interceptors.response.length)) {
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

                      return function fn(_x2) {
                        return _ref3.apply(this, arguments);
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
                          var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                            var rawHeaders, headers, handledRes, hasContentLength, headerKey;
                            return _regenerator2.default.wrap(function _callee3$(_context3) {
                              while (1) {
                                switch (_context3.prev = _context3.next) {
                                  case 0:
                                    rawHeaders = proxyRes.headers;
                                    headers = _.merge({}, proxyRes.headers);
                                    handledRes = null;

                                    if (!(headers['content-encoding'] === 'gzip')) {
                                      _context3.next = 17;
                                      break;
                                    }

                                    _context3.t0 = gzip;
                                    _context3.t1 = fn;
                                    _context3.next = 8;
                                    return ungzip(jsonString);

                                  case 8:
                                    _context3.t2 = _context3.sent;
                                    _context3.next = 11;
                                    return (0, _context3.t1)(_context3.t2);

                                  case 11:
                                    _context3.t3 = _context3.sent;
                                    _context3.next = 14;
                                    return (0, _context3.t0)(_context3.t3);

                                  case 14:
                                    handledRes = _context3.sent;
                                    _context3.next = 20;
                                    break;

                                  case 17:
                                    _context3.next = 19;
                                    return fn(jsonString);

                                  case 19:
                                    handledRes = _context3.sent;

                                  case 20:
                                    // const buffer = new Buffer(handledRes) // 一定要转成buffer，buffer长度和string长度不一样
                                    // 解决HPE_UNEXPECTED_CONTENT_LENGTH的报错
                                    hasContentLength = false;
                                    _context3.t4 = _regenerator2.default.keys(rawHeaders);

                                  case 22:
                                    if ((_context3.t5 = _context3.t4()).done) {
                                      _context3.next = 29;
                                      break;
                                    }

                                    headerKey = _context3.t5.value;

                                    if (!(headerKey.toLowerCase() === 'content-length')) {
                                      _context3.next = 27;
                                      break;
                                    }

                                    hasContentLength = true;
                                    return _context3.abrupt('break', 29);

                                  case 27:
                                    _context3.next = 22;
                                    break;

                                  case 29:
                                    // 原请求头里没有content-length，我们也就不瞎加content-length了
                                    if (hasContentLength) {
                                      headers['content-length'] = handledRes.length;
                                    }
                                    oriWriteHead.apply(res, [proxyRes.statusCode, headers]);
                                    oriWrite.call(res, handledRes);
                                    oriEnd.call(res);

                                  case 33:
                                  case 'end':
                                    return _context3.stop();
                                }
                              }
                            }, _callee3, undefined);
                          }));

                          function end() {
                            return _ref4.apply(this, arguments);
                          }

                          return end;
                        }()
                      });
                    };
                    var proxy = Proxy('/', proxyOptions);
                    var proxyConnect = Connect(proxy);
                    var proxyApp = new Koa();
                    proxyApp.use(function () {
                      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(ctx, next) {
                        return _regenerator2.default.wrap(function _callee4$(_context4) {
                          while (1) {
                            switch (_context4.prev = _context4.next) {
                              case 0:
                                if (ctx.handled) {
                                  _context4.next = 6;
                                  break;
                                }

                                ctx.handled = true;
                                _context4.next = 4;
                                return proxyConnect(ctx, next);

                              case 4:
                                _context4.next = 8;
                                break;

                              case 6:
                                _context4.next = 8;
                                return next();

                              case 8:
                              case 'end':
                                return _context4.stop();
                            }
                          }
                        }, _callee4, undefined);
                      }));

                      return function (_x3, _x4) {
                        return _ref5.apply(this, arguments);
                      };
                    }());
                    app.use(Mount(mergedOption.url, proxyApp));
                    break;
                  case 'static':
                    var staticApp = new Koa();
                    var staticMidd = Static(mergedOption.static.path, mergedOption.static);
                    staticApp.use(function () {
                      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(ctx, next) {
                        return _regenerator2.default.wrap(function _callee5$(_context5) {
                          while (1) {
                            switch (_context5.prev = _context5.next) {
                              case 0:
                                if (ctx.handled) {
                                  _context5.next = 6;
                                  break;
                                }

                                ctx.handled = true;
                                _context5.next = 4;
                                return staticMidd(ctx, next);

                              case 4:
                                _context5.next = 8;
                                break;

                              case 6:
                                _context5.next = 8;
                                return next();

                              case 8:
                              case 'end':
                                return _context5.stop();
                            }
                          }
                        }, _callee5, undefined);
                      }));

                      return function (_x5, _x6) {
                        return _ref6.apply(this, arguments);
                      };
                    }());
                    app.use(Mount(mergedOption.url, staticApp));
                    break;
                  case 'mock':
                    var mockRouter = new Router();
                    mockRouter[mergedOption.mock.method](mergedOption.url, function () {
                      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(ctx, next) {
                        return _regenerator2.default.wrap(function _callee6$(_context6) {
                          while (1) {
                            switch (_context6.prev = _context6.next) {
                              case 0:
                                if (ctx.handled) {
                                  _context6.next = 11;
                                  break;
                                }

                                ctx.handled = true;
                                _context6.t0 = mergedOption.mock.type;
                                _context6.next = _context6.t0 === 'json' ? 5 : 7;
                                break;

                              case 5:
                                ctx.body = mergedOption.mock.json;return _context6.abrupt('break', 7);

                              case 7:
                                _context6.next = 9;
                                return next();

                              case 9:
                                _context6.next = 13;
                                break;

                              case 11:
                                _context6.next = 13;
                                return next();

                              case 13:
                              case 'end':
                                return _context6.stop();
                            }
                          }
                        }, _callee6, undefined);
                      }));

                      return function (_x7, _x8) {
                        return _ref7.apply(this, arguments);
                      };
                    }());
                    // staticApp.use(Static(mergedOption.static.path, mergedOption.static))
                    app.use(mockRouter.routes());
                    app.use(mockRouter.allowedMethods());
                    break;
                }
              }
            };

            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context7.prev = 5;

            for (_iterator2 = (0, _getIterator3.default)(options.locations.reverse()); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              locationOpt = _step2.value;

              _loop(locationOpt);
            }
            _context7.next = 13;
            break;

          case 9:
            _context7.prev = 9;
            _context7.t0 = _context7['catch'](5);
            _didIteratorError2 = true;
            _iteratorError2 = _context7.t0;

          case 13:
            _context7.prev = 13;
            _context7.prev = 14;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 16:
            _context7.prev = 16;

            if (!_didIteratorError2) {
              _context7.next = 19;
              break;
            }

            throw _iteratorError2;

          case 19:
            return _context7.finish(16);

          case 20:
            return _context7.finish(13);

          case 21:
            process.send({ state: 'ready' });
            _context7.next = 25;
            break;

          case 24:
            if (options.startType === 'listen') {
              if (options.ssl && options.sslOptions) {
                key = '';
                cert = '';

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
            }

          case 25:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined, [[5, 9, 13, 21], [14,, 16, 20]]);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}() // app.listen(options.listen, options.name[0])
);