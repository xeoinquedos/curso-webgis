'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const childProcess = require('child_process');

var _require = require('events');

const EventEmitter = _require.EventEmitter;

const errorUtils = require('./errorUtils');

const childModule = parseInt(process.versions.node, 10) < 8 ? require.resolve('../../lib/workerfarm/child') : require.resolve('../../src/workerfarm/child');

let WORKER_ID = 0;

class Worker extends EventEmitter {
  constructor(options) {
    super();

    this.options = options;
    this.id = WORKER_ID++;

    this.sendQueue = [];
    this.processQueue = true;

    this.calls = new Map();
    this.exitCode = null;
    this.callId = 0;

    this.ready = false;
    this.stopped = false;
    this.isStopping = false;
  }

  fork(forkModule, bundlerOptions) {
    var _this = this;

    return _asyncToGenerator(function* () {
      let filteredArgs = process.execArgv.filter(function (v) {
        return !/^--(debug|inspect)/.test(v);
      });

      let options = {
        execArgv: filteredArgs,
        env: process.env,
        cwd: process.cwd()
      };

      _this.child = childProcess.fork(childModule, process.argv, options);

      _this.child.on('message', _this.receive.bind(_this));

      _this.child.once('exit', function (code) {
        _this.exitCode = code;
        _this.emit('exit', code);
      });

      _this.child.on('error', function (err) {
        _this.emit('error', err);
      });

      yield new Promise(function (resolve, reject) {
        _this.call({
          method: 'childInit',
          args: [forkModule],
          retries: 0,
          resolve,
          reject
        });
      });

      yield _this.init(bundlerOptions);
    })();
  }

  init(bundlerOptions) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      _this2.ready = false;

      return new Promise(function (_resolve, reject) {
        _this2.call({
          method: 'init',
          args: [bundlerOptions],
          retries: 0,
          resolve: function resolve(...args) {
            _this2.ready = true;
            _this2.emit('ready');
            _resolve(...args);
          },
          reject
        });
      });
    })();
  }

  send(data) {
    if (!this.processQueue) {
      return this.sendQueue.push(data);
    }

    let result = this.child.send(data, error => {
      if (error && error instanceof Error) {
        // Ignore this, the workerfarm handles child errors
        return;
      }

      this.processQueue = true;

      if (this.sendQueue.length > 0) {
        let queueCopy = this.sendQueue.slice(0);
        this.sendQueue = [];
        queueCopy.forEach(entry => this.send(entry));
      }
    });

    if (!result || /^win/.test(process.platform)) {
      // Queue is handling too much messages throttle it
      this.processQueue = false;
    }
  }

  call(call) {
    if (this.stopped || this.isStopping) {
      return;
    }

    let idx = this.callId++;
    this.calls.set(idx, call);

    this.send({
      type: 'request',
      idx: idx,
      child: this.id,
      method: call.method,
      args: call.args
    });
  }

  receive(data) {
    if (this.stopped || this.isStopping) {
      return;
    }

    let idx = data.idx;
    let type = data.type;
    let content = data.content;
    let contentType = data.contentType;

    if (type === 'request') {
      this.emit('request', data);
    } else if (type === 'response') {
      let call = this.calls.get(idx);
      if (!call) {
        // Return for unknown calls, these might accur if a third party process uses workers
        return;
      }

      if (contentType === 'error') {
        call.reject(errorUtils.jsonToError(content));
      } else {
        call.resolve(content);
      }

      this.calls.delete(idx);
      this.emit('response', data);
    }
  }

  stop() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      if (!_this3.stopped) {
        _this3.stopped = true;

        if (_this3.child) {
          _this3.child.send('die');

          let forceKill = setTimeout(function () {
            return _this3.child.kill('SIGINT');
          }, _this3.options.forcedKillTime);
          yield new Promise(function (resolve) {
            _this3.child.once('exit', resolve);
          });

          clearTimeout(forceKill);
        }
      }
    })();
  }
}

module.exports = Worker;