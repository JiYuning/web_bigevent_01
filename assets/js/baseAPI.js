
// 发出ajax之前会触发ajaxPrefilter方法
// 可以通过options配置ajax各种参数

$.ajaxPrefilter(function (options) {
    // alert(options.url);
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    // alert(options.url)
})