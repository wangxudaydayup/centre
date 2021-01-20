$(function () {
    // 验证登录状态
    $.ajax({
        method: 'GET',
        url: 'http://139.9.143.69:8001/users/info',
        headers: {
            uid: localStorage.getItem('uid')
        },
        complete: function (res) {
            // console.log(res.status);
            if (res.status === 401) {
                // 清空本地存储中的 uid
                localStorage.removeItem('uid')
                location.href = 'index.html'
            }
        },
    })
    // 通过 URLSearchParams 对象，获取 URL 传递过来的参数
    var params = new URLSearchParams(location.search)
    var centreId = params.get('id')
    // console.log(centreId);
    // 从 layui 中获取相应对象
    var form = layui.form
    var layer = layui.layer
    var upload = layui.upload

    $('#design').on('click', function () {
        console.log(1);
        location.href = '/edit.html'
    })

    // 上传作品部分
    $('body').on('change', '.layui-upload-file', function () {
        if (this.files.length !== 0) {
            var fd1 = new FormData()
            fd1.append('file', this.files[0])
            // 上传作品
            $.ajax({
                method: 'POST',
                url: 'http://139.9.143.69:8001/usercenter/upload',
                headers: {
                    uid: localStorage.getItem('uid')
                },
                processData: false, // 不处理数据
                contentType: false, // 不设置内容类型
                data: fd1,
                success: function (res) {
                    if (res.code === -1) {
                        return layer.msg('上传图片失败')
                    }
                    $('.pic').show().find('img').attr('src', res.data.url)

                    $('input[name=downloadurl]').val(res.data.url)
                    $('input[name=filetype]').val(res.data.filetype)
                    $('input[name=spec]').val(res.data.spec)
                    $('input[name=show_image]').val(res.data.url)
                    $('input[name=details_image]').val(res.data.url)
                }
            })
        }

        // $.each(filelist, function (i, e) {
        //     // console.log(e);
        //     var imgURL = URL.createObjectURL(e)
        //     // console.log(imgURL);
        //     $('#workArea').append(`<div class="pic"><img src="${imgURL}"><div id="bg"><button type="button" class="gradient">删除</button></div></div>`)
        // })
    })

    upload.render({
        elem: '#uploadArea',
        url: 'http://139.9.143.69:8001/usercenter/works/1',
        auto: false,
        // multiple: true,
        acceptMime: 'image/pjpeg,image/png,image/gif',
        // // bindAction: '#publish',
        // done: function (res) {
        //     //上传完毕
        //     layer.msg('上传成功');
        // }
    });

    // 鼠标经过图片事件
    $('#workArea').on('mouseenter mouseleave', '.pic', function () {
        $(this).find('#bg').stop().fadeToggle()
    }).on('click', '.pic button ', function () {
        $(this).parents('.pic').remove() // 删除图片
    })

    // 通过 form.verify() 函数自定义校验规则
    form.verify({
        // 自定义作品名称的校验规则
        production: [
            /^[\S]{1,20}$/, '作品名称最多输入20个字，且开头不能出现空格'
        ],
        max5: [
            /^[\s\S]{1,5}$/, '最多不能超过5个'
        ],
        // 标签必选验证规则
        req: function () {
            if (tagsArr1.length === 0) {
                return '请选择标签'
            }
        }
    })

    // 获取分类可选项
    $.ajax({
        type: 'GET',
        url: 'http://139.9.143.69:8001/materials/categorys/1',
        success: function (res) {
            // console.log(res.data[0].categoryList);
            if (res.code !== 0) {
                return layer.msg('获取分类数据失败！')
            }
            // 调用 template 函数
            var htmlStr = template('classifyTem', res.data[0])
            // console.log(htmlStr);
            // 渲染 HTML 结构
            $('.classify').html(htmlStr)
            // 通知 layui 重新渲染表单区域的UI结构
            form.render()
            // 去除 select 选项默认文字
            $('.layui-unselect').prop({
                'placeholder': '',
                'value': ''
            })
        }
    })

    // 监听 介绍 文本域字数变化
    function lenChange() {
        var len = $('#presentation textarea').val().length
        $('#wordsLength').html(len + '/' + $('#presentation textarea').prop('maxlength'))
    }
    $('#presentation textarea').on('input', lenChange())

    // 标签部分
    // 定义存放标签数组
    var tagsArr1 = []
    // 定义获取标签函数
    function getTags() {
        $.each($('.addTag span'), function (i, ele) {
            // console.log(i); 
            // console.log(ele.innerText);
            tagsArr1.push(ele.innerText)
            // console.log(tagsArr1);
        })
    }
    getTags()
    // 点击底部选择标签事件
    $('.tagList').on('click', 'li', function (e) {
        // 判断选择框是否有相同标签
        // console.log(tagsArr1);
        // console.log(tagsArr1.indexOf(e.target.innerText));
        if (tagsArr1.indexOf(e.target.innerText) !== -1) {
            layer.msg('标签已存在', {
                icon: 7
            });
        } else if (tagsArr1.length < 6) {
            // 将对应标签添加至标签框里
            $('.addTag button').before(`<span>${$(this).text()}<strong class="layui-icon layui-icon-close"></strong></span>`)
            tagsArr1.push(e.target.innerText)
            // console.log(tagsArr1);
        } else {
            layer.msg('最多可选择六个标签', {
                icon: 7
            });
        }
    })

    var indexAdd = null
    // 点击添加标签事件
    $('.addTag button').on('click', function () {
        if (tagsArr1.length < 6) {
            indexAdd = layer.open({
                type: 1,
                area: ['500px', '260px'],
                title: '添加标签',
                content: $('#dialog-add').html()
            })
            // 文本框聚焦
            let tag = $('input[name=tag]')
            tag.focus()
            // 确认添加
            $('#dialog-confirm').on('click', function (e) {
                let reg = /^\s+$/
                if (tagsArr1.indexOf(tag.val().trim()) !== -1) {
                    e.preventDefault()
                    layer.msg('标签已存在', {
                        icon: 7
                    });
                } else if (tag.val().trim() && tag.val().length < 6) {
                    $('.addTag button').before(`<span>${tag.val().trim()}<strong class="layui-icon layui-icon-close"></strong></span>`)
                    e.preventDefault()
                    tagsArr1.push(tag.val().trim())
                    // 根据索引关闭对应的弹出层
                    layer.close(indexAdd)
                } else if (reg.test(tag.val())) {
                    tag.val('')
                }
            })
            // 取消添加
            $('#dialog-cancel').on('click', function () {
                layer.close(indexAdd)
            })
        } else {
            layer.msg('最多可选择六个标签', {
                icon: 7
            });
        }
    })

    // 点击关闭按钮 X 事件
    $('.addTag').on('click', 'strong', function () {
        // 从添加标签框里移除当前标签
        $(this).parent().remove()
        // 同时从数组中移除
        tagsArr1.splice(tagsArr1.indexOf($(this).innerText))
        // console.log(tagsArr1);
    })

    // 定义发布状态
    var draft = 0

    // 为存为保存按钮绑定点击事件
    $('#save').on('click', function () {
        draft = 1
    })

    // 监听到Ajax请求被发起了
    $(document).ajaxStart(function () {
        // $('#loading').show()
        NProgress.start()
    })

    // 监听到 Ajax 完成的事件
    $(document).ajaxStop(function () {
        // $('#loading').hide()
        NProgress.done()
    })

    // 登录
    // $.ajax({
    //     method: 'POST',
    //     url: 'http://139.9.143.69:8001/oauth/login',
    //     data: {
    //         phone: 15886611969,
    //         password: 123456
    //     },
    //     success: function (res) {
    //         localStorage.setItem('uid', res.data)
    //     }
    // })

    // 获取作品信息
    $.ajax({
        method: 'GET',
        url: 'http://139.9.143.69:8001/usercenter/works/' + centreId,
        headers: {
            uid: localStorage.getItem('uid')
        },
        success: function (res) {
            console.log(res);
            if (res.code === -1) {
                return layer.msg('获取作品信息失败')
            }
            form.val('formDemo', res.data)

            $('.pic').show().find('img').prop('src', res.data.show_image)

            lenChange()

            // 渲染标签
            var tagsArr = res.data.tags.split(',')
            $.each(tagsArr, function (i, e) {
                $('.addTag button').before(`<span>${e}<strong class="layui-icon layui-icon-close"></strong></span>`)
            })
            getTags()

            $('.pic img').after(`<input type="hidden" name="downloadurl" value="${res.data.downloadurl}">
            <input type="hidden" name="filetype" value="${res.data.filetype}">
            <input type="hidden" name="spec" value="${res.data.spec}">
            <input type="hidden" name="show_image" value="${res.data.show_image}">
            <input type="hidden" name="details_image" value="${res.data.details_image}">`)
        }
    })

    // 提交表单事件
    form.on('submit(formDemo)', function (e) {
        layer.confirm('是否确认当前操作?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            var fd = new FormData($('#uploadList')[0])
            fd.append('category1_id', 1)
            fd.append('tags', tagsArr1.toString())
            fd.append('draft', draft)

            var jsonData = {};
            fd.forEach((value, key) => jsonData[key] = value);
            console.log(jsonData);
            $.ajax({
                method: 'PUT',
                url: 'http://139.9.143.69:8001/usercenter/works/' + centreId,
                headers: {
                    uid: localStorage.getItem('uid')
                },
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(jsonData),
                success: function (res) {
                    console.log(res);
                    if (res.code === -1) {
                        return layer.msg('发布失败')
                    }
                    location.href = 'centre.html'
                }
            })
            layer.close(index);
        });
        return false; //阻止表单跳转
    });
})