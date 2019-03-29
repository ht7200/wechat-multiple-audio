module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable quotes */
var innerAudioContext = wx.createInnerAudioContext();
Component({
  properties: {
    prop: {
      type: String,
      value: 'index.properties'
    }
  },
  data: {
    isPlaying: false,
    curTimeVal: '00:00',
    duration: '00:00',
    curValue: 0,
    maxValue: 0
  },
  lifetimes: {
    attached: function attached() {
      var _this = this;

      wx.getSystemInfo({
        success: function success() {
          _this.setData({
            flag: true
          });
        }
      });
    }
  },
  ready: function ready() {
    innerAudioContext.autoplay = false;
    innerAudioContext.src = 'http://m10.music.126.net/20190328140202/13d2b669a01d87295490f617b8b0e86f/ymusic/4d92/739d/6c66/0c9aff0de4d9a4de19f1d4d5f5129db0.mp3';
  },

  methods: {
    play: function play() {
      console.log('play buttin clicked');
      console.log('audio play!!!');
      innerAudioContext.play();
      // 监听播放器事件
      this.onPlayer();
      this.setData({
        isPlaying: true
      });
    },
    pause: function pause() {
      innerAudioContext.pause();
      this.setData({
        isPlaying: false
      });
    },
    stop: function stop() {
      innerAudioContext.stop();
      innerAudioContext.offPlay();
      this.setData({
        isPlaying: false
      });
    },
    bindchange: function bindchange(e) {
      var stemp = e.detail.value;
      innerAudioContext.seek(stemp.toFixed(0));
    },
    timeFormat: function timeFormat(time) {
      var min = (time / 60).toFixed(0);
      var sec = (time % 60).toFixed(0);

      if (min < 10) min = '0' + min;
      if (sec < 10) sec = '0' + sec;
      return min + ':' + sec;
    },
    onPlayer: function onPlayer() {
      var _this2 = this;

      // 监听播放时间
      this.onTimeUpdate();
      innerAudioContext.onPlay(function () {
        console.log("playing");
      });
      // 监听播放器跳转中
      innerAudioContext.onSeeking(function () {
        console.log('onSeeking');
        innerAudioContext.offTimeUpdate();
      });
      // 监听播放器跳转完成
      innerAudioContext.onSeeked(function () {
        console.log('onSeeked');
        _this2.setData({
          isPlaying: true
        });
        _this2.onPlayer();
      });
      // 监听播放器播放结束
      innerAudioContext.onSeeked(function () {
        _this2.setData({
          isPlaying: false
        });
      });
    },
    onTimeUpdate: function onTimeUpdate() {
      var _this3 = this;

      console.log('onTimeUpdate');
      innerAudioContext.onTimeUpdate(function () {
        _this3.curValue = innerAudioContext.currentTime;
        _this3.curTimeVal = parseInt(_this3.curValue, 10);
        _this3.curTimeVal = _this3.timeFormat(_this3.curTimeVal);
        _this3.maxValue = innerAudioContext.duration;
        _this3.duration = _this3.timeFormat(_this3.maxValue);
        _this3.setData({
          curTimeVal: _this3.curTimeVal,
          duration: _this3.duration,
          maxValue: _this3.maxValue,
          curValue: _this3.curValue
        });
      });
    }
  }
});

/***/ })
/******/ ]);