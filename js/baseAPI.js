// 每次调用get post ajax 请求时
// 都会先调用ajaxPrefilter这个函数
// 在这个函数中我们可以拿到ajax给我们的配置对象
$.ajaxPrefilter(function(options) {
    //在发起请求之前统一给url拼接请求根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url;

    // 统一为有权限的接口设置 headers 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }

    }

    // 全局统一挂载 complete 回调函数
    options.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1. 强制清空 token
            localStorage.removeItem('token');
            // 2. 强制跳转到登录页面
            location.href = '/login.html'
        }
    }
})