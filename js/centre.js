$(function() {


    // 瀑布流插件
    $('#gallery-wrapper').pinterest_grid({
        no_columns: 3,
        padding_x: 10,
        padding_y: 10,
        margin_bottom: 50,
    })



    var layer = layui.layer
    var laypage = layui.laypage;
    //  顶部背景图菜单栏点击高亮
    $('.tab-menu').on('click', 'a', function() {
        $('.tab-menu').children().children('a').removeClass('sizeColor')
        $(this).addClass('sizeColor')
    })

    // 登录请求
    // login()

    // function login() {
    //     $.ajax({
    //         method: 'POST',
    //         url: 'http://139.9.143.69:8001/oauth/login',
    //         data: {
    //             phone: '15393176778',
    //             // phone: '13622779577',
    //             password: '123456',
    //         },
    //         success: function(res) {
    //             // console.log(res);
    //             localStorage.setItem('uid', res.data)
    //         },
    //     })
    // }

    // 调用获取个人信息
    getUserInfo()
        // 获取个人信息
    function getUserInfo() {
        $.ajax({
            method: 'GET',
            url: 'http://139.9.143.69:8001/users/info',
            headers: {
                uid: localStorage.getItem('uid'),
            },
            success: function(res) {
                if (res.code !== 0) return layer.msg('获取个人信息失败！')
                    // 获取头像
                var picHtml = template('templatePic', res.data)
                $('.photo').html(picHtml)
                    // 获取个人电话QQ微信
                var Phone = template('templatePhone', res.data)
                $('.info-list').html(Phone)
                    //  获取昵称
                var nameHtml = template('templateName', res.data)
                $('.username').html(nameHtml)
            },
        })
    }

    //  验证登录状态
    $.ajax({
        method: 'GET',
        url: 'http://139.9.143.69:8001/users/info',
        headers: {
            uid: localStorage.getItem('uid'),
        },
        complete: function(res) {
            // console.log(res.status);
            if (res.status === 401) {
                // 清空本地存储中的 uid
                localStorage.removeItem('uid')
                location.href = 'index.html'
            }
        },
    })



    // 获取个人中心首页作品
    var Works_num = '1' // 当前页
    var Works_size = '12' //每页显示条数
    getUserWorks()

    function getUserWorks() {

        var menuHTML = `
             <a href="javascript:;" class="color_orange" id="all">全部</a>
             <a href="javascript:;" id="design">平面广告</a>
             <a href="javascript:;" id="photography">摄影</a>
             <a href="javascript:;" id="UI">UI设计</a>
             <a href="javascript:;" id="TB">淘宝电商</a>`
        $.ajax({
            method: 'GET',
            url: 'http://139.9.143.69:8001/usercenter/personal/works',
            headers: {
                uid: localStorage.getItem('uid'),
            },
            data: { pageNum: Works_num, pageSize: Works_size },
            success: function(res) {
                // console.log(res);
                if (res.code !== 0) return layer.msg('获取用户作品失败！')
                $('.menu-list').html(menuHTML)
                if (res.data.rows == '') {
                    var textHtml = `<h2 class="noData">暂无作品</h2>`
                    $('#gallery-wrapper').html(textHtml)
                    $(window).resize()
                    $('#ShowMore').html('')
                } else {
                    var userWorksHtml = template('templateUserWorks', res)
                    $('#gallery-wrapper').html(userWorksHtml)
                    $(window).resize()
                    renderPage(res.data.total)
                }
            }
        })
    }

    // 分页
    function renderPage(total) {
        laypage.render({
            elem: 'ShowMore', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: Works_size,
            curr: Works_num,
            layout: ['count', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                Works_num = obj.curr
                    //首次不执行
                if (!first) {
                    getUserWorks()
                }
            }
        });
    }
    // 点击首页 显示个人中心首页
    $('#index').on('click', function() {
        getUserWorks()
    })



    // 切换图片区域平面设计背景色
    $('.menu-list').on('click', 'a', function() {
        // console.log($(this).index());
        $(this).addClass('color_orange').siblings().removeClass('color_orange')
    })

    //  获取全部分类 
    $('.menu-list').on('click', '#all', function() {
        $('#create').click()
    })

    // 获取平面设计图片分类 
    $('.menu-list').on('click', '#design', function() {
        design()
    })
    var design_num = '1' // 当前页
    var design_size = '12' //每页显示条数
    function design() {
        $.ajax({
            method: 'GET',
            url: 'http://139.9.143.69:8001/usercenter/personal/works',
            headers: {
                uid: localStorage.getItem('uid'),
            },
            data: { pageNum: design_num, pageSize: design_size, category_id: '9' },
            success: function(res) {
                // console.log(res);
                if (res.code !== 0) return layer.msg('获取平面设计列表失败！')
                if (res.data.rows == '') {
                    var textHtml = `<h2 class="noData">暂无作品</h2>`
                    $('#gallery-wrapper').html(textHtml)
                    $(window).resize()
                    $('#ShowMore').html('')
                } else {
                    var designHtml = template('templateUserWorks', res)
                    $('#gallery-wrapper').html(designHtml)
                    $(window).resize()
                    designPage(res.data.total)
                }
            }
        })
    }

    // 分页
    function designPage(total) {
        laypage.render({
            elem: 'ShowMore', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: design_size,
            curr: design_num,
            layout: ['count', 'prev', 'page', 'next', 'skip'],
            // layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                design_num = obj.curr
                    //首次不执行
                if (!first) {
                    design()
                }
            }
        });
    }

    $('.menu-list').on('click', '#photography', function() {
            photography()
        })
        // 获取摄影分类
    var photography_num = '1' // 当前页
    var photography_size = '12' //每页显示条数
    function photography() {
        $.ajax({
            method: 'GET',
            url: 'http://139.9.143.69:8001/usercenter/personal/works',
            headers: {
                uid: localStorage.getItem('uid'),
            },
            data: { pageNum: photography_num, pageSize: photography_size, category_id: '1' },
            success: function(res) {
                // console.log(res);
                if (res.code !== 0) return layer.msg('获取平面设计列表失败！')
                if (res.data.rows == '') {
                    var textHtml = `<h2 class="noData">暂无作品</h2>`
                    $('#gallery-wrapper').html(textHtml)
                    $(window).resize()
                    $('#ShowMore').html('')
                } else {
                    var photographyHtml = template('templateUserWorks', res)
                    $('#gallery-wrapper').html(photographyHtml)
                    $(window).resize()
                    photographyPage(res.data.total)
                }
            }
        })
    }
    // 分页

    function photographyPage(total) {
        laypage.render({
            elem: 'ShowMore', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: photography_size,
            curr: photography_num,
            layout: ['count', 'prev', 'page', 'next', 'skip'],
            // layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                photography_num = obj.curr
                    //首次不执行
                if (!first) {
                    photography()
                }
            }
        });
    }
    // UI设计分类
    $('.menu-list').on('click', '#UI', function() {
        userUI()
    })
    var UI_num = '1' // 当前页
    var UI_size = '12' //每页显示条数
    function userUI() {
        $.ajax({
            method: 'GET',
            url: 'http://139.9.143.69:8001/usercenter/personal/works',
            headers: {
                uid: localStorage.getItem('uid'),
            },
            data: { pageNum: UI_num, pageSize: UI_size, category_id: '11' },
            success: function(res) {
                // console.log(res);
                if (res.code !== 0) return layer.msg('获取平面设计列表失败！')
                if (res.data.rows == '') {
                    var textHtml = `<h2 class="noData">暂无作品</h2>`
                    $('#gallery-wrapper').html(textHtml)
                    $(window).resize()
                    $('#ShowMore').html('')
                } else {
                    var UIHtml = template('templateUserWorks', res)
                    $('#gallery-wrapper').html(UIHtml)
                    $(window).resize()
                    uiPage(res.data.total)
                }
            }
        })
    }
    // 分页
    function uiPage(total) {
        laypage.render({
            elem: 'ShowMore', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: UI_size,
            curr: UI_num,
            layout: ['count', 'prev', 'page', 'next', 'skip'],
            // layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                UI_num = obj.curr
                    //首次不执行
                if (!first) {
                    userUI()
                }
            }
        });
    }
    // 淘宝分类

    $('.menu-list').on('click', '#TB', function() {
        userTB()
    })
    var TB_num = '1'
    var TB_size = '12'

    function userTB() {
        $.ajax({
            method: 'GET',
            url: 'http://139.9.143.69:8001/usercenter/personal/works',
            headers: {
                uid: localStorage.getItem('uid'),
            },
            data: { pageNum: TB_num, pageSize: TB_size, category_id: '10' },
            success: function(res) {
                // console.log(res);
                if (res.code !== 0) return layer.msg('获取平面设计列表失败！')
                if (res.data.rows == '') {
                    var textHtml = `<h2 class="noData">暂无作品</h2>`
                    $('#gallery-wrapper').html(textHtml)
                    $(window).resize()
                    $('#ShowMore').html('')
                } else {
                    var TBHtml = template('templateUserWorks', res)
                    $('#gallery-wrapper').html(TBHtml)
                    $(window).resize()
                    tbPage(res.data.total)
                }
            }
        })
    }
    // 分页
    function tbPage(total) {
        laypage.render({
            elem: 'ShowMore', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: TB_size,
            curr: TB_num,
            layout: ['count', 'prev', 'page', 'next', 'skip'],
            // layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                TB_num = obj.curr
                    //首次不执行
                if (!first) {
                    userTB()
                }
            }
        });
    }
    // 鼠标经过显示  按钮
    $('#gallery-wrapper').on('mouseover', '.white-panel', function() {
        $(this).children('.top-btn').stop().fadeIn(300)
    })

    // 鼠标离开
    $('#gallery-wrapper').on('mouseout', '.white-panel', function() {
        $(this).children('.top-btn').stop().fadeOut(300)
    })

    // 鼠标经过按钮字体颜色改变
    // $('#gallery-wrapper').on('mouseover', 'button', function() {
    //     $(this).addClass('color_orange2')
    // })
    // $('#gallery-wrapper').on('mouseout', 'button', function() {
    //     $(this).removeClass('color_orange2')
    // })

    // 经过图片区域底部  显示更多按钮颜色变化
    $('.img-list').on('mouseover', 'button', function() {
        $(this).addClass('color_orange2')
    })
    $('.img-list').on('mouseout', 'button', function() {
        $(this).removeClass('color_orange2')
    })

    // 点击收藏按钮获取用户收藏列表

    $('#userCollect').on('click', function() {
        getUserCollect()
    })

    var favorites_num = '1'
    var favorites_size = '12'
        // 获取用户收藏请求
    function getUserCollect() {
        $.ajax({
            method: 'GET',
            url: 'http://139.9.143.69:8001/usercenter/works/favorites',
            headers: {
                uid: localStorage.getItem('uid'),
            },
            data: { pageNum: favorites_num, pageSize: favorites_size },
            success: function(res) {
                // console.log(res);
                if (res.code !== 0) return layer.msg('获取用户收藏列表失败！')
                var CollectMenu = `
                <a href="javascript:;" class="color_orange" id="all_favorites">全部</a>
                <a href="javascript:;" id="design_favorites">平面广告</a>
                <a href="javascript:;" id="photography_favorites">摄影</a>
                <a href="javascript:;" id="UI_favorites">UI设计</a>
                <a href="javascript:;" id="TB_favorites">淘宝电商</a>`
                $('.menu-list').html(CollectMenu)
                if (res.data.favourites == '') {
                    var textHtml = `<h2 class="noData">暂无收藏记录</h2>`
                    $('#gallery-wrapper').html(textHtml)
                    $(window).resize()
                    $('#ShowMore').html('')
                } else {
                    var collectHtml = template('templateCollect', res.data)
                    $('#gallery-wrapper').html(collectHtml)
                    $(window).resize()
                    CollectPage(res.data.total)
                }
            },
        })
    }
    // 分页
    function CollectPage(total) {
        laypage.render({
            elem: 'ShowMore', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: favorites_size,
            curr: favorites_num,
            layout: ['count', 'prev', 'page', 'next', 'skip'],
            // layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                favorites_num = obj.curr
                    //首次不执行
                if (!first) {
                    getUserCollect()
                }
            }
        });
    }
    //  获取用户收藏全部分类 
    $('.menu-list').on('click', '#all_favorites', function() {
        $('#userCollect').click()
    })

    // 获取用户收藏平面设计图片分类 
    $('.menu-list').on('click', '#design_favorites', function() {
        design_favorites()
    })
    var design_favorites_num = '1'
    var design_favorites_size = '12'

    function design_favorites() {
        $.ajax({
            method: 'GET',
            url: 'http://139.9.143.69:8001/usercenter/works/favorites',
            headers: {
                uid: localStorage.getItem('uid'),
            },
            data: {
                pageNum: design_favorites_num,
                pageSize: design_favorites_size,
                category_id: '9'
            },
            success: function(res) {
                // console.log(res);
                if (res.code !== 0) return layer.msg('获取平面设计列表失败！')
                if (res.data.favourites == '') {
                    var textHtml = `<h2 class="noData">暂无收藏记录</h2>`
                    $('#gallery-wrapper').html(textHtml)
                    $(window).resize()
                    $('#ShowMore').html('')
                } else {
                    var design_favorites = template('templateCollect', res.data)
                    $('#gallery-wrapper').html(design_favorites)
                    $(window).resize()
                    designFavoritesPage(res.data.total)
                }
            }
        })
    }

    // 分页
    function designFavoritesPage(total) {
        laypage.render({
            elem: 'ShowMore', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: design_favorites_size,
            curr: design_favorites_num,
            layout: ['count', 'prev', 'page', 'next', 'skip'],
            // layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                design_favorites_num = obj.curr
                    //首次不执行
                if (!first) {
                    design_favorites()
                }
            }
        });
    }
    // 用户收藏摄影分类
    $('.menu-list').on('click', '#photography_favorites', function() {
        photography_favorites()
    })
    var photography_favorites_num = '1'
    var photography_favorites_size = '12'

    function photography_favorites() {
        $.ajax({
            method: 'GET',
            url: 'http://139.9.143.69:8001/usercenter/works/favorites',
            headers: {
                uid: localStorage.getItem('uid'),
            },
            data: {
                pageNum: photography_favorites_num,
                pageSize: photography_favorites_size,
                category_id: '1'
            },
            success: function(res) {
                // console.log(res);
                if (res.code !== 0) return layer.msg('获取平面设计列表失败！')
                if (res.data.favourites == '') {
                    var textHtml = `<h2 class="noData">暂无收藏记录</h2>`
                    $('#gallery-wrapper').html(textHtml)
                    $(window).resize()
                    $('#ShowMore').html('')
                } else {
                    var photography_favorites = template('templateCollect', res.data)
                    $('#gallery-wrapper').html(photography_favorites)
                    $(window).resize()
                    designFavoritesPage(res.data.total)
                }
            }
        })
    }
    // 分页
    function designFavoritesPage(total) {
        laypage.render({
            elem: 'ShowMore', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: photography_favorites_size,
            curr: photography_favorites_num,
            layout: ['count', 'prev', 'page', 'next', 'skip'],
            // layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                photography_favorites_num = obj.curr
                    //首次不执行
                if (!first) {
                    photography_favorites()
                }
            }
        });
    }
    // 用户收藏UI分类
    $('.menu-list').on('click', '#UI_favorites', function() {
        UI_favorites()
    })
    var UI_favorites_num = '1'
    var UI_favorites_size = '12'

    function UI_favorites() {
        $.ajax({
            method: 'GET',
            url: 'http://139.9.143.69:8001/usercenter/works/favorites',
            headers: {
                uid: localStorage.getItem('uid'),
            },
            data: {
                pageNum: UI_favorites_num,
                pageSize: UI_favorites_size,
                category_id: '11'
            },
            success: function(res) {
                // console.log(res);
                if (res.code !== 0) return layer.msg('获取平面设计列表失败！')
                if (res.data.favourites == '') {
                    var textHtml = `<h2 class="noData">暂无收藏记录</h2>`
                    $('#gallery-wrapper').html(textHtml)
                    $(window).resize()
                    $('#ShowMore').html('')
                } else {
                    var UI_favorites = template('templateCollect', res.data)
                    $('#gallery-wrapper').html(UI_favorites)
                    $(window).resize()
                    uiFavoritesPage(res.data.total)
                }
            }
        })
    }

    // 分页
    function uiFavoritesPage(total) {
        laypage.render({
            elem: 'ShowMore', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: UI_favorites_size,
            curr: UI_favorites_num,
            layout: ['count', 'prev', 'page', 'next', 'skip'],
            // layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                UI_favorites_num = obj.curr
                    //首次不执行
                if (!first) {
                    UI_favorites()
                }
            }
        });
    }
    //  用户收藏淘宝电商分类
    $('.menu-list').on('click', '#TB_favorites', function() {
        TB_favorites()
    })
    var TB_favorites_num = '1'
    var TB_favorites_size = '12'

    function TB_favorites() {
        $.ajax({
            method: 'GET',
            url: 'http://139.9.143.69:8001/usercenter/works/favorites',
            headers: {
                uid: localStorage.getItem('uid'),
            },
            data: {
                pageNum: TB_favorites_num,
                pageSize: TB_favorites_size,
                category_id: '11'
            },
            success: function(res) {
                // console.log(res);
                if (res.code !== 0) return layer.msg('获取平面设计列表失败！')
                if (res.data.favourites == '') {
                    var textHtml = `<h2 class="noData">暂无收藏记录</h2>`
                    $('#gallery-wrapper').html(textHtml)
                    $(window).resize()
                    $('#ShowMore').html('')
                } else {
                    var TB_favorites = template('templateCollect', res.data)
                    $('#gallery-wrapper').html(TB_favorites)
                    $(window).resize()
                    tbFavoritesPage(res.data.total)
                }
            }
        })
    }

    // 分页
    function tbFavoritesPage(total) {
        laypage.render({
            elem: 'ShowMore', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: TB_favorites_size,
            curr: TB_favorites_num,
            layout: ['count', 'prev', 'page', 'next', 'skip'],
            // layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                TB_favorites_num = obj.curr
                    //首次不执行
                if (!first) {
                    TB_favorites()
                }
            }
        });
    }
    // 取消收藏
    $('#gallery-wrapper').on('click', '#delcancel', function() {
        var id = $(this).attr('data-index')
        layer.confirm('是否取消收藏?', { icon: 3, title: '取消收藏' }, function(index) {
            $.ajax({
                method: 'delete',
                url: 'http://139.9.143.69:8001/usercenter/works/favorites/' + id,
                headers: {
                    uid: localStorage.getItem('uid'),
                },
                success: function(res) {
                    if (res.code !== 0) return layer.msg('取消失败！')
                    getUserCollect()
                    layer.msg('取消收藏成功！')
                },
            })
            layer.close(index)
        })
    })

    // 删除个人首页展示的图片
    $('#gallery-wrapper').on('click', '#deleteUserImg', function() {
        var id = $(this).attr('data-index')
        console.log(id)
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'delete',
                url: 'http://139.9.143.69:8001/usercenter/works/' + id,
                headers: {
                    uid: localStorage.getItem('uid'),
                },
                success: function(res) {
                    // console.log(res)
                    if (res.code !== 0) return layer.msg('删除失败！')
                    getUserWorks()
                    layer.msg('删除成功！')
                },
            })
            layer.close(index)
        })
    })

    // 修改 个人作品
    $('#gallery-wrapper').on('click', '#alter', function() {
        var id = $(this).attr('data-id')
        window.location.href = '/edit.html?id=' + id
        sessionStorage.setItem('id', id)
    })


    var History_num = '1'
    var History_size = '12'
        // 获取个人下载记录
    function downLoadHistory() {
        $.ajax({
            method: 'GET',
            url: 'http://139.9.143.69:8001/usercenter/download_history',
            headers: {
                uid: localStorage.getItem('uid'),
            },
            data: { pageNum: History_num, pageSize: History_size },
            success: function(res) {
                console.log(res)
                if (res.code !== 0) return layer.msg('获取下载记录失败！！')
                var HistoryMenu = `
                <a href="javascript:;" class="color_orange" id="all_download">全部</a>
                <a href="javascript:;" id="design_download">平面广告</a>
                <a href="javascript:;" id="photography_download">摄影</a>
                <a href="javascript:;" id="UI_download">UI设计</a>
                <a href="javascript:;" id="TB_download">淘宝电商</a>`
                $('.menu-list').html(HistoryMenu)
                    // 判断data是否有下载记录
                if (res.data.downloadHistory == '') {
                    var textHtml = `<h2 class="noData">暂无下载记录</h2>`
                    $('#gallery-wrapper').html(textHtml)
                    $(window).resize()
                    $('#ShowMore').html('')
                } else {
                    var collectHtml = template('templateHistory', res.data)
                    $('#gallery-wrapper').html(collectHtml)
                    $(window).resize()
                    downLoadHistoryPage(res.data.total)
                }
            },
        })
    }

    // 分页
    function downLoadHistoryPage(total) {
        laypage.render({
            elem: 'ShowMore', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: History_size,
            curr: History_num,
            layout: ['count', 'prev', 'page', 'next', 'skip'],
            // layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                History_num = obj.curr
                    //首次不执行
                if (!first) {
                    downLoadHistory()
                }
            }
        });
    }
    // 获取记录点击事件
    $('#history').on('click', function() {
        downLoadHistory()
    })
    $('.menu-list').on('click', '#all_download', function() {
            downLoadHistory()
        })
        // 下载记录  设计分类
    $('.menu-list').on('click', '#design_download', function() {
        design_download()
    })
    var design_download_num = '1'
    var design_download_size = '12'

    function design_download() {
        $.ajax({
            method: 'GET',
            url: 'http://139.9.143.69:8001/usercenter/download_history',
            headers: {
                uid: localStorage.getItem('uid'),
            },
            data: {
                pageNum: design_download_num,
                pageSize: design_download_size,
                category_id: '9'
            },
            success: function(res) {
                // console.log(res);
                if (res.code !== 0) return layer.msg('获取平面设计列表失败！')
                if (res.data.downloadHistory == '') {
                    var textHtml = `<h2 class="noData">暂无下载记录</h2>`
                    $('#gallery-wrapper').html(textHtml)
                    $(window).resize()
                    $('#ShowMore').html('')
                } else {
                    var design_download = template('templateHistory', res.data)
                    $('#gallery-wrapper').html(design_download)
                    $(window).resize()
                    design_download_Page(res.data.total)
                }
            }
        })
    }

    function design_download_Page(total) {
        laypage.render({
            elem: 'ShowMore', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: design_download_size,
            curr: design_download_num,
            layout: ['count', 'prev', 'page', 'next', 'skip'],
            // layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                design_download_num = obj.curr
                    //首次不执行
                if (!first) {
                    design_download()
                }
            }
        });
    }
    // 下载记录 摄影分类
    $('.menu-list').on('click', '#photography_download', function() {
        photography_download()
    })
    var photography_download_num = '1'
    var photography_download_size = '12'

    function photography_download() {
        $.ajax({
            method: 'GET',
            url: 'http://139.9.143.69:8001/usercenter/download_history',
            headers: {
                uid: localStorage.getItem('uid'),
            },
            data: {
                pageNum: photography_download_num,
                pageSize: photography_download_size,
                category_id: '1'
            },
            success: function(res) {
                // console.log(res);
                if (res.code !== 0) return layer.msg('获取平面设计列表失败！')
                if (res.data.downloadHistory == '') {
                    var textHtml = `<h2 class="noData">暂无下载记录</h2>`
                    $('#gallery-wrapper').html(textHtml)
                    $(window).resize()
                    $('#ShowMore').html('')
                } else {
                    var photography_download = template('templateHistory', res.data)
                    $('#gallery-wrapper').html(photography_download)
                    $(window).resize()
                    photography_download_Page(res.data.total)
                }
            }
        })
    }

    function photography_download_Page(total) {
        laypage.render({
            elem: 'ShowMore', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: photography_download_size,
            curr: photography_download_num,
            layout: ['count', 'prev', 'page', 'next', 'skip'],
            // layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                photography_download_num = obj.curr
                    //首次不执行
                if (!first) {
                    photography_download()
                }
            }
        });
    }
    //  下载记录 UI分类 
    $('.menu-list').on('click', '#UI_download', function() {
        UI_download()
    })
    var UI_download_num = '1'
    var UI_download_size = '12'

    function UI_download() {
        $.ajax({
            method: 'GET',
            url: 'http://139.9.143.69:8001/usercenter/download_history',
            headers: {
                uid: localStorage.getItem('uid'),
            },
            data: {
                pageNum: UI_download_num,
                pageSize: UI_download_size,
                category_id: '11'
            },
            success: function(res) {
                // console.log(res);
                if (res.code !== 0) return layer.msg('获取平面设计列表失败！')
                if (res.data.downloadHistory == '') {
                    var textHtml = `<h2 class="noData">暂无下载记录</h2>`
                    $('#gallery-wrapper').html(textHtml)
                    $(window).resize()
                    $('#ShowMore').html('')
                } else {
                    var UI_download = template('templateHistory', res.data)
                    $('#gallery-wrapper').html(UI_download)
                    $(window).resize()
                    UI_download_Page(res.data.total)
                }
            }
        })
    }

    function UI_download_Page(total) {
        laypage.render({
            elem: 'ShowMore', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: UI_download_size,
            curr: UI_download_num,
            layout: ['count', 'prev', 'page', 'next', 'skip'],
            // layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                UI_download_num = obj.curr
                    //首次不执行
                if (!first) {
                    UI_download()
                }
            }
        });
    }
    //   下载记录 淘宝电商分类
    $('.menu-list').on('click', '#TB_download', function() {
        TB_download()
    })
    var TB_download_num = '1'
    var TB_download_size = '12'

    function TB_download() {
        $.ajax({
            method: 'GET',
            url: 'http://139.9.143.69:8001/usercenter/download_history',
            headers: {
                uid: localStorage.getItem('uid'),
            },
            data: {
                pageNum: TB_download_num,
                pageSize: TB_download_size,
                category_id: '10'
            },
            success: function(res) {
                // console.log(res);
                if (res.code !== 0) return layer.msg('获取平面设计列表失败！')
                if (res.data.downloadHistory == '') {
                    var textHtml = `<h2 class="noData">暂无下载记录</h2>`
                    $('#gallery-wrapper').html(textHtml)
                    $(window).resize()
                    $('#ShowMore').html('')
                } else {
                    var TB_download = template('templateHistory', res.data)
                    $('#gallery-wrapper').html(TB_download)
                    $(window).resize()
                    TB_download_Page(res.data.total)
                }
            }
        })
    }

    function TB_download_Page(total) {
        laypage.render({
            elem: 'ShowMore', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: TB_download_size,
            curr: TB_download_num,
            layout: ['count', 'prev', 'page', 'next', 'skip'],
            // layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                TB_download_num = obj.curr
                    //首次不执行
                if (!first) {
                    TB_download()
                }
            }
        });
    }
    // 根据id删除 个人下载记录
    $('#gallery-wrapper').on('click', '#delDownLoadHistory', function() {
        var id = $(this).attr('data-index')
        console.log(id)
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'delete',
                url: 'http://139.9.143.69:8001/usercenter/download_history/' + id,
                headers: {
                    uid: localStorage.getItem('uid'),
                },
                success: function(res) {
                    if (res.code !== 0) return layer.msg('删除失败！')
                    downLoadHistory()
                    layer.msg('删除成功！')
                },
            })
            layer.close(index)
        })
    })

    var params = new URLSearchParams(location.search)
    var history = params.get('history')
        // console.log(history);
    if (history === 'download') {
        //     // 要触发的点击事件  $('#xxx').click()
        $('#history').click()
        $('#history').click()
            // sessionStorage.setItem("from", ""); //销毁 from 防止在b页面刷新 依然触发$('#xxx').click()
    }

    // 点击公共区域下载记录按钮  跳转到记录
    // window.onload = function() {
    // var from = sessionStorage.getItem('from')
    // console.log(from)
    //     if (from === 'pageA') {
    // 要触发的点击事件  $('#xxx').click()
    //         $('#history').click()
    // sessionStorage.setItem('from', '') //销毁 from 防止在b页面刷新 依然触发$('#xxx').click()
    //     }
    // }

    // 退出功能
    $('.exit').on('click', function() {
            // 提示用户是否确认退出
            layer.confirm('确定退出登录？', {
                icon: 3,
                title: '提示'
            }, function(index) {
                // 1.清空本地存储中的 uid
                localStorage.removeItem('uid')
                    // 2.刷新页面
                location.reload()
                location.href = 'index.html'
                    // 关闭 confirm 询问框
                layer.close(index);
            });
        })
        // 点击显示更多按钮

    // $('.ShowMore').on('click', '#btn1', function() {
    //     var boxHeight = $('.img-box').height() + 1300
    //     var num = null
    //     var boxHeights = null
    //         // console.log(parseInt($('#btn1').attr('data-length')) + 12);
    //     console.log(boxHeight);
    //     num = parseInt($('#btn1').attr('data-length')) + 12
    //     Works_size = parseInt(Works_size) + 12

    //     if (num == Works_size) {
    //         // console.log('ok');
    //         if ($('.img-box').height() > 1300) {
    //             boxHeights = boxHeight - 60
    //             $('.img-list').css('height', boxHeights)
    //         } else if ($('.img-box').height() > 3930) {
    //             boxHeights = boxHeight - 120
    //             $('.img-list').css('height', boxHeights)
    //         }
    //         getUserWorks()

    //     } else {
    //         $('#btn1').css('background', "#ccc");
    //     }

    // })

})