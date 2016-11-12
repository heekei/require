# require
 * @version 0.2.0
 * @description 异步加载外部js,可回调
 * @param {Object} setting 配置项
 * @param {Object=} setting.depends 依赖文件数组，可选
 * @param {String} setting.url  外部js地址
 * @param {Function=} setting.callback 回调函数，可选
 * @param {Boolean=} setting.defer  是否在DomContentLoaded之前运行，默认为false（注：如果depends具有强依赖性，请将defer设置为true）
 
 ## 用法
 ```javascript
  require({
    depends:[],
    url:"",
    callback:function(){},
    defer:false
  })
 ```
