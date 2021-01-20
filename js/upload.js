$(function() {
    // 验证登录状态
    $.ajax({
            method: 'GET',
            url: 'http://139.9.143.69:8001/users/info',
            headers: {
                uid: localStorage.getItem('uid')
            },
            complete: function(res) {
                // console.log(res.status);
                if (res.status === 401) {
                    // 清空本地存储中的 uid
                    localStorage.removeItem('uid')
                    location.href = 'index.html'
                }
            },
        })
        // 从 layui 中获取相应对象
    var form = layui.form
    var layer = layui.layer

    // 跳转至摄影上传页面
    $('#photography').on('click', function() {
        location.href = 'upload2.html'
    })

    // 通过 form.verify() 函数自定义校验规则
    form.verify({
        // 作品名称的校验规则
        production: [
            /^[\S]{1,20}$/, '作品名称最多输入20个字，且开头不能出现空格'
        ],
        // 自定义源文件尺寸的校验规则
        size: [
            /^[\S]{1,6}$/, '请输入1~6位数字，且不能出现空格'
        ],
        max5: [
            /^[\s\S]{1,5}$/, '最多不能超过5个'
        ],
        // 标签必选验证规则
        req: function() {
            if (tagsArr1.length === 0) {
                return '请选择标签'
            }
        }
    })

    // 获取分类可选项
    $.ajax({
        type: 'GET',
        url: 'http://139.9.143.69:8001/materials/categorys/2',
        success: function(res) {
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

    // 上传附件点击事件
    $('.accessory button').on('click', function() {
        // 模拟点击隐藏 input[type='file']
        $('#fileCover').click().on('change', function() { // 监听 input[type='file'] 的 change 事件
            var filePath = $(this).val();
            // console.log(filePath);
            var arr = filePath.split('\\'); // 以 \ 分割字符串，前面加 \ 转义
            // console.log(arr);
            var fileName = arr[arr.length - 1]; // 获取文件名
            if (filePath) { // 如果选择了文件，则将文件名渲染至页面相应位置
                $('.accessory span').html(fileName)
            }
        })
    })

    // 监听单选框事件
    form.on('radio', function(e) {
        // console.log($('input[title="手动填写"]').prop('checked'));
        // 判断 手动填写 单选框是否被选中，选中则后面文本框和对应验证规则可用，否则禁用
        if ($('input[title="手动填写"]').prop('checked')) {
            $('#resolution input[type="text"]').prop('disabled', false).attr('lay-verify', 'required|number|max5')
        } else {
            $('#resolution input[type="text"]').prop('disabled', true).attr('lay-verify', '').val('')
        }
    })

    // 监听 介绍 文本域字数变化
    $('#presentation textarea').on('input', function() {
        var len = $(this).val().length
        $('#wordsLength').html(len + '/' + $(this).prop('maxlength'))
    })

    // 标签部分
    // 定义存放标签数组
    var tagsArr1 = []
    $.each($('.addTag span'), function(i, ele) {
            // console.log(i); 
            // console.log(ele.innerText);
            tagsArr1.push(ele.innerText)
                // console.log(tagsArr1);
        })
        // 点击底部选择标签事件
    $('.tagList').on('click', 'li', function(e) {
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
    $('.addTag button').on('click', function() {
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
            $('#dialog-confirm').on('click', function(e) {
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
            $('#dialog-cancel').on('click', function() {
                layer.close(indexAdd)
            })
        } else {
            layer.msg('最多可选择六个标签', {
                icon: 7
            });
        }
    })

    // 点击关闭按钮 X 事件
    $('.addTag').on('click', 'strong', function() {
        // 从添加标签框里移除当前标签
        $(this).parent().remove()
            // 同时从数组中移除
        tagsArr1.splice(tagsArr1.indexOf($(this).innerText))
            // console.log(tagsArr1);
    })


    // 选择封面
    $('#uploadCover').on('click', function() {
            $('#coverFile').click();
        })
        // 为文件选择框绑定 change 事件
    $('#coverFile').on('change', function() {
        // 判断是否选择了文件
        if (this.files.length !== 0) {
            // 创建formData对象实现二进制文件上传
            var fd1 = new FormData()
            fd1.append('file', this.files[0])

            // 上传封面请求
            $.ajax({
                method: 'POST',
                url: 'http://139.9.143.69:8001/usercenter/upload',
                headers: {
                    uid: localStorage.getItem('uid')
                },
                processData: false, // 不处理数据
                contentType: false, // 不设置内容类型
                data: fd1,
                success: function(res) {
                    if (res.code === -1) {
                        return layer.msg('上传封面失败')
                    }
                    $('input[name=show_image]').val(res.data.url)
                        // 渲染封面
                    $('.cover img').attr('src', res.data.url)

                }
            })
        }
    })

    // 定义发布状态
    var draft = 0

    // 为存为保存按钮绑定点击事件
    $('#save').on('click', function() {
            draft = 1
        })
        // 监听到Ajax请求被发起了
    $(document).ajaxStart(function() {
        // $('#loading').show()
        NProgress.start()
    })

    // 监听到 Ajax 完成的事件
    $(document).ajaxStop(function() {
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

    // 提交表单事件
    form.on('submit(formDemo)', function(e) {
        layer.confirm('是否确认当前操作?', {
            icon: 3,
            title: '提示'
        }, function(index) {
            var fd = new FormData($('#uploadList')[0])
            fd.append('file', $('#fileCover')[0].files[0])
                // 上传源文件
            $.ajax({
                method: 'POST',
                url: 'http://139.9.143.69:8001/usercenter/upload',
                headers: {
                    uid: localStorage.getItem('uid')
                },
                processData: false, // 不处理数据
                contentType: false, // 不设置内容类型
                data: fd,
                success: function(res) {
                    // console.log(res);
                    if (res.code === -1) {
                        return layer.msg('上传源文件失败')
                    }
                    fd.append('downloadurl', res.data.downloadurl)
                    fd.append('filetype', res.data.filetype)
                    fd.append('spec', res.data.spec)
                    fd.append('details_image', $('input[name="show_image"]').val())
                    fd.append('category1_id', 2)
                    fd.append('category2_id', $(".classify").find('option:selected').parent().prop('id'))
                    fd.append('tags', tagsArr1.toString())
                    fd.append('draft', draft)
                    fd.append('source_size', `${fd.get('length')}px * ${fd.get('width')}px`)
                    fd.append('source_file', $('.accessory span').text())

                    if ($('#resolution input[type="text"]').val()) { // 手动填写参数
                        fd.set('source_dpi', $('#resolution input[type="text"]').val() + 'dpi')
                    }

                    // formData 转换 json 数据
                    var jsonData = {};
                    fd.forEach((value, key) => jsonData[key] = value);
                    // console.log(jsonData);
                    // 发布
                    $.ajax({
                        method: 'POST',
                        url: 'http://139.9.143.69:8001/usercenter/works/template',
                        headers: {
                            uid: localStorage.getItem('uid')
                        },
                        dataType: 'json',
                        contentType: "application/json",
                        data: JSON.stringify(jsonData),
                        success: function(res) {
                            // console.log(res);
                            if (res.code === -1) {
                                return layer.msg('发布失败')
                            }
                            location.href = 'centre.html'
                        }
                    })
                }
            })
            layer.close(index);
        });
        return false; //阻止表单跳转
    });
})