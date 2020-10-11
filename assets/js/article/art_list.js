$(function () {

    var layer = layui.layer
    var form = layui.form

    // 时间处理函数
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 补零
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    // 初始化文章列表
    initTable()
    // 获取文章列表数据
    function initTable() {
        $.ajax({
            type: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // console.log(res);
                var str = template('tpl_table', res)
                $('tbody').html(str)
                // 渲染分页
                rederPage(res.total)
            }
        })
    }

    // 初始化文章分类
    initCate()
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var str = template('tpl-cate', res)
                $('[name=cate_id]').html(str)
                // 分页渲染的方法
                form.render()
            }
        })
    }

    // 筛选
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        initTable()
    })

    // 分页
    var laypage = layui.laypage
    function rederPage(total) {
        // console.log(total);
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,//每页几条
            curr: q.pagenum,//第几页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 8, 10],
            //触发jump：分页初始化的时候，改变页码的时候,每页条数发生变化的时候
            // obj：所有参数所在的对象
            // first：是否是第一次初始化分页
            jump: function (obj, first) {
                // 把最新的页码值赋值给q
                q.pagenum = obj.curr
                // 把最新的条数赋值给q
                q.pagesize = obj.limit
                // 根据最新的q获取对应的数据列表，并渲染列表
                // 判断不是第一次初始化页码才能重新调用初始化文章列表
                if (!first) {
                    initTable()
                }
            }
        });

    }

    // 删除
    $('tbody').on('click', '#btn_delete', function () {
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'get',
                url: '/my/article/delete/' + id,
                data: {},
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    // 判断页面有几条数据，如果剩一条删除完后页数-1
                    if ($('#btn_delete').length == 1) {
                        // 判断还有几页
                        if (q.pagenum == 1) {
                            q.pagenum = 1
                        } else {
                            // 如果页数不等于1，页数-1
                            q.pagenum--
                        }
                    }
                    initTable()
                }
            })

            layer.close(index);
        });
    })

    // 修改

})