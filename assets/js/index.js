$(function () {
    // 获取用户信息
    getUserInfo()

    // 退出
    var layer = layui.layer
    $('#btnLogout').on('click', function () {
        // 框架提供的询问框
        layer.confirm('确定退出?', { icon: 3, title: '提示' }, function (index) {
            // 清空本地token
            localStorage.removeItem('token')
            // 页面跳转
            location.href = '/login.html'
            // 关闭弹框
            layer.close(index);
        });
    })

})

// 获取用户信息（封装到入口函数的外面）
// 原因：后面其他的页面要调用
function getUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // 重新登录，因为token会过期
        // headers: {
        //     Authorization: localStorage.getItem('token') || ""
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('res.massage')
            }
            // 请求成功，渲染用户头像
            renderAvatar(res.data)
        },
        // 成功或者失败都会触发complete方法
        /*  complete: function (res) {
             if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                 // 清空本地token
                 localStorage.removeItem('token')
                 // 页面跳转
                 location.href = '/login.html'
             }
         } */
    })
}

// 封装用户头像渲染函数
function renderAvatar(user) {
    // 获取用户名
    var name = user.nickname || user.username
    // 渲染用户名
    $('#welcome').html("欢迎&nbsp;&nbsp;" + name)
    // 用户头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').show().attr('src', user.user_pic)
        $('.user-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.user-avatar').show().html(first)

    }
}