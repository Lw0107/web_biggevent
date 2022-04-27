$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initArt();
    // 获取文章分类的列表
    function initArt() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr)
            }
        })
    }
    // 为添加类别按钮添加点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            title: '添加文章',
            type: 1,
            area: ['500px', '250px'],
            content: $('#dialog-add').html()
        })
    })


    // 通过代理的形式，为form-add 表单 绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加分类失败')
                }
                initArt();
                layer.msg('新增分类成功')
                //    根据索引关闭弹出层
                layer.close(indexAdd);
            }
        })
    })
    // 通过代理的形式，为btn-edit按钮  绑定submit事件
    var indexEdit = null;
    $('tbody').on('click', '#btn-edit', function () {
        //  弹出一个修改信息的层
        indexEdit = layer.open({
            title: '修改文章',
            type: 1,
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-id')
        // 发起请求，获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })

    //  通过代理的形式，修改分类的表单表单submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            // serialize 快速拿到表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败')
                }
                layer.msg('更新分类数据成功')
                //    根据索引关闭弹出层
                layer.close(indexEdit);
                initArt();
            }
        })
    })
    //  通过代理的形式，删除按钮绑定submit事件
    $('body').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        //提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                // serialize 快速拿到表单中的数据
                success:function(res){
                    if(res.status !== 0){
                        return layer.msg('删除失败');
                    }
                    layer.msg('删除分类成功');
                    layer.close(index);
                    initArt();
                }
            })
        })
    })

})