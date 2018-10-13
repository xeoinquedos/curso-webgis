'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

let getConfig = (() => {
  var _ref2 = _asyncToGenerator(function* (asset) {
    let config = yield asset.getConfig(['.postcssrc', '.postcssrc.js', 'postcss.config.js'], { packageKey: 'postcss' });

    let enableModules = asset.options.rendition && asset.options.rendition.modules;
    if (!config && !asset.options.minify && !enableModules) {
      return;
    }

    config = config || {};
    let postcssModulesConfig = {
      getJSON: function getJSON(filename, json) {
        return asset.cssModules = json;
      }
    };

    if (config.plugins && config.plugins['postcss-modules']) {
      postcssModulesConfig = Object.assign(config.plugins['postcss-modules'], postcssModulesConfig);
      delete config.plugins['postcss-modules'];
    }

    config.plugins = yield loadPlugins(config.plugins, asset.name);

    if (config.modules || enableModules) {
      let postcssModules = yield localRequire('postcss-modules', asset.name);
      config.plugins.push(postcssModules(postcssModulesConfig));
    }

    if (asset.options.minify) {
      var _ref3 = yield Promise.all(['cssnano', 'cssnano/package.json'].map(function (name) {
        return localRequire(name, asset.name).catch(function () {
          return require(name);
        });
      })),
          _ref4 = _slicedToArray(_ref3, 2);

      let cssnano = _ref4[0],
          version = _ref4[1].version;

      config.plugins.push(cssnano((yield asset.getConfig(['cssnano.config.js'])) || {
        // Only enable safe css transforms if cssnano < 4
        // See: https://github.com/parcel-bundler/parcel/issues/698
        // See: https://github.com/ben-eb/cssnano/releases/tag/v4.0.0-rc.0
        safe: semver.satisfies(version, '<4.0.0-rc')
      }));
    }

    config.from = asset.name;
    config.to = asset.name;
    return config;
  });

  return function getConfig(_x2) {
    return _ref2.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const localRequire = require('../utils/localRequire');
const loadPlugins = require('../utils/loadPlugins');
const postcss = require('postcss');
const semver = require('semver');

module.exports = (() => {
  var _ref = _asyncToGenerator(function* (asset) {
    let config = yield getConfig(asset);
    if (!config) {
      return;
    }

    yield asset.parseIfNeeded();
    let res = yield postcss(config.plugins).process(asset.getCSSAst(), config);

    asset.ast.css = res.css;
    asset.ast.dirty = false;
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();