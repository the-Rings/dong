// 接收到拦截的HTTP Response
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  let result = request.data;
  let time = request.time;

  if (result.length > 0) {
    let temp = '';
    result.forEach(function (r) {
      temp = temp + '\n' + r;
    });
    console.log('----------------------------------')
    console.log(temp);
    console.log(time);
    console.log('----------------------------------')
  }
  return true;
});
