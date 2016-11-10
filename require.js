/**
 * require
 * 
 * @description 异步加载外部js,可回调
 * @param {String} url  外部js地址
 * @param {Function=} callback 回调函数，可选
 * @param {Boolean} async  是否异步加载，默认为false
 */
function require(url, callback, async) {
    var script = document.createElement("script");
    script.src = "js/" + url + ".js";
    if (typeof callback === "boolean") async = callback;
    if (async == true) script.async = "async";
document.head.appendChild(script);
    if (script.readyState) { //IE 
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" ||
                script.readyState == "complete") {
                script.onreadystatechange = null;
                console.log(url + " has loaded");
                if (typeof callback === "function") {
                    callback();
                }
            }
        };
    } else { //Others 
        script.onload = function () {
            console.log(url + " has loaded");
            if (typeof callback === "function") {
                callback();
            }
        };
    }

    
}