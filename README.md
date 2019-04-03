# miniprogram-custom-component

多列音频播放组件：

* 支持 less 编写 wxss
* 使用 webpack 构建 js
* 支持自定义组件单元测试
* 支持 eslint
* 支持多入口构建

## 传参

```
audioList: {
  type: Array,
  value: [
    {
      asrc: 'http://m10.music.126.net/20190330104904/bc7b35f16da6374e81bbdf507a423440/ymusic/fa90/df9c/59f7/95c4a2802e0b9191ae1a048f127e53c5.mp3'
    },
    {
      asrc: 'http://m10.music.126.net/20190328140202/13d2b669a01d87295490f617b8b0e86f/ymusic/4d92/739d/6c66/0c9aff0de4d9a4de19f1d4d5f5129db0.mp3'
    }
  ]
},

// 另： activeColor blockColor buttonColor paddingValue 等
```

## 当需要使用多个音频列表时,你需要做如下几点

* 1.请在app.js中加入如下内容

```
App({
  globalData: {// 全局变量
    playId: ''
  },
  /** 监听函数的对象数组 */
  watchCallBack: {},

  /** 监听列表 */
  watchingKeys: [],

  /** 初始化 */
  init() {
    // 全局数据
    this.globalData$ = Object.assign({}, this.globalData)
  },

  /** 设置全局数据 */
  setGlobalData(obj) {
    // eslint-disable-next-line array-callback-return
    Object.keys(obj).map(key => {
      this.globalData[key] = obj[key]
    })
  },

  /** watch函数 */
  watch$(key, cb) {
    this.watchCallBack = Object.assign({}, this.watchCallBack, {
      [key]: this.watchCallBack[key] || []
    })
    this.watchCallBack[key].push(cb)
    if (!this.watchingKeys.find(x => x === key)) {
      const that = this
      this.watchingKeys.push(key)
      let val = this.globalData[key]
      Object.defineProperty(this.globalData, key, {
        configurable: true,
        enumerable: true,
        set(value) {
          const old = that.globalData[key]
          val = value
          that.watchCallBack[key].map(func => func(val, old))
        },
        get() {
          return val
        }
      })
    }
  }
})
```
* 2.使用组件时请为没一个组件添加唯一的参数：audioId

```
<view >队列1</view>
<comp audioId="P1" audioList="{{audioList_1}}"></comp>
<view >队列2</view>
<comp audioId="P2" audioList="{{audioList_2}}"></comp>
```

## 删除
* 默认没有删除按钮，需要删除按钮时请传入参数**delete**,可以监听到删除事件

```
<compunent delete bind:deleteAudio="onDelete">
```

* 删除事件源码，供参考

```
const EventDetail = {
  'audioId': audioId,
  'id': id
}
this.triggerEvent('deleteAudio', EventDetail)
```

## 使用

* 使用[命令行工具](https://github.com/wechat-miniprogram/miniprogram-cli)进行初始化
* 直接从 github 上 clone 下来

## 开发

1. 安装依赖：

```
npm install
```

2. 执行命令：

```
npm run dev （开发环境）
```
npm run build （生产环境环境）

默认会在包根目录下生成 miniprogram\_dev 目录，src 中的源代码会被构建并生成到 miniprogram\_dev/components 目录下。如果需要监听文件变化动态构建，则可以执行命令：

```
npm run watch
```

> ps: 如果 minirpogram\_dev 目录下已存在小程序 demo，执行`npm run dev`则不会再将 tools 下的 demo 拷贝到此目录下。而执行`npm run watch`则会监听 tools 目录下的 demo 变动并进行拷贝。

3. 生成的 miniprogram\_dev 目录是一个小程序项目目录，以此目录作为小程序项目目录在开发者工具中打开即可查看自定义组件被使用的效果。

4. 进阶：

* 如果有额外的构建需求，可自行修改 tools 目录中的构建脚本。
* 内置支持 less、sourcemap 等功能，默认关闭。如若需要可以自行修改 tools/config.js 配置文件中相关配置。
* 内置支持多入口构建，如若需要可自行调整 tools/config.js 配置文件的 entry 字段。
* 默认开启 eslint，可自行调整规则或在 tools/config.js 中注释掉 eslint-loader 行来关闭此功能。

## 发布

> ps: 发布前得确保已经执行构建，小程序 npm 包只有构建出来的目录是真正被使用到的。

1. 如果还没有 npm 帐号，可以到[ npm 官网](https://www.npmjs.com/)注册一个 npm 帐号。
2. 在本地登录 npm 帐号，在本地执行：

```
npm adduser
```

或者

```
npm login
```

3. 在已完成编写的 npm 包根目录下执行：

```
npm publish
```

到此，npm 包就成功发布到 npm 平台了。

> PS：一些开发者在开发过程中可能修改过 npm 的源，所以当进行登录或发布时需要注意要将源切回 npm 的源。

## 目录结构

以下为推荐使用的目录结构，如果有必要开发者也可以自行做一些调整:

```
|--miniprogram_dev // 开发环境构建目录
|--miniprogram_dist // 生产环境构建目录
|--src // 源码
|   |--components // 通用自定义组件
|   |--images // 图片资源
|   |
|   |--xxx.js/xxx.wxml/xxx.json/xxx.wxss // 暴露的 js 模块/自定义组件入口文件
|
|--test // 测试用例
|--tools // 构建相关代码
|   |--demo // demo 小程序目录，开发环境下会被拷贝生成到 miniprogram_dev 目录中
|   |--config.js // 构建相关配置文件
|
|--gulpfile.js
```

> PS：对外暴露的 js 模块/自定义组件请放在 src 目录下，不宜放置在过深的目录。另外新增的暴露模块需要在 tools/config.js 的 entry 字段中补充，不然不会进行构建。

## 测试

* 执行测试用例：

```
npm run test
```

* 检测覆盖率：

```
npm run coverage
```

测试用例放在 test 目录下，使用 **miniprogram-simulate** 工具集进行测试，[点击此处查看](https://github.com/wechat-miniprogram/miniprogram-simulate/blob/master/README.md)使用方法。在测试中可能需要变更或调整工具集中的一些方法，可在 test/utils 下自行实现。

## 其他命令

* 清空 miniprogram_dist 目录：

```
npm run clean
```

* 清空 miniprogam_dev 目录：

```
npm run clean-dev
```
