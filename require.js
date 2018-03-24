/**
 * require
 * @author Heekei
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
        // 标记依赖文件正在加载
        require[setting.url].dependsLoading = true;

        // 检查依赖文件是否已经加载过
        for (var x in setting.depends) {
            if (require.loaded.indexOf(setting.depends[x]) !== -1) {
                setting.depends.splice(x, 1)
            }
        }

        // 记录正在加载的依赖到数组【加载中的依赖】
        require[setting.url].loadingDepends = setting.depends;

        // 设置主JS的依赖文件的长度
        require[setting.url].dLen = setting.depends.length;

        // 定时检查依赖是否加载完毕
        require[setting.url].Timer = setInterval(function () {
            if (require[setting.url].dependsLoading === false) { // 依赖文件加载完毕
                // 加载主JS
                require({
                    url: setting.url,
                    callback: setting.callback
                })
                clearInterval(require[setting.url].Timer) // 清除定时器
            }
        }, 0)

        // 循环加载依赖文件
        for (var d = 0; d < require[setting.url].dLen; d++) {
            require({
                url: setting.depends[d],
                callback: function () {
                    // 加载完成后，将该依赖文件从【加载中的依赖】数组中删除
                    require[setting.url].loadingDepends.splice(require[setting.url].loadingDepends.indexOf(this.url), 1)

                    // 如果【加载中的依赖】为空，将“依赖加载中”的状态标记为false
                    if (require[setting.url].loadingDepends.length == 0) require[setting.url].dependsLoading = false;
                }
            })

        }

        // 退出函数，保证主JS在加载依赖文件的过程中不进行加载
        return;
    }

    var script = document.createElement("script"); // 加载JS文件

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

    if (setting.defer) {
        script.defer = "defer";
    }
    require.loaded.push(setting.url);
    document.head.appendChild(script);
}
require.loaded = []
