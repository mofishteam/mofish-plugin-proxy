'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _options = require('./commonUtils/options');

var _lodash = require('lodash');

var _proxyServer = require('./proxyServer');

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
    value: function startServers() {
      if (this.config.allProject && this.config.allProject.length) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.config.allProject[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var server = _step.value;

            (0, _proxyServer.addChild)(server);
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
      }
    }
  }, {
    key: 'request',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx, next) {
        var method;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                method = ctx.request.method;
                _context.t0 = method;
                _context.next = _context.t0 === 'GET' ? 4 : _context.t0 === 'POST' ? 10 : _context.t0 === 'PUT' ? 16 : _context.t0 === 'DELETE' ? 22 : 28;
                break;

              case 4:
                _context.t1 = ctx.request.pluginUrlObj.pathname;
                _context.next = _context.t1 === '/list' ? 7 : 9;
                break;

              case 7:
                _context.next = 9;
                return this.getProxyList(ctx);

              case 9:
                return _context.abrupt('break', 28);

              case 10:
                _context.t2 = ctx.request.pluginUrlObj.pathname;
                _context.next = _context.t2 === '/add' ? 13 : 15;
                break;

              case 13:
                _context.next = 15;
                return this.addProxy(ctx);

              case 15:
                return _context.abrupt('break', 28);

              case 16:
                _context.t3 = ctx.request.pluginUrlObj.pathname;
                _context.next = _context.t3 === '/save' ? 19 : 21;
                break;

              case 19:
                _context.next = 21;
                return this.saveProxy(ctx);

              case 21:
                return _context.abrupt('break', 28);

              case 22:
                _context.t4 = ctx.request.pluginUrlObj.pathname;
                _context.next = _context.t4 === '/delete' ? 25 : 27;
                break;

              case 25:
                _context.next = 27;
                return this.deleteProxy(ctx);

              case 27:
                return _context.abrupt('break', 28);

              case 28:
                _context.next = 30;
                return next();

              case 30:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function request(_x, _x2) {
        return _ref2.apply(this, arguments);
      }

      return request;
    }()
  }, {
    key: 'getProxyList',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ctx) {
        var config;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                config = this.utils.getConfig();
                // allProject: 所有项目中都显示的项

                this.utils.response(ctx, 200, config.allProject || []);

              case 2:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getProxyList(_x3) {
        return _ref3.apply(this, arguments);
      }

      return getProxyList;
    }()
  }, {
    key: 'addProxy',
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(ctx) {
        var _this = this;

        var body;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
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
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function addProxy(_x4) {
        return _ref4.apply(this, arguments);
      }

      return addProxy;
    }()
  }, {
    key: 'saveProxy',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(ctx) {
        var _this2 = this;

        var body;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
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
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function saveProxy(_x5) {
        return _ref5.apply(this, arguments);
      }

      return saveProxy;
    }()
  }, {
    key: 'deleteProxy',
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(ctx) {
        var _this3 = this;

        var query;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
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
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function deleteProxy(_x6) {
        return _ref6.apply(this, arguments);
      }

      return deleteProxy;
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