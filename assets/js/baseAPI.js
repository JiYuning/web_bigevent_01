
// 发出ajax之前会触发ajaxPrefilter方法
// 可以通过options配置ajax各种参数

$.ajaxPrefilter(function (options) {
    // alert(options.url);
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    // alert(options.url)

    // 对需要权限的接口配置头信息
    // 必须以my开头才行
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ""
        }
    }
    // 登录拦截
    // 成功或者失败都会触发complete方法
    options.complete = function (res) {
        var obj = res.responseJSON
        if (obj.status === 1 && obj.message === '身份认证失败！') {
            // 清空本地token
            localStorage.removeItem('token')
            // 页面跳转
            location.href = '/login.html'
        }
    }
})