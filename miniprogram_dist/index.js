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
var timer = null;
Component({
  properties: {
    audioList: {
      type: Array,
      value: [{ asrc: 'http://m10.music.126.net/20190330104904/bc7b35f16da6374e81bbdf507a423440/ymusic/fa90/df9c/59f7/95c4a2802e0b9191ae1a048f127e53c5.mp3' }, { asrc: 'http://m10.music.126.net/20190328140202/13d2b669a01d87295490f617b8b0e86f/ymusic/4d92/739d/6c66/0c9aff0de4d9a4de19f1d4d5f5129db0.mp3' }]
    },
    activeColor: {
      type: String,
      value: "#3d92e1"
    },
    blockColor: {
      type: String,
      value: "#3d92e1"
    },
    buttonColor: {
      type: String,
      value: "#3d92e1"
    },
    asrc: {
      type: String,
      value: ''
    },
    amount: {
      type: Number,
      value: 1
    }
  },
  data: {},
  attached: function attached() {
    this.setData({
      seekStemp: 0
    });
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
    this.resetTime();
  },

  methods: {
    start: function start() {
      console.log('play buttin clicked');
      this.triggerEvent('changAudio', { onId: this.data.audioId });
    },
    play: function play(event) {
      var _setData,
          _this2 = this;

      var id = event.target.id;
      var src = this.data.audioList[id].asrc;
      var isPlaying = this.data.audioList[id].isPlaying;
      this.stopOther(id);

      innerAudioContext.autoplay = false;
      innerAudioContext.src = src;
      console.log('audio play!!!');
      isPlaying = 'audioList[' + id + '].isPlaying';
      innerAudioContext.play();
      // 监听播放器事件
      this.onPlayer(id);
      this.setData((_setData = {}, _setData[isPlaying] = true, _setData));
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        var _this2$setData;

        var next = _this2.data.audioList[id].seekStemp + 1;
        var val = _this2.timeFormat(next);
        if (next >= _this2.data.audioList[id].maxValue) {
          clearInterval(timer);
        }
        var seekStemp = 'audioList[' + id + '].seekStemp';
        var curValue = 'audioList[' + id + '].curValue';
        var curTimeVal = 'audioList[' + id + '].curTimeVal';

        _this2.setData((_this2$setData = {}, _this2$setData[seekStemp] = next, _this2$setData[curValue] = next, _this2$setData[curTimeVal] = val, _this2$setData));
      }, 1000);
    },
    pause: function pause(event) {
      var _setData2;

      var id = event.target.id;
      var isPlaying = 'audioList[' + id + '].isPlaying';
      clearInterval(timer);
      innerAudioContext.pause();
      this.setData((_setData2 = {}, _setData2[isPlaying] = false, _setData2));
    },
    stop: function stop(event) {
      var _setData3;

      var id = event.target.id;
      var isPlaying = 'audioList[' + id + '].isPlaying';
      clearInterval(timer);
      console.log("audio stop!!!");
      innerAudioContext.stop();
      innerAudioContext.offPlay();
      this.setData((_setData3 = {}, _setData3[isPlaying] = false, _setData3));
    },
    bindchanging: function bindchanging() {
      // innerAudioContext.offSeeking()
    },
    bindchange: function bindchange(e) {
      var _setData4;

      var id = e.target.id;
      var stemp = e.detail.value;
      var seekStemp = 'audioList[' + id + '].seekStemp';

      this.setData((_setData4 = {}, _setData4[seekStemp] = stemp, _setData4));
      // this.toSeek(stemp, id)
    },
    toSeek: function toSeek(stemp, id) {
      var _setData5;

      innerAudioContext.seek(stemp);
      var isPlaying = 'audioList[' + id + '].isPlaying';
      this.setData((_setData5 = {}, _setData5[isPlaying] = true, _setData5));
    },
    timeFormat: function timeFormat(time) {
      var min = (time / 60).toFixed(0);
      var sec = (time % 60).toFixed(0);

      if (min < 10) min = '0' + min;
      if (sec < 10) sec = '0' + sec;
      return min + ':' + sec;
    },
    onPlayer: function onPlayer(id) {
      var _this3 = this;

      var isPlaying = 'audioList[' + id + '].isPlaying';
      var curValue = 'audioList[' + id + '].curValue';
      var curTimeVal = 'audioList[' + id + '].curTimeVal';
      var seekStemp = 'audioList[' + id + '].seekStemp';
      // 监听播放时间
      innerAudioContext.onPlay(function () {
        console.log("playing");
        _this3.onTimeUpdate(id);
      });
      innerAudioContext.onError(function (res) {
        console.error(res.errMsg);
        console.error(res.errCode);
      });
      // 监听播放器跳转中
      // innerAudioContext.onSeeking(() => {
      //   console.log('onSeeking')
      // })
      // 监听播放器跳转完成
      // innerAudioContext.onSeeked(() => {
      //   this.setData({
      //     [isPlaying]: true
      //   })
      // })
      // 监听播放器播放结束
      innerAudioContext.onEnded(function () {
        var _this3$setData;

        clearInterval(timer);
        _this3.setData((_this3$setData = {}, _this3$setData[isPlaying] = false, _this3$setData[curTimeVal] = '00:00', _this3$setData[curValue] = 0, _this3$setData[seekStemp] = 0, _this3$setData));
      });
      innerAudioContext.onStop(function () {
        var _this3$setData2;

        clearInterval(timer);
        _this3.setData((_this3$setData2 = {}, _this3$setData2[isPlaying] = false, _this3$setData2[curTimeVal] = '00:00', _this3$setData2[curValue] = 0, _this3$setData2[seekStemp] = 0, _this3$setData2));
      });
    },
    onTimeUpdate: function onTimeUpdate(id) {
      var _this4 = this;

      innerAudioContext.onTimeUpdate(function () {
        var _this4$setData;

        // 小程序原生音频的BUG，跳转播放之后失去监听
        // this.curValue = this.data.seekStemp
        // this.curTimeVal = this.timeFormat(this.data.seekStemp)
        /*
        this.curValue = innerAudioContext.currentTime
        this.curTimeVal = parseInt(this.curValue, 10)
        this.curTimeVal = this.timeFormat(this.curTimeVal)
        */
        _this4.data.audioList[id].maxValue = innerAudioContext.duration;
        _this4.data.audioList[id].duration = _this4.timeFormat(_this4.data.audioList[id].maxValue);
        var duration = 'audioList[' + id + '].duration';
        var maxValue = 'audioList[' + id + '].maxValue';
        _this4.setData((_this4$setData = {}, _this4$setData[duration] = _this4.data.audioList[id].duration, _this4$setData[maxValue] = _this4.data.audioList[id].maxValue, _this4$setData));
      });
    },
    resetTime: function resetTime() {
      for (var i = 0; i < this.data.audioList.length; i++) {
        var _setData6;

        var isPlaying = 'audioList[' + i + '].isPlaying';
        var curTimeVal = 'audioList[' + i + '].curTimeVal';
        var duration = 'audioList[' + i + '].duration';
        var curValue = 'audioList[' + i + '].curValue';
        var maxValue = 'audioList[' + i + '].maxValue';
        var seekStemp = 'audioList[' + i + '].seekStemp';
        this.setData((_setData6 = {}, _setData6[isPlaying] = false, _setData6[curTimeVal] = '00:00', _setData6[duration] = '00:00', _setData6[curValue] = 0, _setData6[maxValue] = 0, _setData6[seekStemp] = 0, _setData6));
      }
    },
    stopOther: function stopOther(id) {
      for (var i = 0; i < this.data.audioList.length; i++) {
        if (i !== parseInt(id, 10)) {
          var _setData7;

          var isPlaying = 'audioList[' + i + '].isPlaying';
          var curTimeVal = 'audioList[' + i + '].curTimeVal';
          var curValue = 'audioList[' + i + '].curValue';
          var seekStemp = 'audioList[' + i + '].seekStemp';
          this.setData((_setData7 = {}, _setData7[isPlaying] = false, _setData7[curTimeVal] = '00:00', _setData7[curValue] = 0, _setData7[seekStemp] = 0, _setData7));
        }
      }
    }
  }
});

/***/ })
/******/ ]);