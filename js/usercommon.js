$(function () {

    var layer = layui.layer

    //  个人用户顶部切换菜单栏颜色
    $('#userMenu').on('mouseover', 'li', function () {
        $(this).addClass('current').siblings().removeClass('current')
    })




    // 点击退出返回登录
    $('#logout').on('click', function () {
        layer.confirm('是否退出登录?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'GET',
                url: 'http://139.9.143.69:8001/oauth/logout',
                headers: {
                    uid: localStorage.getItem('uid')
                },
                success: function (res) {
                    // console.log(res);
                    if (res.flag !== true) return layer.msg('退出登录失败！')
                    sessionStorage.removeItem('uid')
                    window.location.href = "/login.html";
                }
            })

            layer.close(index);
        });
    })
})