'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _warpedTime = require('warped-time');

var _warpedTimeControls = require('./warped-time-controls.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Test TimeControls class
var TestableTicker = function (_Ticker) {
    (0, _inherits3.default)(TestableTicker, _Ticker);

    function TestableTicker() {
        (0, _classCallCheck3.default)(this, TestableTicker);
        return (0, _possibleConstructorReturn3.default)(this, (TestableTicker.__proto__ || (0, _getPrototypeOf2.default)(TestableTicker)).apply(this, arguments));
    }

    (0, _createClass3.default)(TestableTicker, [{
        key: 'tick',
        value: function tick() {
            this.subscribers.forEach(function (fn) {
                return fn();
            });
            if (this.running) {
                setTimeout(this.tick.bind(this), 2);
            }
        }
    }]);
    return TestableTicker;
}(Ticker);

var TestableTimeControls = function (_TimeControls) {
    (0, _inherits3.default)(TestableTimeControls, _TimeControls);

    function TestableTimeControls() {
        (0, _classCallCheck3.default)(this, TestableTimeControls);
        return (0, _possibleConstructorReturn3.default)(this, (TestableTimeControls.__proto__ || (0, _getPrototypeOf2.default)(TestableTimeControls)).apply(this, arguments));
    }

    (0, _createClass3.default)(TestableTimeControls, [{
        key: 'tick',
        value: function tick() {
            this.state = this.computeState();
        }
    }]);
    return TestableTimeControls;
}(_warpedTimeControls.TimeControls);

var tick = new TestableTicker();
assert(Array.isArray(tick.subscribers), 'expected an Array, got ' + (0, _typeof3.default)(tick.subscribers));
assert(tick.running === true, 'expected true, got ' + tick.running);

var controls_start = Date.now();
var props = { time: new _warpedTime.WarpedTime(), tick: tick };
var controls = new TestableTimeControls(props);

var state = controls.computeState();
assert_fuzzy_equal_time(state.genesis_time, controls_start, 'expected ' + controls_start + ', got ' + state.genesis_time);

controls.time.setWarpedTime(t);
assert_fuzzy_equal_time(controls.time.getWarpedTime(), t, 'expected ' + t + ', got ' + controls.time.getWarpedTime());

var testControlsAfterNDelays = function testControlsAfterNDelays(n, wt, t, delay, recursive_call) {
    // babel-node is slow and the first iteration of this tests sometimes
    //  fails as a result
    if (recursive_call) {
        var warped_time = controls.state.warped_time;
        assert_fuzzy_equal_time(warped_time, t + delay * speed, 'warped_time - t + (delay * speed) == ' + (warped_time - (t + delay * speed)) + ' but should be ~0.\n' + ('warped_time: ' + warped_time) + (', t: ' + t + ', delay: ' + delay + ', speed: ' + speed) + ('\nn is ' + n + '.'));
    }
    controls.time.setSpeed(speed);
    controls.time.setWarpedTime(t);
    if (n > 0) {
        setTimeout(testControlsAfterNDelays, delay, n - 1, wt, t, delay, true);
    } else {
        tick.stop();
    }
};
testControlsAfterNDelays(20, controls, 10, 10, false);
