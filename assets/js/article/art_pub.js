$(function () {
    var layer = layui.layer
    var form = layui.form

    initCate()

    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            data: {},
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var str = template('tpl_cate', res)
                $('[name=cate_id]').html(str)
                form.render()
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 300 / 300,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 选择封面按钮
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 
    $('#coverFile').on('change', function (e) {
        // 拿到用户选择的文件
        var file = e.target.files[0]
        // 非空校验
        if (file === 0) {
            return layer.msg('请选择封面！')
        }
        //根据选择的文件，创建对应的URL地址
        var imgURL = URL.createObjectURL(file)
        // 先销毁选择的文件，再重新设置图片路径，之后在创建新的裁剪区域
        $image.cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 设置状态
    var state = '已发布'

    $('btnSave2').on('click', function () {
        state = '草稿'
    })

    // 添加文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 创建FormData
        var fd = new FormData($(this)[0])
        // 添加状态
        fd.append('state', state)
        // 添加图片
        $image.cropper('getCroppedCanvas', {//创建一个Canvas画布
            width: 400,
            height: 300
        })
            // 将Canvas画布上的内容，转化为文件对象
            .toBlob(function (blob) {
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                // 发送ajax请求要在toblob函数里面
                // console.log(...fd);
                publishArticle(fd)
            })
    })
    function publishArticle(fd) {
        $.ajax({
            type: 'post',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                setTimeout(function () {
                    window.parent.document.querySelector('#art_list').click()
                }, 1000)
            }
        })
    }



})