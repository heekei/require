/**
 * require
 * 
 * @version 0.2.0
 * 
 * @description 异步加载外部js,可回调
 * @param {Object} setting 配置项
 * @param {Object=} setting.depends 依赖文件数组，可选
 * @param {String} setting.url  外部js地址
 * @param {Function=} setting.callback 回调函数，可选
 * @param {Boolean=} setting.defer  是否在DomContentLoaded之前运行，默认为false（注：如果depends具有强依赖性，请将defer设置为true）
 */
var require = function (setting) {
    var _this = this;
    if (require.loaded.indexOf(setting.url) !== -1) return;
    require[setting.url] = {};
    require[setting.url].Timer = null;
    // 加载依赖文件
    if (setting.depends) {
        require[setting.url].dependsLoading = true;
        
        for(var x in setting.depends){
            if(require.loaded.indexOf(setting.depends[x]) !== -1){
                setting.depends.splice(x,1)
            }
        }
        console.log(setting.depends)
        require[setting.url].loadingDepends = setting.depends;//添加正在加载的依赖
        require[setting.url].dLen = setting.depends.length;
        require[setting.url].Timer = setInterval(function () {
            if (require[setting.url].dependsLoading === false) {
                require({ url: setting.url, callback: setting.callback })
                clearInterval(require[setting.url].Timer)
            }
        }, 0)
        for (var d = 0; d < require[setting.url].dLen; d++) {
            require({
                url: setting.depends[d],
                callback: function () {
                    require[setting.url].loadingDepends.splice(require[setting.url].loadingDepends.indexOf(this.url), 1)
                    if (require[setting.url].loadingDepends.length == 0)
                    { require[setting.url].dependsLoading = false; }
                }
            })

        }
        return;
    }
    var script = document.createElement("script");
    // 触发回调
    if (script.readyState) { //IE 
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" ||
                script.readyState == "complete") {
                script.onreadystatechange = null;
                console.log(setting.url + " has loaded");
                isLoaded = true;
                if (typeof setting.callback === "function") {
                    setting.callback();
                }
            }
        };
    } else { //Others 
        script.onload = function () {
            console.log(setting.url + " has loaded");
            if (typeof setting.callback === "function") {
                setting.callback();
            }
        };
    }
    script.src = setting.url + "?" + Math.random();
    if (setting.defer) { script.defer = "defer"; }
    require.loaded.push(setting.url);
    document.head.appendChild(script);
}
require.loaded = []