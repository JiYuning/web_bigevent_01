$(function () {

    getAticleCate()
    // 获取文章分类的列表
    function getAticleCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                var htmlStr = template("tpl_table", res)
                $('tbody').html(htmlStr)
            }
        })
    }

    var layer = layui.layer
    // 给添加类别按钮添加点击事件
    $('#addCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dislog_add').html()
        })
    })

    // 添加文章分类添加事件委托
    var indexAdd = null
    $('body').on('submit', "#form_add", function (e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                getAticleCate()
                layer.msg('恭喜你，文章类别添加成功！')
                layer.close(indexAdd)
            }
        })
    })
    // 修改
    var indexEdit = null
    var form = layui.form
    $('tbody').on('click', ".btn-edit", function () {
        indexEdit = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dislog_edit').html()
        })
        var id = $(this).attr('data-id')
        console.log(id);
        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                console.log(res.data);
                form.val('form-edit', res.data)
            }
        })
    })

    $('body').on('submit', "#form_edit", function (e) {
        e.preventDefault()
        $.ajax({
            type: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                getAticleCate()
                layer.msg("恭喜你，文章类别更新成功！")
                layer.close(indexEdit)
            }
        })
    })

    $('tbody').on('click', '.btn-delet', function () {
        var id = $(this).attr('data-id')
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除成功！')
                    layer.close(index)
                    getAticleCate()
                }
            })
        });
    })
})