/* eslint-disable quotes */
const innerAudioContext = wx.createInnerAudioContext()
Component({
  properties: {
    prop: {
      type: String,
      value: 'index.properties'
    },
  },
  data: {
    isPlaying: false,
    curTimeVal: '00:00',
    duration: '00:00',
    curValue: 0,
    maxValue: 0
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
    innerAudioContext.autoplay = false
    innerAudioContext.src = 'http://m10.music.126.net/20190328140202/13d2b669a01d87295490f617b8b0e86f/ymusic/4d92/739d/6c66/0c9aff0de4d9a4de19f1d4d5f5129db0.mp3'
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
    },
    pause() {
      innerAudioContext.pause()
      this.setData({
        isPlaying: false
      })
    },
    stop() {
      innerAudioContext.stop()
      innerAudioContext.offPlay()
      this.setData({
        isPlaying: false
      })
    },
    bindchange(e) {
      const stemp = e.detail.value
      innerAudioContext.seek(stemp.toFixed(0))
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
      this.onTimeUpdate()
      innerAudioContext.onPlay(() => {
        console.log("playing")
      })
      // 监听播放器跳转中
      innerAudioContext.onSeeking(() => {
        console.log('onSeeking')
        innerAudioContext.offTimeUpdate()
      })
      // 监听播放器跳转完成
      innerAudioContext.onSeeked(() => {
        console.log('onSeeked')
        this.setData({
          isPlaying: true
        })
        this.onPlayer()
      })
      // 监听播放器播放结束
      innerAudioContext.onSeeked(() => {
        this.setData({
          isPlaying: false
        })
      })
    },
    onTimeUpdate() {
      console.log('onTimeUpdate')
      innerAudioContext.onTimeUpdate(() => {
        this.curValue = innerAudioContext.currentTime
        this.curTimeVal = parseInt(this.curValue, 10)
        this.curTimeVal = this.timeFormat(this.curTimeVal)
        this.maxValue = innerAudioContext.duration
        this.duration = this.timeFormat(this.maxValue)
        this.setData({
          curTimeVal: this.curTimeVal,
          duration: this.duration,
          maxValue: this.maxValue,
          curValue: this.curValue
        })
      })
    }
  }
})
