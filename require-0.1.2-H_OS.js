/**
 * require
 * 
 * @version 0.1.2-H_OS
 * 
 * @description 异步加载外部js,可回调
 * @param {Object} setting 配置项
 * @param {Object=} setting.depends 依赖文件数组，可选
 * @param {String} setting.url  外部js地址
 * @param {Function=} setting.callback 回调函数，可选
 * @param {Boolean=} setting.defer  是否在DomContentLoaded之前运行，默认为false（注：如果depends具有强依赖性，请将defer设置为true） 
 */
function require(setting) {
    require.Timer = null;
    if(setting.url.indexOf(".js")==-1) setting.url= setting.url+".js"
    var _this = this;
    // if(setting.url ==undefined) return;
    if (require.loaded.indexOf(setting.url) !== -1) return;
    // 加载依赖文件
    if (setting.depends) {
        require.dependsLoading = true;
        require.dLen = setting.depends.length;
        require.loadingDepends = setting.depends;//添加正在加载的依赖
        require.Timer = setInterval(function () {
            if (require.dependsLoading === false) {
                require({ url: setting.url, callback: setting.callback })
                clearInterval(require.Timer)
            }
        }, 0)
        for (var d = 0; d < require.dLen; d++) {
            require({
                url: setting.depends[d],
                callback: function () {
                    require.loadingDepends.splice(require.loadingDepends.indexOf(this.url), 1)
                    if (require.loadingDepends.length == 0)
                    { require.dependsLoading = false; }
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
                console.log(setting.url + "——loaded");
                isLoaded = true;
                if (typeof setting.callback === "function") {
                    setting.callback();
                }
            }
        };
    } else { //Others 
        script.onload = function () {
            console.log(setting.url + "——loaded");
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