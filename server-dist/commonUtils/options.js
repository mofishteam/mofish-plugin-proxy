'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultLocationMockOption = exports.defaultLocationProxyPassOption = exports.defaultInterceptorOption = exports.defaultLocationStaticOption = exports.defaultLocationOption = exports.defaultServerOption = exports.getId = undefined;

var _md = require('md5');

var _md2 = _interopRequireDefault(_md);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var idCnt = 0;

var getId = exports.getId = function getId(name) {
  return (0, _md2.default)(name + new Date().valueOf() + idCnt++);
};

var defaultServerOption = exports.defaultServerOption = function defaultServerOption() {
  return {
    id: (0, _md2.default)('server' + new Date().valueOf() + idCnt++),
    include: null,
    name: getId('serverName'),
    server: {
      name: [],
      ssl: false,
      sslOptions: {
        key: '',
        cert: ''
      },
      listen: 8080,
      locations: []
    }
  };
};

var defaultLocationOption = exports.defaultLocationOption = function defaultLocationOption() {
  return {
    id: getId('location'),
    isClose: false,
    url: '/',
    type: 'proxyPass',
    proxyPass: defaultLocationProxyPassOption(),
    static: defaultLocationStaticOption(),
    mock: defaultLocationMockOption()
  };
};

var defaultLocationStaticOption = exports.defaultLocationStaticOption = function defaultLocationStaticOption() {
  return {
    path: '',
    // Browser cache max-age in milliseconds. defaults to 0
    maxage: 0,
    // Allow transfer of hidden files. defaults to false
    hidden: false,
    // Default file name, defaults to 'index.html'
    index: 'index.html',
    // If true, serves after return next(), allowing any downstream middleware to respond first.
    defer: false,
    // Try to serve the gzipped version of a file automatically when gzip is supported by a client and if the requested file with .gz extension exists. defaults to true
    gzip: false,
    // Try to serve the brotli version of a file automatically when brotli is supported by a client and if the requested file with .br extension exists (note, that brotli is only accepted over https). defaults to true
    br: true,
    // Function to set custom headers on response
    setHeaders: null,
    // Try to match extensions from passed array to search for file when no extension is sufficed in URL. First found is served. (defaults to false)
    extensioins: null
  };
};

var defaultInterceptorOption = exports.defaultInterceptorOption = function defaultInterceptorOption() {
  return {
    id: getId('interceptor'),
    type: 'response',
    name: '',
    handler: ''
  };
};

var defaultLocationProxyPassOption = exports.defaultLocationProxyPassOption = function defaultLocationProxyPassOption() {
  return {
    // url string to be parsed with the url module
    target: '',
    // true/false, Default: false - changes the origin of the host header to the target URL
    changeOrigin: true,
    // true/false: if you want to proxy websockets
    ws: true,
    router: [],
    pathRewrite: [],
    interceptors: {
      response: [],
      request: []
    },
    // 高级设置：
    // true/false, if you want to verify the SSL Certs
    secure: true,
    // url string to be parsed with the url module
    forward: false,
    // object to be passed to http(s).request (see Node's https agent and http agent objects)
    agent: false,
    // object to be passed to https.createServer()
    ssl: {},
    // true/false, adds x-forward headers
    xfwd: false,
    // true/false, passes the absolute URL as the path (useful for proxying to proxies)
    toProxy: false,
    // true/false, Default: true - specify whether you want to prepend the target's path to the proxy path
    prependPath: true,
    // true/false, Default: false - specify whether you want to ignore the proxy path of the incoming request (note: you will have to append / manually if required)
    ignorePath: false,
    // Local interface string to bind for outgoing connections
    localAddress: '',
    // true/false, Default: false - specify whether you want to keep letter case of response header key
    preserveHeaderKeyCase: false,
    // Basic authentication i.e. 'user:password' to compute an Authorization header
    auth: '',
    // rewrites the location hostname on (301/302/307/308) redirects
    hostRewrite: false,
    // rewrites the location host/port on (301/302/307/308) redirects based on requested host/port. Default: false
    autoRewrite: false,
    // rewrites the location protocol on (301/302/307/308) redirects to 'http' or 'https'. Default: null
    protocolRewrite: false,
    // see https://www.npmjs.com/package/http-proxy-middleware
    cookieDomainRewrite: false,
    // see https://www.npmjs.com/package/http-proxy-middleware
    cookiePathRewrite: false,
    // object, adds request headers. (Example: {host:'www.example.org'})
    headers: {},
    // timeout (in millis) when proxy receives no response from target
    proxyTimeout: false,
    // timeout (in millis) for incoming requests
    timeout: 0,
    // true/false, Default: false - specify whether you want to follow redirects
    followRedirects: false,
    // true/false, if set to true, none of the webOutgoing passes are called and it's your responsibility to appropriately return the response by listening and acting on the proxyRes event
    selfHandleResponse: false,
    // see https://www.npmjs.com/package/http-proxy-middleware
    buffer: false
  };
};

var defaultLocationMockOption = exports.defaultLocationMockOption = function defaultLocationMockOption() {
  return {
    method: 'all',
    type: 'json',
    json: '',
    jsonPath: '',
    proxyPass: defaultLocationProxyPassOption(),
    body: null,
    header: {},
    status: 200,
    handler: null,
    interceptor: null
  };
};