/* eslint-disable quotes */
const innerAudioContext = wx.createInnerAudioContext()
let timer = null
Component({
  properties: {
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
    src: {
      type: String,
      value: 'http://m10.music.126.net/20190328140202/13d2b669a01d87295490f617b8b0e86f/ymusic/4d92/739d/6c66/0c9aff0de4d9a4de19f1d4d5f5129db0.mp3'
    },
    amount: {
      type: Number,
      value: 1
    }
  },
  data: {
    isPlaying: false,
    curTimeVal: '00:00',
    duration: '00:00',
    curValue: 0,
    maxValue: 0,
    seekStemp: 0
  },
  attached() {
    this.setData({
      seekStemp: 0,
    })
  },
  lifetimes: {
    attached() {
      wx.getSystemInfo({
        success: () => {
          this.setData({
            flag: true,
          })
        }
      })
    }
  },
  ready() {
    const src = this.data.src
    innerAudioContext.autoplay = false
    innerAudioContext.src = src
  },
  methods: {
    play() {
      console.log('play buttin clicked')
      console.log('audio play!!!')
      innerAudioContext.play()
      // 监听播放器事件
      this.onPlayer()
      this.setData({
        isPlaying: true
      })
      timer = setInterval(() => {
        const next = this.data.seekStemp + 1
        const val = this.timeFormat(next)
        console.log(val)
        this.setData({
          seekStemp: next,
          curValue: next,
          curTimeVal: val
        })
      }, 1000)
    },
    pause() {
      clearInterval(timer)
      innerAudioContext.pause()
      this.setData({
        isPlaying: false
      })
    },
    stop() {
      clearInterval(timer)
      innerAudioContext.stop()
      innerAudioContext.offPlay()
      this.setData({
        isPlaying: false
      })
    },
    bindchanging() {
      // innerAudioContext.pause()
    },
    bindchange(e) {
      const stemp = e.detail.value
      this.setData({
        seekStemp: stemp
      })
      this.toSeek(stemp)
    },
    toSeek(stemp) {
      innerAudioContext.seek(stemp)
    },
    timeFormat(time) {
      let min = (time / 60).toFixed(0)
      let sec = (time % 60).toFixed(0)

      if (min < 10) min = '0' + min
      if (sec < 10) sec = '0' + sec
      return min + ':' + sec
    },
    onPlayer() {
      // 监听播放时间
      innerAudioContext.onPlay(() => {
        console.log("playing")
        this.onTimeUpdate()
      })
      innerAudioContext.onError((res) => {
        console.error(res.errMsg)
        console.error(res.errCode)
      })
      // 监听播放器跳转中
      // innerAudioContext.onSeeking(() => {
      //   console.log('onSeeking')
      // })
      // 监听播放器跳转完成
      innerAudioContext.onSeeked(() => {
        this.setData({
          isPlaying: true
        })
        // if (!this.isPlaying) {
        //   setTimeout(() => {
        //     if (!this.isPlaying) {
        //       console.log('onSeeked')
        //       this.pause()
        //       this.play()
        //       this.setData({
        //         isPlaying: true
        //       })
        //     }
        //   }, 200)
        // }
      })
      // 监听播放器播放结束
      innerAudioContext.onEnded(() => {
        clearInterval(timer)
        this.setData({
          isPlaying: false,
          curTimeVal: '00:00',
          curValue: 0
        })
      })
    },
    onTimeUpdate() {
      innerAudioContext.onTimeUpdate(() => {
        console.log('onTimeUpdate')

        // 小程序原生音频的BUG，跳转播放之后失去监听
        // this.curValue = this.data.seekStemp
        // this.curTimeVal = this.timeFormat(this.data.seekStemp)
        /*
        this.curValue = innerAudioContext.currentTime
        this.curTimeVal = parseInt(this.curValue, 10)
        this.curTimeVal = this.timeFormat(this.curTimeVal)
        */

        this.maxValue = innerAudioContext.duration
        this.duration = this.timeFormat(this.maxValue)
        this.setData({
          // curTimeVal: this.curTimeVal,
          duration: this.duration,
          maxValue: this.maxValue,
        })
      })
    }
  }
})
