// /* eslint-disable quotes */
const innerAudioContext = wx.createInnerAudioContext()
// eslint-disable-next-line no-undef
const app = getApp()
const globalData = app.globalData

let timer = null
Component({
  properties: {
    audioId: {
      type: String,
      value: ''
    },
    audioList: {
      type: Array,
      value: []
    },
    activeColor: {
      type: String,
      value: '#3d92e1'
    },
    blockColor: {
      type: String,
      value: '#3d92e1'
    },
    buttonColor: {
      type: String,
      value: '#3d92e1'
    },
    paddingValue: {
      type: String,
      value: '26rpx 0 26rpx'
    },
    amount: {
      type: Number,
      value: 1
    }
  },
  data: {

  },
  attached() {
  },
  lifetimes: {
    attached() {
      app.watch$('playId', (val, old) => {
        console.log('watched')
        const audioId = this.data.audioId
        const audioList = this.data.audioList
        if (old !== val) {
          if (val !== audioId) {
            for (let i = 0; i < audioList.length; i++) {
              const isPlaying = `audioList[${i}].isPlaying`
              const curTimeVal = `audioList[${i}].curTimeVal`
              const curValue = `audioList[${i}].curValue`
              const seekStemp = `audioList[${i}].seekStemp`
              this.setData({
                [isPlaying]: false,
                [curTimeVal]: '00:00',
                [curValue]: 0,
                [seekStemp]: 0
              })
            }
          }
        }
      })
    }
  },
  ready() {
    this.resetTime()
  },
  methods: {
    play(event) {
      const id = event.target.id
      const src = this.data.audioList[id].asrc
      let isPlaying = this.data.audioList[id].isPlaying
      this.stopOther(id)
      app.setGlobalData({
        playId: this.data.audioId
      })
      console.log(globalData)
      innerAudioContext.autoplay = false
      innerAudioContext.src = src
      console.log('audio play!!!')
      isPlaying = `audioList[${id}].isPlaying`
      innerAudioContext.play()
      // 监听播放器事件
      this.onPlayer(id)
      this.setData({
        [isPlaying]: true
      })
      if (timer) {
        clearInterval(timer)
      }
      timer = setInterval(() => {
        const next = this.data.audioList[id].seekStemp + 1
        const val = this.timeFormat(next)
        if (next >= this.data.audioList[id].maxValue) {
          clearInterval(timer)
        }
        const seekStemp = `audioList[${id}].seekStemp`
        const curValue = `audioList[${id}].curValue`
        const curTimeVal = `audioList[${id}].curTimeVal`

        this.setData({
          [seekStemp]: next,
          [curValue]: next,
          [curTimeVal]: val
        })
      }, 1000)
    },
    pause(event) {
      const id = event.target.id
      const isPlaying = `audioList[${id}].isPlaying`
      clearInterval(timer)
      innerAudioContext.pause()
      this.setData({
        [isPlaying]: false
      })
    },
    stop(event) {
      const id = event.target.id
      const isPlaying = `audioList[${id}].isPlaying`
      clearInterval(timer)
      console.log('audio stop!!!')
      innerAudioContext.stop()
      innerAudioContext.offPlay()
      this.setData({
        [isPlaying]: false
      })
    },
    bindchanging() {
      // innerAudioContext.offSeeking()
    },
    bindchange(e) {
      const id = e.target.id
      const stemp = e.detail.value
      const seekStemp = `audioList[${id}].seekStemp`

      this.setData({
        [seekStemp]: stemp
      })
      this.toSeek(stemp, id)
    },
    toSeek(stemp) {
      innerAudioContext.seek(stemp)
      // const isPlaying = `audioList[${id}].isPlaying`
      // this.setData({
      //   [isPlaying]: true
      // })
    },
    timeFormat(time) {
      let min = (time / 60).toFixed(0)
      let sec = (time % 60).toFixed(0)

      if (min < 10) min = '0' + min
      if (sec < 10) sec = '0' + sec
      return min + ':' + sec
    },
    onPlayer(id) {
      const isPlaying = `audioList[${id}].isPlaying`
      const curValue = `audioList[${id}].curValue`
      const curTimeVal = `audioList[${id}].curTimeVal`
      const seekStemp = `audioList[${id}].seekStemp`
      // 监听播放时间
      innerAudioContext.onPlay(() => {
        console.log('playing')
        this.onTimeUpdate(id)
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
      // innerAudioContext.onSeeked(() => {
      //   this.setData({
      //     [isPlaying]: true
      //   })
      // })
      // 监听播放器播放结束
      innerAudioContext.onEnded(() => {
        clearInterval(timer)
        this.setData({
          [isPlaying]: false,
          [curTimeVal]: '00:00',
          [curValue]: 0,
          [seekStemp]: 0
        })
      })
      innerAudioContext.onStop(() => {
        clearInterval(timer)
        this.setData({
          [isPlaying]: false,
          [curTimeVal]: '00:00',
          [curValue]: 0,
          [seekStemp]: 0
        })
      })
    },
    onTimeUpdate(id) {
      innerAudioContext.onTimeUpdate(() => {
        // 小程序原生音频的BUG，跳转播放之后失去监听
        // this.curValue = this.data.seekStemp
        // this.curTimeVal = this.timeFormat(this.data.seekStemp)
        /*
        this.curValue = innerAudioContext.currentTime
        this.curTimeVal = parseInt(this.curValue, 10)
        this.curTimeVal = this.timeFormat(this.curTimeVal)
        */
        this.data.audioList[id].maxValue = innerAudioContext.duration
        this.data.audioList[id].duration = this.timeFormat(this.data.audioList[id].maxValue)
        const duration = `audioList[${id}].duration`
        const maxValue = `audioList[${id}].maxValue`
        this.setData({
          // curTimeVal: this.curTimeVal,
          [duration]: this.data.audioList[id].duration,
          [maxValue]: this.data.audioList[id].maxValue
        })
      })
    },
    resetTime() {
      for (let i = 0; i < this.data.audioList.length; i++) {
        const isPlaying = `audioList[${i}].isPlaying`
        const curTimeVal = `audioList[${i}].curTimeVal`
        const duration = `audioList[${i}].duration`
        const curValue = `audioList[${i}].curValue`
        const maxValue = `audioList[${i}].maxValue`
        const seekStemp = `audioList[${i}].seekStemp`
        this.setData({
          [isPlaying]: false,
          [curTimeVal]: '00:00',
          [duration]: '00:00',
          [curValue]: 0,
          [maxValue]: 0,
          [seekStemp]: 0
        })
      }
    },
    stopOther(id) {
      for (let i = 0; i < this.data.audioList.length; i++) {
        if (i !== parseInt(id, 10)) {
          const isPlaying = `audioList[${i}].isPlaying`
          const curTimeVal = `audioList[${i}].curTimeVal`
          const curValue = `audioList[${i}].curValue`
          const seekStemp = `audioList[${i}].seekStemp`
          this.setData({
            [isPlaying]: false,
            [curTimeVal]: '00:00',
            [curValue]: 0,
            [seekStemp]: 0
          })
        }
      }
    }
  }
})
