$(function () {
    // 显示隐藏切换
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 自定义验证规则
    var form = layui.form
    var layer = layui.layer
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,16}$/,
            "密码必须6-16位，且不能输入空格"
        ],
        // 校验两次密码是否一致
        repwd: function (value) {
            // value是确认密码的内容 
            var pwd = $('.reg-box [name=password]').val()
            // 比较
            if (pwd !== value) {
                return "两次密码输入不一致"
            }
        }
    })

    // 注册功能 
    $("#form_reg").on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/api/reguser',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('恭喜您注册成功！')
                $('#link_login').click()
                $("#form_reg .layui-input").val('')
            }
        })
    })

    // 登录功能 
    $("#form_login").on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('恭喜您登录成功！')
                //保存token
                localStorage.setItem('token', res.token)
                //跳转
                location.href = '/index.html'
            }
        })
    })

})