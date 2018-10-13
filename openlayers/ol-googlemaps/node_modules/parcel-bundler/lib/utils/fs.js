'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const promisify = require('./promisify');
const fs = require('fs');
const mkdirp = require('mkdirp');

exports.readFile = promisify(fs.readFile);
exports.writeFile = promisify(fs.writeFile);
exports.stat = promisify(fs.stat);
exports.readdir = promisify(fs.readdir);
exports.unlink = promisify(fs.unlink);
exports.realpath = (() => {
  var _ref = _asyncToGenerator(function* (path) {
    const realpath = promisify(fs.realpath);
    try {
      path = yield realpath(path);
    } catch (e) {
      // do nothing
    }
    return path;
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();
exports.lstat = promisify(fs.lstat);

exports.exists = function (filename) {
  return new Promise(resolve => {
    fs.exists(filename, resolve);
  });
};

exports.mkdirp = promisify(mkdirp);