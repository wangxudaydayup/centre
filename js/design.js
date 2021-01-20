$(function () {
  // 搜索功能
  $("body")
    .on("click", ".qtw-button", function () {
      // 获取搜索框内容
      var searchText = $(".search-input input").val().trim();
      if (searchText) {
        window.location.href = `/search.html?search=${searchText}&catId=${catId}`;
      }
      $(".search-input input").val("");
    })
    .on("keyup", function (e) {
      // 同步搜索框内容
      $(".search-input input").val(e.target.value);
      // 按回车键触发搜索
      if (e.keyCode === 13 && $(".search-input input").val().trim()) {
        $(".qtw-button").click();
      }
    });

  // 搜素下拉选择框
  $(".func-search-class")
    .click(function () {
      $(this).find(".search-selected").show();
    })
    .mouseleave(function () {
      $(".search-selected").hide();
    });

  var catId = "";
  $(".top-search-box").on("click", ".search-selected li", function () {
    // console.log($(this).text());
    $(".func-search-class span").text($(this).text());
    catId = $(this).attr("data-falg");
    $(this).parent().hide();
  });

  // 下滑搜索框
  var detailsFlag = 1;
  var resFlag = false;
  $(window).scroll(function () {
    if ($(window).scrollTop() > 500 && detailsFlag) {
      $(".fication-slide").css("top", "0px");
    } else {
      $(".fication-slide").css("top", "-145px");
    }
  });

  // 搜索框焦点事件
  $(".search-input input").focus(function () {
    // console.log(1);
    $(this).attr("placeholder", "");
  });
  $(".search-input input").blur(function () {
    // console.log(1);
    $(this).attr("placeholder", "通 过 关 键 字 搜 索 U X D L");
  });

  // 分类导航部分
  $.ajax({
    method: "GET",
    url: "http://139.9.143.69:8001/materials/categorys/0",
    success: function (res) {
      console.log(res.data);
      // 调用 template 函数
      var htmlStr = template("classify", res.data);
      // // console.log(htmlStr);
      // // 渲染 HTML 结构
      $(".fic-text").html(htmlStr);
    },
  });
  // $.get(
  //   "http://139.9.143.69:8001/materials/categorys/level/1",
  //   function (res1) {
  //     // console.log(res1.data);
  //     var classifyData = [];

  //     res1.data.slice(0, 6).forEach(function (v) {
  //       $.ajax({
  //         method: "GET",
  //         url: "http://139.9.143.69:8001/materials/categorys/" + v.id,
  //         async: false,
  //         success: function (res2) {
  //           // console.log(res2.data[0]);
  //           classifyData.push(res2.data[0]);
  //         },
  //       });
  //     });
  //     // console.log(classifyData);
  //     // 调用 template 函数
  //     var htmlStr = template("classify", classifyData);
  //     // // console.log(htmlStr);
  //     // // 渲染 HTML 结构
  //     $(".fic-text").html(htmlStr);
  //   }
  // );

  // 添加收藏功能
  $("#gallery-wrapper").on("click", "#favourite", function (e) {
    e.stopPropagation();
    if (sessionStorage.getItem("status") === "401") {
      layer.msg("请登陆", {
        time: 1000,
      });
      $("#login").click();
      return;
    }
    var favouriteThis = $(this);
    $.ajax({
      method: "POST",
      url:
        "http://139.9.143.69:8001/usercenter/works/favorites/" +
        $(this).parents(".search-img-hover").attr("data-id"),
      headers: {
        uid: localStorage.getItem("uid"),
      },
      success: function (res) {
        console.log(res);
        if (res.flag) {
          $(favouriteThis)
            .siblings("i")
            .html(parseInt($(favouriteThis).siblings("i").html()) + 1);
        }
      },
    });
    $(this).attr("src", "./img/favorite2.png");
    $(".favourite img").attr("src", "./img/favorite2.png");
  });

  // 详情页收藏功能
  $("body").on("click", ".favourite", function () {
    $("#favourite").click();
  });

  // 精选藏管图片渲染
  var searchHtml = [];
  $.get(
    "http://139.9.143.69:8001/materials/choiceness/0",
    {
      page: 1,
      size: 30,
    },
    function (res) {
      // console.log(res.data.rows)
      // 调用 template 函数
      var htmlStr = template("pictures", res.data.rows);
      // console.log(htmlStr);
      // 渲染 HTML 结构
      $("#gallery-wrapper").html(htmlStr);
      $("#gallery-wrapper1").html(htmlStr);
      $("#gallery-wrapper3").html(htmlStr);
      $("#gallery-wrapper4").html(htmlStr);
      $("#gallery-wrapper5").html(htmlStr);
      $(window).resize();
      // for (var flag = 0; flag < res.data.rows.length; flag++) {
      //   searchHtml.push(` <article class="white-panel">
      //       <img src="${res.data.rows[flag].show_image}" class="thumb">
      //       <div class="search-img-hover">
      //           <span class="search-img-label">${res.data.rows[flag].category1_name}</span>
      //           <span class="search-img-Collection">2 <a href="javascript:;" class="layui-icon layui-icon-heart" style="font-size: 20px;color: #ffff;"></a></span>
      //           <a class="search-img-download" >免 费 下 载</a>
      //       </div>
      //   </article>`)
      // }
      // $('#gallery-wrapper').html(searchHtml.join(''))
      // $('#gallery-wrapper2').html(searchHtml.join(''))
      // $('#gallery-wrapper3').html(searchHtml.join(''))
      // $('#gallery-wrapper4').html(searchHtml.join(''))
      // $('#gallery-wrapper5').html(searchHtml.join(''))
    }
  );

  // 显示更多按钮
  $(".morr").on("click", function () {
    // console.log($(this).prev()[0]);
    // console.log($('#gallery-wrapper').css('height'));
    $(this)
      .prev()
      .css({
        // 'overflow': 'visible',
        "max-height": $("#gallery-wrapper").css("height"),
      });
    $(this).css({
      background: "#ccc",
      cursor: "not-allowed",
    });
  });

  // searchHtml = []
  // $.get(
  //   'http://139.9.143.69:8001/materials/choiceness/1', {
  //     page: 1,
  //     size: 30,
  //   },
  //   function (res) {
  //     for (var flag = 0; flag < res.data.rows.length; flag++) {
  //       searchHtml.push(` <article class="white-panel">
  //           <img src="${res.data.rows[flag].show_image}" class="thumb">
  //           <div class="search-img-hover">
  //               <span class="search-img-label">${res.data.rows[flag].category1_name}</span>
  //               <span class="search-img-Collection">2 <a href="javascript:;" class="layui-icon layui-icon-heart" style="font-size: 20px;color: #ffff;"></a></span>
  //               <a class="search-img-download" >免 费 下 载</a>
  //           </div>
  //       </article>`)
  //     }
  //     $('#gallery-wrapper2').html(searchHtml.join(''))
  //     // $(window).resize();
  //   }
  // )
  // searchHtml = []
  // $.get(
  //   'http://139.9.143.69:8001/materials/choiceness/3', {
  //     page: 1,
  //     size: 30,
  //   },
  //   function (res) {
  //     for (var flag = 0; flag < res.data.rows.length; flag++) {
  //       searchHtml.push(` <article class="white-panel">
  //               <img src="${res.data.rows[flag].show_image}" class="thumb">
  //               <div class="search-img-hover">
  //                   <span class="search-img-label">${res.data.rows[flag].category1_name}</span>
  //                   <span class="search-img-Collection">2 <a href="javascript:;" class="layui-icon layui-icon-heart" style="font-size: 20px;color: #ffff;"></a></span>
  //                   <a class="search-img-download" >免 费 下 载</a>
  //               </div>
  //           </article>`)
  //     }
  //     $('#gallery-wrapper3').html(searchHtml.join(''))
  //     // $(window).resize();
  //   }
  // )

  // searchHtml = []
  // $.get(
  //   'http://139.9.143.69:8001/materials/choiceness/4', {
  //     page: 1,
  //     size: 30,
  //   },
  //   function (res) {
  //     for (var flag = 0; flag < res.data.rows.length; flag++) {
  //       searchHtml.push(` <article class="white-panel">
  //           <img src="${res.data.rows[flag].show_image}" class="thumb">
  //           <div class="search-img-hover">
  //               <span class="search-img-label">${res.data.rows[flag].category1_name}</span>
  //               <span class="search-img-Collection">2 <a href="javascript:;" class="layui-icon layui-icon-heart" style="font-size: 20px;color: #ffff;"></a></span>
  //               <a class="search-img-download" >免 费 下 载</a>
  //           </div>
  //       </article>`)
  //     }

  //     $('#gallery-wrapper4').html(searchHtml.join(''))
  //     // $(window).resize();
  //   }
  // )

  // searchHtml = []
  // $.get(
  //   'http://139.9.143.69:8001/materials/choiceness/5', {
  //     page: 1,
  //     size: 30,
  //   },
  //   function (res) {
  //     for (var flag = 0; flag < res.data.rows.length; flag++) {
  //       searchHtml.push(` <article class="white-panel">
  //           <img src="${res.data.rows[flag].show_image}" class="thumb">
  //           <div class="search-img-hover">
  //               <span class="search-img-label">${res.data.rows[flag].category1_name}</span>
  //               <span class="search-img-Collection">2 <a href="javascript:;" class="layui-icon layui-icon-heart" style="font-size: 20px;color: #ffff;"></a></span>
  //               <a class="search-img-download" >免 费 下 载</a>
  //           </div>
  //       </article>`)
  //     }

  //     $('#gallery-wrapper5').html(searchHtml.join(''))
  //     // $(window).resize();
  //   }
  // )

  $("#gallery-wrapper").pinterest_grid({
    no_columns: 4,
    padding_x: 20,
    padding_y: 20,
    margin_bottom: 120,
    single_column_breakpoint: 700,
  });
  $("#gallery-wrapper1").pinterest_grid({
    no_columns: 4,
    padding_x: 20,
    padding_y: 20,
    margin_bottom: 120,
    single_column_breakpoint: 700,
  });

  $("#gallery-wrapper2").pinterest_grid({
    no_columns: 4,
    padding_x: 15,
    padding_y: 15,
    // margin_bottom: 50,
    single_column_breakpoint: 0,
  });

  $("#gallery-wrapper3").pinterest_grid({
    no_columns: 4,
    padding_x: 20,
    padding_y: 20,
    margin_bottom: 120,
    single_column_breakpoint: 700,
  });
  $("#gallery-wrapper4").pinterest_grid({
    no_columns: 4,
    padding_x: 20,
    padding_y: 20,
    margin_bottom: 120,
    single_column_breakpoint: 700,
  });
  $("#gallery-wrapper5").pinterest_grid({
    no_columns: 4,
    padding_x: 20,
    padding_y: 20,
    margin_bottom: 120,
    single_column_breakpoint: 700,
  });

  $(".search-img-download").on("click", function () {
    $(".details").show();
    window.scroll(0, 0);
    $(window).resize();
  });
  $(".datails-close").on("click", function () {
    $(".details").hide();
    $(window).resize();
  });
  // $('#gallery-wrapper').pinterest_grid({
  //   no_columns: 4,
  //   padding_x: 40,
  //   padding_y: 15,
  //   // margin_bottom: 50,
  //   single_column_breakpoint: 0,
  // })
  // $('#gallery-wrapper2').pinterest_grid({
  //   no_columns: 4,
  //   padding_x: 15,
  //   padding_y: 15,
  //   // margin_bottom: 50,
  //   single_column_breakpoint: 0,
  // })
  // var customScroll = new scrollbot(".details-box", 20);
  // customScroll.setStyle({
  //     'background': '#b3b3b3',
  //     'border-radius': '5px'
  // }, {
  //     'background': '#f5f5f5',
  // })
  // $('.scrollbot-scrollbar').css('width', '10px')
  // $('.scrollbot-scrollbar').css('margin-right', '5px')
  $(".details").hide();

  // const win = $(window)
  // const selector = $('.scroll-bar')
  // var height = 1000
  // win.scroll(function () {
  //   if (win.scrollTop() >= height) {
  //     // $('.user').hide()
  //     // $('.avatar').hide()
  //     selector.slideDown(800).css('display', 'block')
  //   } else {
  //     selector.slideUp(800)
  //     // $('.user').show()
  //     // $('.avatar').show()
  //   }
  // })

  //头部导航栏
  // $('.headerClassification ul li').mouseenter(function () {
  //   $(this).siblings('li').removeClass('grad')
  //   $(this).addClass('grad')
  // })
  // $('.headerClassification ul li').mouseleave(function () {
  //   $(this).siblings(':first').addClass('grad')
  //   $(this).removeClass('grad')
  // })

  //分类级别信息查询
  var designer = []; //平面设计
  var tbCommerce = []; //淘宝电商
  var uiDesign = []; //UI设计
  var template1 = []; //样机模板
  $.get("http://139.9.143.69:8001/materials/categorys/level/3", function (res) {
    for (var i = 0; i < res.data.length; i++) {
      if (res.data[i].parent_id == 9) {
        designer.push(res.data[i]);
      } else if (res.data[i].parent_id == 10) {
        tbCommerce.push(res.data[i]);
      } else if (res.data[i].parent_id == 11) {
        uiDesign.push(res.data[i]);
      } else if (res.data[i].parent_id == 12) {
        template1.push(res.data[i]);
      }
    }

    //平面设计
    var tbCommerceHtml = [];
    for (var i = 0; i < tbCommerce.length; i++) {
      tbCommerceHtml.push(`
            <li><a href="javascript:;">${tbCommerce[i].name}</a></li>
            `);
    }

    $(".fic-text li:nth-child(3) .main-submenu").html(tbCommerceHtml.join(""));
    //淘宝电商
    var designerHtml = [];
    for (var i = 0; i < designer.length; i++) {
      designerHtml.push(`
            <li><a href="javascript:;">${designer[i].name}</a></li>
            `);
    }

    $(".fic-text li:nth-child(2) .main-submenu").html(designerHtml.join(""));
    //UI设计
    var uiDesignHtml = [];
    for (var i = 0; i < uiDesign.length; i++) {
      uiDesignHtml.push(`
            <li><a href="javascript:;">${uiDesign[i].name}</a></li>
            `);
    }

    $(".fic-text li:nth-child(4) .main-submenu").html(uiDesignHtml.join(""));
    //样机模板
    var templateHtml = [];
    for (var i = 0; i < template1.length; i++) {
      templateHtml.push(`
            <li><a href="javascript:;">${template1[i].name}</a></li>
            `);
    }

    $(".fic-text li:nth-child(5) .main-submenu").html(templateHtml.join(""));

    // 小li鼠标滑入事件
    $(".main-submenu li").mouseenter(function () {
      $(this).siblings("li").removeClass("main-submit-hover");
      $(this).addClass("main-submit-hover");
    });

    $(function () {
      var $li = $(".fic-text>li");
      $li.mouseenter(function () {
        $(this).children("ul").show();
      });
      $li.mouseleave(function () {
        $(this).children("ul").hide();
      });
    });
  });

  $(".menus .nav-box li").mouseenter(function () {
    $(this).siblings("li").removeClass("color-change");
    $(this).addClass("color-change");
  });
  // $('.fication .fic-text li').mouseenter(function() {
  //     $(this).siblings('li').removeClass('color-change');
  //     $(this).addClass('color-change');
  // })

  // $('#gallery-wrapper').on('click', '.favourite_num', function () {
  //   var favouriteThis = $(this)
  //   $.ajax({
  //     method: 'POST',
  //     url: 'http://139.9.143.69:8001/usercenter/works/favorites/' + $(this)[0].dataset.id,
  //     headers: {
  //       uid: localStorage.getItem('uid'),
  //     },
  //     success: function (res) {
  //       console.log(res)
  //       if (res.flag) {
  //         $(favouriteThis)
  //           .siblings('i')
  //           .html(parseInt($(favouriteThis).siblings('i').html()) + 1)
  //       }
  //     },
  //   })
  //   $(this).css('color', '#ffa03e')
  // })

  $(window).resize();
  setTimeout(function () {
    $(window).resize();
  }, 1500);

  if (localStorage.getItem("uid")) {
    // 隐藏未登录盒子
    $(".right").hide();
    // 显示登录盒子
    $(".user").show();
    // 退出登录
    $(".exit").on("click", function () {
      // 提示用户是否确认退出
      layer.confirm(
        "确定退出登录？",
        {
          icon: 3,
          title: "提示",
        },
        function (index) {
          // 1.清空本地存储中的 uid
          localStorage.removeItem("uid");
          // 2.重新跳转到登录页面
          location.href = "index.html";

          // 关闭 confirm 询问框
          layer.close(index);
        }
      );
    });
  }
  var layer = layui.layer;
  var form = layui.form;
  var layer = layui.layer;
  //1. 点击登录注册按钮显示对应页面
  $("#login").on("click", function () {
    $("#layui-layer-shade").show();
    $("#login-box1").show();
  });
  $("#register").on("click", function () {
    $("#layui-layer-shade").show();
    $("#register-box1").show();
  });
  // 2.1点击密码验证码登陆的切换
  $("#tab-passwords1").on("click", function () {
    $("#layui-layer-shade").show();
    $("#login-box2").show();
  });
  $("#tab-passwords2").on("click", function () {
    $("#layui-layer-shade").show();
    $("#login-box2").hide();
    $("#login-box1").show();
  });
  // 2.2点击密码验证码注册的切换
  $("#tab-passwords3").on("click", function () {
    $("#layui-layer-shade").show();
    $("#register-box1").hide();
    $("#register-box2").show();
  });
  $("#tab-passwords4").on("click", function () {
    $("#layui-layer-shade").show();
    $("#register-box2").hide();
    $("#register-box1").show();
  });
  // 2.3注册跳到登陆，登陆跳到注册
  $("#forget-link1").on("click", function () {
    $("#layui-layer-shade").show();
    $("#login-box1").hide();
    $("#register-box1").show();
  });
  $("#forget-link2").on("click", function () {
    $("#layui-layer-shade").show();
    $("#login-box2").hide();
    $("#register-box1").show();
  });
  $("#forget-link3").on("click", function () {
    $("#layui-layer-shade").show();
    $("#register-box1").hide();
    $("#login-box1").show();
  });
  $("#forget-link4").on("click", function () {
    $("#layui-layer-shade").show();
    $("#register-box2").hide();
    $("#login-box1").show();
  });
  // 2.4登陆跳转到找回密码页面
  $("#to-findpsw1").on("click", function () {
    $("#layui-layer-shade").show();
    $("#login-box1").hide();
    $("#if-forget").show();
  });
  $("#to-findpsw2").on("click", function () {
    $("#layui-layer-shade").show();
    $("#login-box2").hide();
    $("#if-forget").show();
  });

  // 3手机号码和验证码密码自定义验证规则
  form.verify({
    // 手机号码规则
    phonenumber: [/^\d{1,20}$/, "请输入正确手机号码"],
    // 密码规则
    psw: [/^\d{1,20}$/, "请输入正确的密码"],
    psw2: [/^[a-zA-Z0-9]{6,8}$/, "请输入正确的密码"],
    // 校验两次密码是否一致的规则
    repwd: function (value) {
      // 通过形参拿到的是确认密码框中的内容
      // 还需要拿到密码框中的内容
      // 然后进行一次等于的判断
      // 如果判断失败,则return一个提示消息即可
      var pwd = $(".reg-box [name=password]").val();
      if (pwd !== value) {
        return "两次密码不一致！";
      }
    },
  });
  //4.1   input输入框超限提醒
  $("form input").on("keyup", function () {
    if (this.value.length == 20) {
      layer.open({
        title: "提示！",
        content: "输入已到上限",
      });
    }
  });
  //    4.2    按钮样式变化
  $("#login-box1").on("keyup", function (e) {
    var phone1 = $(".phone-ipt1").val();
    var psw1 = $("#psw1").val();
    if (phone1 != "" && psw1 != "") {
      $("#post-btn1").addClass("color-trans");
      $("#post-btn1").removeClass("layui-btn-disabled");
    }
  });
  $("#register-box1").on("keyup", function (e) {
    var phone2 = $(".phone-ipt2").val();
    var psw2 = $("#psw3").val();
    var psw5 = $("#regist-psw").val();
    if (phone2 != "" && psw2 != "" && psw5 != "") {
      $("#post-btn3").addClass("color-trans");
      $("#post-btn3").removeClass("layui-btn-disabled");
    }
  });
  $("#register-box2").on("keyup", function (e) {
    var phone3 = $(".phone-ipt3").val();
    var psw3 = $("#psw4").val();
    if (phone3 != "" && psw3 != "") {
      $("#post-btn4").addClass("color-trans");
      $("#post-btn4").removeClass("layui-btn-disabled");
    }
  });
  $("#if-forget").on("keyup", function (e) {
    var phone3 = $(".phone-ipt5").val();
    var psw3 = $("#psw5").val();
    if (phone3 != "" && psw3 != "") {
      $("#next-step").addClass("color-trans");
      $("#next-step").removeClass("layui-btn-disabled");
    }
  });

  // 5 手机验证码发送事件
  // 首先定义一个名为jishu的变量用来统计代表点击次数
  var jishu = 0;
  var flag = 0;
  // 5.1登陆1的验证码发送事件
  $(".send-to1").on("click", function (e) {
    var phone1 = $(".phone-ipt1").val();
    console.log(phone1);
    var count = 4;
    var count60 = 3;
    if (phone1 == "") {
      $(this).addClass("layui-btn-disabled");
      layer.open({
        title: "提示！",
        content: "请输入符合规范的手机号",
      });
    } else if (isNaN(phone1)) {
      $(this).addClass("layui-btn-disabled");
      layer.open({
        title: "提示！",
        content: "只允许输入纯数字！",
      });
    } else if (flag == 0) {
      if (jishu < 3) {
        flag = 1;
        $(".send-to1").addClass("layui-btn-disabled");
        console.log("点击了 " + ++jishu + "次<br>");
        layer.open({
          title: "提示！",
          content: "已发送验证码",
        });
        // 设置倒计时按钮样式
        var interval = null; //timer变量，控制时间
        $(".send-to1").text(count + "秒倒计时");
        var interval = setInterval(downset, 1000);

        function downset() {
          $(".send-to1").text(count + "秒倒计时");
          $(".send-to1").addClass("color-trans");
          $(".send-to1").addClass("layui-btn-disabled");
          count--;
          if (count === -1) {
            $(".send-to1").text("重发验证码");
            clearInterval(interval);
            $(".send-to1").removeClass("color-trans");
            $(".send-to1").removeClass("layui-btn-disabled");
            flag = 0;
          }
        } //请求后台发送验证码 TODO
        //ajax获取手机验证码
        e.preventDefault();
        $.ajax({
          method: "GET",
          url: "http://139.9.143.69:8001/oauth/msm/" + phone1,
          success: function (res) {
            console.log(res);
          },
        });
      } else if (jishu == 3) {
        flag = 1;
        $(".send-to1").text(count60 + "后重发");
        $(".send-to1").addClass("layui-btn-disabled");
        var interval2 = null; //timer变量，控制时间
        var interval2 = setInterval(downset2, 1000);

        function downset2() {
          $(".send-to1").text(count60 + "秒倒计时");
          count60--;
          if (count60 === -1) {
            $(".send-to1").text("重发验证码");
            clearInterval(interval2);
            $(".send-to1").removeClass("layui-btn-disabled");
            $(".send-to1").removeClass("color-trans");
            flag = 0;
            jishu = 0;
          }
        }
      }
    }
  });
  //5.2 注册1验证码
  $(".send-to2").on("click", function (e) {
    var phone2 = $(".phone-ipt2").val();
    console.log(phone2);
    var count = 4;
    var count60 = 3;
    if (phone2 == "") {
      $(this).addClass("layui-btn-disabled");
      layer.open({
        title: "提示！",
        content: "请输入符合规范的手机号",
      });
    } else if (isNaN(phone2)) {
      $(this).addClass("layui-btn-disabled");
      layer.open({
        title: "提示！",
        content: "只允许输入纯数字！",
      });
    } else if (flag == 0) {
      if (jishu < 3) {
        flag = 1;
        $(".send-to2").addClass("layui-btn-disabled");
        console.log("点击了 " + ++jishu + "次<br>");
        layer.open({
          title: "提示！",
          content: "已发送验证码",
        });
        // 设置倒计时按钮样式
        var interval = null; //timer变量，控制时间
        $(".send-to2").text(count + "秒倒计时");
        var interval = setInterval(downset, 1000);

        function downset() {
          $(".send-to2").text(count + "秒倒计时");
          $(".send-to2").addClass("color-trans");
          $(".send-to2").addClass("layui-btn-disabled");
          count--;
          if (count === -1) {
            $(".send-to2").text("重发验证码");
            clearInterval(interval);
            $(".send-to2").removeClass("color-trans");
            $(".send-to2").removeClass("layui-btn-disabled");
            flag = 0;
          }
        } //请求后台发送验证码 TODO
        //ajax获取手机验证码
        e.preventDefault();
        $.ajax({
          method: "GET",
          url: "http://139.9.143.69:8001/oauth/msm/" + phone2,
          success: function (res) {
            console.log(res);
          },
        });
      } else if (jishu == 3) {
        flag = 1;
        $(".send-to2").text(count60 + "后重发");
        $(".send-to2").addClass("layui-btn-disabled");
        var interval2 = null; //timer变量，控制时间
        var interval2 = setInterval(downset2, 1000);

        function downset2() {
          $(".send-to2").text(count60 + "秒倒计时");
          count60--;
          if (count60 === -1) {
            $(".send-to2").text("重发验证码");
            clearInterval(interval2);
            $(".send-to2").removeClass("color-trans");
            $(".send-to2").removeClass("layui-btn-disabled");
            flag = 0;
            jishu = 0;
          }
        }
      }
    }
  });
  // 5.3注册2验证码
  $(".send-to3").on("click", function (e) {
    var phone3 = $(".phone-ipt3").val();
    var count = 4;
    var count60 = 3;
    if (phone3 == "") {
      $(this).addClass("layui-btn-disabled");
      layer.open({
        title: "提示！",
        content: "请输入符合规范的手机号",
      });
    } else if (isNaN(phone3)) {
      $(this).addClass("layui-btn-disabled");
      layer.open({
        title: "提示！",
        content: "只允许输入纯数字！",
      });
    } else if (flag == 0) {
      if (jishu < 3) {
        flag = 1;
        $(".send-to3").addClass("layui-btn-disabled");
        console.log("点击了 " + ++jishu + "次<br>");
        layer.open({
          title: "提示！",
          content: "已发送验证码",
        });
        // 设置倒计时按钮样式
        var interval = null; //timer变量，控制时间
        $(".send-to3").text(count + "秒倒计时");
        var interval = setInterval(downset, 1000);

        function downset() {
          $(".send-to3").text(count + "秒倒计时");
          $(".send-to3").addClass("color-trans");
          $(".send-to3").addClass("layui-btn-disabled");
          count--;
          if (count === -1) {
            $(".send-to3").text("重发验证码");
            clearInterval(interval);
            $(".send-to3").removeClass("color-trans");
            $(".send-to3").removeClass("layui-btn-disabled");
            flag = 0;
          }
        } //请求后台发送验证码 TODO
        //ajax获取手机验证码
        e.preventDefault();
        $.ajax({
          method: "GET",
          url: "http://139.9.143.69:8001/oauth/msm/" + phone3,
          success: function (res) {
            console.log(res);
          },
        });
      } else if (jishu == 3) {
        flag = 1;
        $(".send-to3").text(count60 + "后重发");
        $(".send-to3").addClass("layui-btn-disabled");
        var interval2 = null; //timer变量，控制时间
        var interval2 = setInterval(downset2, 1000);

        function downset2() {
          $(".send-to3").text(count60 + "秒倒计时");
          count60--;
          if (count60 === -1) {
            $(".send-to3").text("重发验证码");
            clearInterval(interval2);
            $(".send-to3").removeClass("layui-btn-disabled");
            $(".send-to3").removeClass("color-trans");
            flag = 0;
            jishu = 0;
          }
        }
      }
    }
  });
  // 5.4找回密码验证码
  $(".send-to5").on("click", function (e) {
    // $('#layui-layer-shade').show();
    // $('#if-forget').hide();
    // $('#if-reset').show();
    var phone5 = $(".phone-ipt5").val();
    var count = 4;
    var count60 = 3;
    if (phone5 == "") {
      $(this).addClass("layui-btn-disabled");
      layer.open({
        title: "提示！",
        content: "请输入符合规范的手机号",
      });
    } else if (isNaN(phone5)) {
      $(this).addClass("layui-btn-disabled");
      layer.open({
        title: "提示！",
        content: "只允许输入纯数字！",
      });
    } else if (flag == 0) {
      if (jishu < 3) {
        flag = 1;
        $(".send-to5").addClass("layui-btn-disabled");
        console.log("点击了 " + ++jishu + "次<br>");
        layer.open({
          title: "提示！",
          content: "已发送验证码",
        });
        // 设置倒计时按钮样式
        var interval = null; //timer变量，控制时间
        $(".send-to5").text(count + "秒倒计时");
        var interval = setInterval(downset, 1000);

        function downset() {
          $(".send-to5").text(count + "秒倒计时");
          $(".send-to5").addClass("color-trans");
          $(".send-to5").addClass("layui-btn-disabled");
          count--;
          if (count === -1) {
            $(".send-to5").text("重发验证码");
            clearInterval(interval);
            $(".send-to5").removeClass("color-trans");
            $(".send-to5").removeClass("layui-btn-disabled");
            flag = 0;
          }
        } //请求后台发送验证码 TODO
        //ajax获取手机验证码
        e.preventDefault();
        $.ajax({
          method: "GET",
          url: "http://139.9.143.69:8001/oauth/msm/" + phone5,
          data: {
            phone: phone5,
          },
          success: function (res) {
            console.log(res);
            localStorage.setItem("uid", res.data);
          },
        });
      } else if (jishu == 3) {
        flag = 1;
        $(".send-to5").text(count60 + "后重发");
        $(".send-to5").addClass("layui-btn-disabled");
        var interval2 = null; //timer变量，控制时间
        var interval2 = setInterval(downset2, 1000);

        function downset2() {
          $(".send-to5").text(count60 + "秒倒计时");
          count60--;
          if (count60 === -1) {
            $(".send-to5").text("重发验证码");
            clearInterval(interval2);
            $(".send-to5").removeClass("layui-btn-disabled");
            $(".send-to5").removeClass("color-trans");
            flag = 0;
            jishu = 0;
          }
        }
      }
    }
  });

  // 6登陆注册提交发送数据post
  // 6.1登陆1提交数据
  $("#post-btn1").on("click", function (e) {
    var phone1 = $(".phone-ipt1").val();
    var psw1 = $("#psw1").val();
    if (phone1 != "" && psw1 != "") {
      $(this).addClass("bgc-change");
      $(this).removeClass("layui-btn-disabled");
      e.preventDefault();
      $.ajax({
        method: "POST",
        url: "http://139.9.143.69:8001/oauth/login/phone",
        data: {
          phone: $(".phone-ipt1").val(),
          code: $("#psw1").val(),
        },
        success: function (res) {
          if (res.code !== 0) {
            return layer.msg("登验证码输入错误");
          }
          layer.msg("登录成功！");
          // 将登录成功得到的 token 字符串，保存到 localStorage 中
          localStorage.setItem("uid", res.data);
          // 跳转到后台主页
          location.href = "index.html";
        },
      });
    }
  });
  // 6.2登陆2提交数据
  $("#post-btn2").on("click", function (e) {
    var phone2 = $("#phone-input").val();
    var psw2 = $("#psw-input").val();
    if (phone2 != "" && psw2 != "") {
      $(this).addClass("bgc-change");
      $(this).removeClass("layui-btn-disabled");
      e.preventDefault();
      $.ajax({
        method: "POST",
        url: "http://139.9.143.69:8001/oauth/login",
        data: {
          phone: phone2,
          password: psw2,
        },
        success: function (res) {
          if (res.code !== 0) {
            return layer.msg("执行出错");
          }
          layer.msg("登陆成功！");
          // 将登录成功得到的 token 字符串，保存到 localStorage 中
          localStorage.setItem("uid", res.data);
          // 跳转到后台主页
          location.href = "index.html";
        },
      });
    }
  });
  // 6.3注册1提交数据
  $("#post-btn3").on("click", function (e) {
    var phone3 = $(".phone-ipt2").val();
    console.log(phone3);
    var psw3 = $("#psw3").val();
    console.log(psw3);
    var setname = $("#regist-psw").val();
    console.log(setname);
    if (phone3 != "" && psw3 != "" && setname != "") {
      $(this).addClass("bgc-change");
      $(this).removeClass("layui-btn-disabled");
      e.preventDefault();
      $.ajax({
        method: "POST",
        url: "http://139.9.143.69:8001/oauth/register",
        data: {
          phone: $(".phone-ipt2").val(),
          code: $("#psw3").val(),
          password: $("#regist-psw").val(),
        },
        success: function (res) {
          if (res.code !== 0) {
            return layer.msg("执行出错");
          }
          layer.msg("注册成功！");
          // 将登录成功得到的 token 字符串，保存到 localStorage 中
          localStorage.setItem("uid", res.data);
          // 跳转到后台主页
          location.href = "index.html";
        },
      });
    }
  });
  // 6.3注册2提交数据
  $("#post-btn4").on("click", function (e) {
    var phone4 = $(".phone-ipt3").val();
    var psw4 = $("#psw4").val();
    if (phone4 != "" && psw4 != "") {
      $(this).addClass("bgc-change");
      $(this).removeClass("layui-btn-disabled");
      e.preventDefault();
      $.ajax({
        method: "POST",
        url: "http://139.9.143.69:8001/oauth/login",
        data: $(this).serialize(),
        success: function (res) {
          if (res.code !== 0) {
            return layer.msg("执行出错");
          }
          layer.msg("登录成功！");
          // 将登录成功得到的 token 字符串，保存到 localStorage 中
          localStorage.setItem("uid", res.data);
          // 跳转到后台主页
          location.href = "index.html";
        },
      });
    }
  });

  // 7找回密码提交数据,跳转至重置盒子
  $("#if-forget").on("click", function (e) {
    var phone5 = $(".phone-ipt5").val();
    var psw5 = $("#psw5").val();
    if (phone5 != "" && psw5 != "") {
      $("#layui-layer-shade").show();
      $("#if-forget").hide();
      $("#if-reset").show();
      var newpsw = $("#new-psw").val();
      var renewpsw = $("#re-newpsw").val();
      if (newpsw === renewpsw) {
        e.preventDefault();
        $.ajax({
          method: "POST",
          url: "http://139.9.143.69:8001/oauth/pwd",
          data: {
            phone: phone5,
            code: psw5,
            password: renewpsw,
          },
          success: function (res) {
            if (res.code !== 0) {
              return layer.msg("执行出错");
            }
            layer.msg("登录成功！");
            // 将登录成功得到的 token 字符串，保存到 localStorage 中
            localStorage.setItem("uid", res.data);
            // 跳转到后台主页
            location.href = "index.html";
          },
        });
      }
    }
  });

  var searchRecommend = [];

  var datailsId = "";

  // 详情页面
  $("[id*=gallery-wrapper]").on("click", ".search-img-hover", function () {
    // if (sessionStorage.getItem('status') === '401') return
    // console.log($(this).attr('id'));
    // $.ajax({
    //   method: 'GET',
    //   url: 'http://139.9.143.69:8001/materials/' + $(this).attr('id'),
    //   success: function (res) {
    //     console.log(res);
    //   }
    // })

    $(".details").show();
    window.scroll(0, 0);
    if ($(this)[0].dataset.id) {
      datailsId = $(this)[0].dataset.id;
      // 获取作品详情
      $.get(
        "http://139.9.143.69:8001/materials/" + $(this)[0].dataset.id,
        function (res) {
          detailsName = res.data.name;
          console.log(res, 123);
          $(".datails-text h4").text(res.data.name);
          $(".datails-mrange").text(res.data.copyright.mrange);
          $(".datails-filetype").text(res.data.filetype);
          $(".datails-spec").text(res.data.source_size);
          $(".datails-img img").attr("src", res.data.show_image);
          $(".datails-author i").text(res.data.author);
          $(".datails-Browsing-data").text(
            "浏览次数：" + res.data.numInfo.visitNum
          );
          $(".datails-Download-data").text(
            "下载次数：" + res.data.numInfo.downloadNum
          );
        }
      );
      // 获取相似推荐
      $.get(
        "http://139.9.143.69:8001/materials/recommends/" +
          $(this)[0].dataset.id,
        function (res) {
          console.log(res);
          for (
            var flag = 0;
            flag < (res.data.rows.length >= 8 ? 8 : res.data.rows.length);
            flag++
          ) {
            searchRecommend.push(`<article class="white-panel">
          <img src="${res.data.rows[flag].show_image}" class="thumb">
          <div class="search-img-hover">
              <a class="search-img-download" data-id = ${res.data.rows[flag].id}>免 费 下 载</a>
          </div>
        </article>`);
          }
          $("#gallery-wrapper2").html(searchRecommend.join(""));
          detailsFlag = 0;
          searchRecommend.splice(0, searchRecommend.length);
          $("#gallery-wrapper2").pinterest_grid({
            no_columns: 4,
            padding_x: 15,
            padding_y: 15,
            // margin_bottom: 50,
            single_column_breakpoint: 0,
          });
          $(window).resize();
        }
      );
    }
    $(window).resize();
  });
  $(".datails-close").on("click", function () {
    $(".details").hide();
    $(window).resize();
    detailsFlag = 1;
  });

  var detailsName = "";
  var detailsLink = $("#datails-download-none")[0];

  // 下载
  $("body").on("click", ".datails-download", function () {
    // console.log(1);
    if (sessionStorage.getItem("status") === "401") {
      $(".details").hide();
      $("#login").click();
      return;
    }
    $.ajax({
      method: "POST",
      url: "http://139.9.143.69:8001/usercenter/download/105",
      headers: {
        uid: localStorage.getItem("uid"),
      },
      success: function (res) {
        console.log(res);
        detailsLink.href = res.data.split("8080")[1];
        console.log(detailsLink.href);
        detailsLink.download = detailsName;
        console.log(detailsName);
        detailsLink.click();
        // location.href = res.data
        // $('.datails-download')[0].href = res.data
        // var imgURL = URL.createObjectURL(res.data)
        // console.log(imgURL);
      },
    });
  });
});
