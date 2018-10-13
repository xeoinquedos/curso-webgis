'use strict';

let run = (() => {
  var _ref = _asyncToGenerator(function* (path, isWarmUp) {
    try {
      return yield pipeline.process(path, isWarmUp);
    } catch (e) {
      e.fileName = path;
      throw e;
    }
  });

  return function run(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require('v8-compile-cache');
const Pipeline = require('./Pipeline');

let pipeline;

function init(options) {
  pipeline = new Pipeline(options || {});
  Object.assign(process.env, options.env || {});
  process.env.HMR_PORT = options.hmrPort;
  process.env.HMR_HOSTNAME = options.hmrHostname;
}

exports.init = init;
exports.run = run;