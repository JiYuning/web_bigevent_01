$(function () {
    var form = layui.form
    // 定义校验规则
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度为1~6位之间"
            }
        }
    })
    // 初始化用户信息
    initUserInfo()
    // 初始化用户信息封装，后面还要用
    function initUserInfo() {
        $.ajax({
            data: 'git',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                // console.log(res);
                // 调用form.val快速为表单赋值
                form.val('formUserInfo', res.data)
            }

        })
    }

    // 重置表单
    $('#btnReset').on('click', function (e) {
        e.preventDefault()//阻止重置
        initUserInfo()//重新渲染用户信息
    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
                window.parent.getUserInfo()
            }
        })
    })
})