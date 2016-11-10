/**
 * require
 * @version 0.1.1
 * 
 * @description 异步加载外部js,可回调
 * @param {Object} setting 配置项
 * @param {Object=} setting.depends 依赖文件数组，可选
 * @param {String} setting.url  外部js地址
 * @param {Function=} setting.callback 回调函数，可选
 * @param {Boolean=} setting.defer  是否在DomContentLoaded之前运行，默认为false（注：如果depends具有强依赖性，请将defer设置为true）
 */
var require = function (setting) {
    require.Timer = null;
    var _this = this;
    // if(setting.url ==undefined) return;
    if (require.loaded.indexOf(setting.url) !== -1) return;
    // 加载依赖文件
    if (setting.depends) {
        require.dependsLoading = true;
        require.dLen = setting.depends.length;
        require.loadingDepends = setting.depends;//添加正在加载的依赖
        // require.queue = new List();
        // for (var i in setting.depends) {
        //     require.queue.add(setting.depends[i])
        // }
        // // require.queue.add(setting.url)
        // console.log(require.queue)
        // console.log(require.dLen)

        //解决异步加载js顺序问题 —— 方案1：Timeout
        require.Timer = setInterval(function () {
            if (require.dependsLoading === false) {
                require({ url: setting.url, callback: setting.callback })
                clearInterval(require.Timer)
            }
        }, 0)
        for (var d = 0; d < require.dLen; d++) {
            // this.i = setting.depends[d];
            // this.dependsLoading = true;
            // console.log(require.loadingDepends)
            require({
                url: setting.depends[d],
                callback: function () {
                    // console.log(require.dependsLoading)
                    // require.dependsLoading = true;
                    //if(require.i == setting.depends[require.len-1]){
                    require.loadingDepends.splice(require.loadingDepends.indexOf(this.url), 1)
                    if (require.loadingDepends.length == 0)
                    { require.dependsLoading = false; }
                    //}
                    // console.dir(require)

                }
            })
        }

        return;
        // require.loading = {};
        // require.loading.url = "";
        // require.loading.status = false;
        // do {
        //     if (require.loading.status === true) break;
        //     require.loading.url = require.queue[require.queue.current];
        //     require({
        //         url: require.queue[require.queue.current],
        //         callback: function () {
        //             // require.queue.shift();
        //             // require({
        //             //     url: require.queue[require.queue.next()]
        //             // })
        //             // if (require.queue.isLast()) return;

        //             require.queue.next()
        //             require.loading.url = require.queue[require.queue.current];
        //             require.loading.status = true;

        //         }
        //     })
        //     console.log(require.loading)
        // } while (require.queue.next() != false)
        // require.loading.url = "";
        // require.loading.status = false;
        // // return;
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
    //执行script
    document.head.appendChild(script);

}

require.loaded = []

// 迭代器List[iterator]
function List() {
    this.len = 0;
}
List.prototype = {
    add: function (x, ...rest) {
        if (!this.current) this.current = 0;
        var len = this.len || 0;
        rest.unshift(x);
        for (var num in rest) {
            this[parseInt(num) + len] = rest[num];
        };
        this.len = rest.length + len;
    },
    isLast: function () {
        return (this.current === this.len - 1)
    },
    next: function () {
        var cur = this.current;
        var len = this.len;
        if (typeof cur == "number") {
            if (cur < len - 1) { return ++this.current; }
            else { /*console.error("pointer overflow!");*/ return false; }
        }
        else {
            console.error("there is nothing!");
        }
    },
    previous: function () {
        var cur = this.current;
        var len = this.len;
        if (typeof cur == "number") {
            if (cur > 0) { return --this.current; }
            else { /*console.error("pointer overflow!");*/ return false; }
        }
        else {
            console.error("there is nothing!");
        }
    },
    toArray: function () {
        var arr = [];
        for (var x in this) {
            if (isNaN(x)) continue;
            arr[x] = this[x];
        }
        return arr;
    }
}