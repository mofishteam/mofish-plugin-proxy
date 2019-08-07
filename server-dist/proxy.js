'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _options = require('./commonUtils/options');

var _lodash = require('lodash');

var _proxyServer = require('./proxyServer');

var _port = require('./port');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ProxyObj = function () {
  function ProxyObj(_ref) {
    var libs = _ref.libs,
        utils = _ref.utils,
        eventBus = _ref.eventBus,
        plugins = _ref.plugins,
        pluginObjects = _ref.pluginObjects,
        name = _ref.name;

    _classCallCheck(this, ProxyObj);

    this.name = name;
    this.libs = libs;
    this.utils = utils;
    global.utils = utils;
    this.eventBus = eventBus;
    this.plugins = plugins;
    this.pluginObjects = pluginObjects;
    this.config = utils.getConfig();
    this.settings = this.config.settings;
    this.projects = this.config.projects;
    this.setEvents();
    this.startServers();
    // addChild({id: 1, listen: 8908})
  }

  _createClass(ProxyObj, [{
    key: 'setEvents',
    value: function setEvents() {
      // this.eventBus.$on('projectChange', this.onProjectChange)
      // this.eventBus.$on(`plugin-request-${this.name}`, this.request)
    }
  }, {
    key: 'startServers',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, server;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(this.config.allProject && this.config.allProject.length)) {
                  _context.next = 32;
                  break;
                }

                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 4;
                _iterator = this.config.allProject[Symbol.iterator]();

              case 6:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context.next = 18;
                  break;
                }

                server = _step.value;

                if (!(this.config.closeList && this.config.closeList.includes(server.id))) {
                  _context.next = 13;
                  break;
                }

                _context.next = 11;
                return (0, _proxyServer.addChild)(server, true);

              case 11:
                _context.next = 15;
                break;

              case 13:
                _context.next = 15;
                return (0, _proxyServer.addChild)(server);

              case 15:
                _iteratorNormalCompletion = true;
                _context.next = 6;
                break;

              case 18:
                _context.next = 24;
                break;

              case 20:
                _context.prev = 20;
                _context.t0 = _context['catch'](4);
                _didIteratorError = true;
                _iteratorError = _context.t0;

              case 24:
                _context.prev = 24;
                _context.prev = 25;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 27:
                _context.prev = 27;

                if (!_didIteratorError) {
                  _context.next = 30;
                  break;
                }

                throw _iteratorError;

              case 30:
                return _context.finish(27);

              case 31:
                return _context.finish(24);

              case 32:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[4, 20, 24, 32], [25,, 27, 31]]);
      }));

      function startServers() {
        return _ref2.apply(this, arguments);
      }

      return startServers;
    }()
  }, {
    key: 'request',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ctx, next) {
        var method;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                method = ctx.request.method;
                _context2.t0 = method;
                _context2.next = _context2.t0 === 'GET' ? 4 : _context2.t0 === 'POST' ? 16 : _context2.t0 === 'PUT' ? 22 : _context2.t0 === 'DELETE' ? 31 : 37;
                break;

              case 4:
                _context2.t1 = ctx.request.pluginUrlObj.pathname;
                _context2.next = _context2.t1 === '/list' ? 7 : _context2.t1 === '/port-test' ? 10 : _context2.t1 === '/server/close-list' ? 13 : 15;
                break;

              case 7:
                _context2.next = 9;
                return this.getProxyList(ctx);

              case 9:
                return _context2.abrupt('break', 15);

              case 10:
                _context2.next = 12;
                return (0, _port.portTest)(ctx);

              case 12:
                return _context2.abrupt('break', 15);

              case 13:
                _context2.next = 15;
                return this.getCloseList(ctx);

              case 15:
                return _context2.abrupt('break', 37);

              case 16:
                _context2.t2 = ctx.request.pluginUrlObj.pathname;
                _context2.next = _context2.t2 === '/add' ? 19 : 21;
                break;

              case 19:
                _context2.next = 21;
                return this.addProxy(ctx);

              case 21:
                return _context2.abrupt('break', 37);

              case 22:
                _context2.t3 = ctx.request.pluginUrlObj.pathname;
                _context2.next = _context2.t3 === '/save' ? 25 : _context2.t3 === '/server/status' ? 28 : 30;
                break;

              case 25:
                _context2.next = 27;
                return this.saveProxy(ctx);

              case 27:
                return _context2.abrupt('break', 30);

              case 28:
                _context2.next = 30;
                return this.setServerStatus(ctx);

              case 30:
                return _context2.abrupt('break', 37);

              case 31:
                _context2.t4 = ctx.request.pluginUrlObj.pathname;
                _context2.next = _context2.t4 === '/delete' ? 34 : 36;
                break;

              case 34:
                _context2.next = 36;
                return this.deleteProxy(ctx);

              case 36:
                return _context2.abrupt('break', 37);

              case 37:
                _context2.next = 39;
                return next();

              case 39:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function request(_x, _x2) {
        return _ref3.apply(this, arguments);
      }

      return request;
    }()
  }, {
    key: 'getProxyList',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(ctx) {
        var config;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                config = this.utils.getConfig();
                // allProject: 所有项目中都显示的项

                this.utils.response(ctx, 200, config.allProject || []);

              case 2:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getProxyList(_x3) {
        return _ref4.apply(this, arguments);
      }

      return getProxyList;
    }()
  }, {
    key: 'getCloseList',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(ctx) {
        var config;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                config = this.utils.getConfig();
                // allProject: 所有项目中都显示的项

                this.utils.response(ctx, 200, config.closeList || []);

              case 2:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getCloseList(_x4) {
        return _ref5.apply(this, arguments);
      }

      return getCloseList;
    }()
  }, {
    key: 'addProxy',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(ctx) {
        var _this = this;

        var body;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                body = ctx.request.body;

                if (!this.utils.check(body, [['name', 'string']])) {
                  this.utils.response(ctx, 400, null, {
                    message: 'Param error, check it and retry.'
                  });
                } else {
                  this.utils.setConfig(this.name, function (config) {
                    var result = (0, _lodash.merge)((0, _options.defaultServerOption)(), body);
                    for (var locationIndex in result.server.locations) {
                      var location = result.server.locations[locationIndex];
                      result.server.locations[locationIndex] = (0, _lodash.merge)((0, _options.defaultLocationOption)(), location);
                    }
                    config.allProject = config.allProject || [];
                    config.allProject.push(result);
                    (0, _proxyServer.addChild)(result);
                    _this.utils.response(ctx, 200, result);
                    return config;
                  });
                }

              case 2:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function addProxy(_x5) {
        return _ref6.apply(this, arguments);
      }

      return addProxy;
    }()
  }, {
    key: 'saveProxy',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(ctx) {
        var _this2 = this;

        var body;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                body = ctx.request.body;

                if (!this.utils.check(body, [['id', 'string'], ['name', 'string'], ['server', 'object']])) {
                  this.utils.response(ctx, 400, null, {
                    message: 'Param error, check it and retry.'
                  });
                } else {
                  this.utils.setConfig(this.name, function (config) {
                    for (var proxyIndex in config.allProject || []) {
                      if (config.allProject[proxyIndex].id === body.id) {
                        config.allProject[proxyIndex] = body;
                        (0, _proxyServer.restartChild)(body);
                        _this2.utils.response(ctx, 200, body);
                        return config;
                      }
                    }
                    _this2.utils.response(ctx, 404, null, {
                      message: 'Cannot find Server id "' + body.id + '"'
                    });
                    return config;
                  });
                }

              case 2:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function saveProxy(_x6) {
        return _ref7.apply(this, arguments);
      }

      return saveProxy;
    }()
  }, {
    key: 'deleteProxy',
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(ctx) {
        var _this3 = this;

        var query;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                query = ctx.request.query;

                if (!this.utils.check(query, [['id', 'string']])) {
                  this.utils.response(ctx, 400, null, {
                    message: 'Param error, check it and retry.'
                  });
                } else {
                  this.utils.setConfig(this.name, function (config) {
                    for (var proxyIndex in config.allProject || []) {
                      if (config.allProject[proxyIndex].id === query.id) {
                        config.allProject.splice(proxyIndex, 1);
                        (0, _proxyServer.closeChild)(query.id);
                        _this3.utils.response(ctx, 200, query);
                        return config;
                      }
                    }
                    _this3.utils.response(ctx, 404, null, {
                      message: 'Cannot find Server id "' + query.id + '"'
                    });
                    return config;
                  });
                }

              case 2:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function deleteProxy(_x7) {
        return _ref8.apply(this, arguments);
      }

      return deleteProxy;
    }()
  }, {
    key: 'setServerStatus',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(ctx) {
        var _this4 = this;

        var body;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                body = ctx.request.body;

                console.log(body);

                if (this.utils.check(body, [['id', 'string'], ['close', 'boolean']])) {
                  _context9.next = 6;
                  break;
                }

                this.utils.response(ctx, 400, null, {
                  message: 'Param error, check it and retry.'
                });
                _context9.next = 8;
                break;

              case 6:
                _context9.next = 8;
                return this.utils.setConfig(this.name, function () {
                  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(config) {
                    var closeList;
                    return regeneratorRuntime.wrap(function _callee8$(_context8) {
                      while (1) {
                        switch (_context8.prev = _context8.next) {
                          case 0:
                            closeList = new Set(config.closeList);

                            if (!body.close) {
                              _context8.next = 7;
                              break;
                            }

                            closeList.add(body.id);
                            _context8.next = 5;
                            return (0, _proxyServer.pauseChild)(body.id);

                          case 5:
                            _context8.next = 10;
                            break;

                          case 7:
                            _context8.next = 9;
                            return (0, _proxyServer.resumeChild)(body.id);

                          case 9:
                            closeList.delete(body.id);

                          case 10:
                            config.closeList = closeList;
                            _this4.utils.response(ctx, 200, null);
                            return _context8.abrupt('return', config);

                          case 13:
                          case 'end':
                            return _context8.stop();
                        }
                      }
                    }, _callee8, _this4);
                  }));

                  return function (_x9) {
                    return _ref10.apply(this, arguments);
                  };
                }());

              case 8:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function setServerStatus(_x8) {
        return _ref9.apply(this, arguments);
      }

      return setServerStatus;
    }()
  }, {
    key: 'destroy',
    value: function destroy() {
      // this.eventBus.$off(`plugin-request-${this.name}`, this.request)
    }
  }]);

  return ProxyObj;
}();

exports.default = ProxyObj;