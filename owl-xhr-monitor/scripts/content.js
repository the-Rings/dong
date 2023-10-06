let targetUrl = 'https://api.youshu.youcloud.com/graphql';
let targetOrigin = 'https://console.youshu.youcloud.com';
let requestUrl = 'http://127.0.0.1:5000'

// content_script与inject_script的消息通知通过postMessage进行
// 监听inject_script发出的消息
window.addEventListener("message", (e) => {
    if (!e.data || Object.keys(e.data).length === 0) {
        return;
    }
    // 检查收到的message是否是要监听的
    if (!targetOrigin
        || e.origin.indexOf(targetOrigin) === -1
        || !targetUrl
        || !e.data.url
        || e.data.url.indexOf(targetUrl) === -1
    ) {
        return;
    }

    let response = null;
    // 使用try-catch兼容接收到的message格式不是对象的异常情况
    try {
        response = JSON.parse(e.data.response);
        let result = handleResponse(response);
        if (result.length > 0) {
            let time = timeFileName();
            let requestParam = { data: result, time: time };
            // 发消息给background.js，并接收其回复
            chrome.runtime.sendMessage(requestParam, {}, function (res) {
                // 回调函数
                // do something ...
            });
            $.ajax({
                url: requestUrl,
                type: 'POST',
                contentType: "application/json",
                data: JSON.stringify(requestParam),
                success: (msg) => {
                    console.log(msg);
                },
                error: (xhr, errorType, error) => {
                }
            });
        }
    } catch (e) {
        alert('content.js 获取的数据有误，请联系管理员！');
    }

}, false);

function handleResponse(response) {
    let products = [];
    if (response.data.hasOwnProperty('productRealTimeList') && response.data.productRealTimeList.data.length > 0) {
        products = response.data.productRealTimeList.data;
    }
    if (response.data.hasOwnProperty('productList') && response.data.productList.data.length > 0) {
        products = response.data.productList.data;
    }
    if (products.length == 0) {
        return true;
    }

    let goto = 'goto=';
    let result = [];
    products.forEach(function (p) {
        let wholeUrl = p.product.url;
        let startIndex = wholeUrl.indexOf(goto);
        if (startIndex >= 0) {
            let encodedUrl = wholeUrl.substring(startIndex + 5); // 截取字符串
            let decodedUrl = decodeURIComponent(encodedUrl); // 解码URL  
            result.push(decodedUrl);
        }
    });
    return result;
}

function timeFileName() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}
