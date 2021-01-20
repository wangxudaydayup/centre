$(function () {
  // 初始化瀑布流及功滚动条插件
  $("#gallery-wrapper").pinterest_grid({
    no_columns: 4,
    padding_x: 40,
    padding_y: 15,
    // margin_bottom: 50,
    single_column_breakpoint: 0
  });
  $("#gallery-wrapper2").pinterest_grid({
    no_columns: 4,
    padding_x: 15,
    padding_y: 15,
    // margin_bottom: 50,
    single_column_breakpoint: 0
  });
});
// 头部三级分类
var ficHtml = [];
var linShi = [];
var linShi2;
var linShi2Flag = 0;
var materialsLeve = [];
$.get("http://139.9.143.69:8001/materials/categorys/level/1", function (res) {
  if (res.flag) {
    for (var i = 0; i < res.data.length; i++){
      materialsLeve.push(res.data[i].id);
      linShi.push($('.fic-text>li')[i + 1].querySelector('a span'));
      linShi[i].innerText = res.data[i].name;
      // $.get("http://139.9.143.69:8001/materials/categorys/" + res.data[i].id, function (res2) {
      //   if (res2.flag) {
      //     for (var toFlag = 0; toFlag < res2.data[0].categoryList.length; toFlag++){
      //       ficHtml.push(`<li><a href="javascript:;">${res2.data[0].categoryList[toFlag].name}</a></li>`)
      //     }
      //     linShi2 = $(".fic-text-menu")[linShi2Flag];
      //     linShi2Flag++;
      //     $(linShi2).html(ficHtml.join(''));
      //   }
      //   ficHtml.splice(0, ficHtml.length);
      // })
      $.ajax({
        method: 'GET',
        url: 'http://139.9.143.69:8001/materials/categorys/' + res.data[i].id,
        async: false,
        success: function (res2) {
          if (res2.flag) {
            for (var toFlag = 0; toFlag < res2.data[0].categoryList.length; toFlag++){
              ficHtml.push(`<li><a href="javascript:;">${res2.data[0].categoryList[toFlag].name}</a></li>`)
            }
            linShi2 = $(".fic-text-menu")[linShi2Flag];
            linShi2Flag++;
            $(linShi2).html(ficHtml.join(''));
          }
          ficHtml.splice(0, ficHtml.length);
        }
      })
    }
    setTimeout(function () {
      $($('.fic-text')[1]).html($($('.fic-text')[0]).html());
    }, 1000)
  }
})

// 搜索框功能
$(function () {
  var searchHtml = [];
  var searchRecommend = [];
  var detailsFlag = 1;
  var materialsFlage = 0;
  //新增按分类搜索需求 
  $('.func-search-class ul li').on('click', function () {
    $('.func-search-class span').html($(this).html()+`<i class="layui-icon" style="font-size: 7px; margin-left: 10px;">&#xe61a;</i>`);
    materialsFlage = $(this)[0].getAttribute("data-falg");
  })

  $(".qtw-button").on("click", function () {
    if ($("#search-text").val().trim()) {
      location.assign("?search=" + $("#search-text").val() + '&catId=' + materialsLeve[materialsFlage]);
    } else if ( $("#search-text2").val().trim()) {
      location.assign("?search=" + $("#search-text2").val() + '&catId=' + materialsLeve[materialsFlage]);
    }
  })
  $("#search-text").on("keyup", function (e) {
    if (e.keyCode == 13 && $("#search-text").val().trim()) {
      location.assign("?search=" + $("#search-text").val() + '&catId=' + materialsLeve[materialsFlage]);
    } else if (e.keyCode == 13 && $("#search-text2").val().trim()) {
      location.assign("?search=" + $("#search-text2").val() + '&catId=' + materialsLeve[materialsFlage]);
    }
  })
  $('#search-text').on('click', function () {
    $(this).attr('placeholder', '');
  })
  // 渲染搜索框数据
  var searchText = decodeURI(location.search);
  var categoryId = searchText;
  var locaSearch = [];
  if (searchText) {
    locaSearch = searchText.split("&");
    searchText = locaSearch[0];
    searchText = searchText.replace('?search=', '');
    categoryId = locaSearch[1];
    categoryId = categoryId.replace('catId=', '');
    $("#search-text").val(searchText);
    searchFun(searchText, 1 ,categoryId);
  }
  // 渲染分类选择搜索
  switch (categoryId) {
    case '1':
      $('.func-search-class span').html("摄影" + `<i class="layui-icon" style="font-size: 7px; margin-left: 10px;">&#xe61a;</i>`);
      break;
    case '2':
      $('.func-search-class span').html("设计模板" + `<i class="layui-icon" style="font-size: 7px; margin-left: 10px;">&#xe61a;</i>`);
      break;
    case '3':
      $('.func-search-class span').html("创意背景" + `<i class="layui-icon" style="font-size: 7px; margin-left: 10px;">&#xe61a;</i>`);
      break;
    case '4':
      $('.func-search-class span').html("插画" + `<i class="layui-icon" style="font-size: 7px;margin-left: 10px;">&#xe61a;</i>`);
      break;
    case '5':
      $('.func-search-class span').html("免扣元素" + `<i class="layui-icon" style="font-size: 7px; margin-left: 10px;">&#xe61a;</i>`);
      break;
    case '6':
      $('.func-search-class span').html("办公文档" + `<i class="layui-icon" style="font-size: 7px; margin-left: 10px;">&#xe61a;</i>`);
      break;
    default:
      $('.func-search-class span').html("设计模板" + `<i class="layui-icon" style="font-size: 7px; margin-left: 10px;">&#xe61a;</i>`);
  }

  // 页码切换功能
  $("#left-page").on('click', function () {
    console.log($('#page').val(),$('.totalPage').html());
    if ((parseInt($('#page').val()) - 1 != 0) && (parseInt($('#page').val()) - 1 <= $('.totalPage').html())) {
      var SpagNum = parseInt($('#page').val()) - 1;
      searchFun(searchText, SpagNum ,categoryId);
    }
  })
  $('#right-page').on('click', function () {
    if ((parseInt($('#page').val()) + 1 != 0) && (parseInt($('#page').val()) + 1 <= $('.totalPage').html())) {
      var SpagNum = parseInt($('#page').val()) + 1;
      console.log(SpagNum);
      searchFun(searchText, SpagNum ,categoryId);
    }
  })
  $('#page').on('keyup', function (e) {
    console.log(123);
    if (e.keyCode == 13 && (!parseInt($('#page').val()) <= 0) && parseInt($('#page').val()) < $('.totalPage').html()) {
      var SpagNum = parseInt($('#page').val());
      searchFun(searchText, SpagNum ,categoryId);
    }
  })
  // 搜索函数
  function searchFun(searchText,SpagNum,cateId) {
    $.get("http://139.9.143.69:8001/materials/search", {
      name: searchText, pageNum: SpagNum, pageSize: 48,category_id: cateId
    }, function (res) {
        console.log(res);
      for (var flag = 0; flag < res.data.rows.length; flag++) {
        searchHtml.push(`<article class="white-panel">
          <img src="${res.data.rows[flag].show_image}" class="thumb">
          <div class="search-img-hover">
            <span class="search-img-label">${res.data.rows[flag].category1_name}</span>
            <span class="search-img-Collection"><i>${res.data.rows[flag].favourite_num}</i><a href="javascript:;" class="layui-icon layui-icon-heart favourite_num" style="font-size: 20px;color: #ffff;" data-id = ${res.data.rows[flag].id}></a></span>
            <a class="search-img-download" data-id = ${res.data.rows[flag].id}>查 看 详 情</a>
          </div>
        </article>`)
      };
      $('#page').val(res.data.pageNum);
      $("#searchTotal").text(res.data.total);
      $("#gallery-wrapper").html(searchHtml.join(""));
      $(".totalPage").text(res.data.totalPage);
        searchHtml.splice(0, searchHtml.length);
        $("#gallery-wrapper").pinterest_grid({
          no_columns: 4,
          padding_x: 40,
          padding_y: 15,
          // margin_bottom: 50,
          single_column_breakpoint: 0
        });
      $(window).resize();
    })
  }
  var datailsId = '';
  var detailsName = '';
  var detailsLink = $('#datails-download-none')[0];
  // 详情页面
  $('#gallery-wrapper').on("click", ".search-img-download", function () {
    $('.details').show();
    window.scroll(0, 0);
    if ($(this)[0].dataset.id) {
      datailsId = $(this)[0].dataset.id;
      // 获取作品详情
      $.get('http://139.9.143.69:8001/materials/' + $(this)[0].dataset.id, function (res) {
        detailsName = res.data.name;
        console.log(res, 123);
        $(".datails-text h4").text(res.data.name);
        $(".datails-mrange").text(res.data.copyright.mrange);
        $(".datails-filetype").text(res.data.filetype);
        $(".datails-spec").text(res.data.source_size);
        $(".datails-img img").attr("src", res.data.show_image);
        $('.datails-author i').text(res.data.author);
        $('.datails-Browsing-data').text("浏览次数：" + res.data.numInfo.visitNum);
        $('.datails-Download-data').text('下载次数：' + res.data.numInfo.downloadNum);
        $('#favourite').attr('data-id', datailsId);
      });
      // 获取相似推荐
      $.get('http://139.9.143.69:8001/materials/recommends/' + $(this)[0].dataset.id, function (res) {
        console.log(res);
        for (var flag = 0; flag < (res.data.rows.length>=8?8:res.data.rows.length); flag++) {
          searchRecommend.push(`<article class="white-panel">
          <img src="${res.data.rows[flag].show_image}" class="thumb">
          <div class="search-img-hover">
              <a class="search-img-download" data-id = ${res.data.rows[flag].id}>免 费 下 载</a>
          </div>
        </article>`)
        }
        $('#gallery-wrapper2').html(searchRecommend.join(''));
        detailsFlag = 0;
        searchRecommend.splice(0, searchRecommend.length);
        $("#gallery-wrapper2").pinterest_grid({
          no_columns: 4,
          padding_x: 15,
          padding_y: 15,
          // margin_bottom: 50,
          single_column_breakpoint: 0
        });
        $(window).resize();
      })
    }
    $(window).resize();
  })
  $('.datails-close').on('click', function () {
    $('.details').hide();
    $(window).resize();
    detailsFlag = 1;
  })
  // 相似推荐详情
  $('#gallery-wrapper2').on("click", ".search-img-download", function () {
    window.scroll(0, 0);
    if ($(this)[0].dataset.id) {
      datailsId = $(this)[0].dataset.id;
      // 获取作品详情
      $.get('http://139.9.143.69:8001/materials/' + $(this)[0].dataset.id, function (res) {
        $(".datails-text h4").text(res.data.name);
        $(".datails-mrange").text(res.data.copyright.mrange);
        $(".datails-filetype").text(res.data.filetype);
        $(".datails-spec").text(res.data.source_size);
        $(".datails-img img").attr("src", res.data.show_image);
        $('.datails-author i').text(res.data.author);
        $('.datails-Browsing-data').text("浏览次数：" + res.data.numInfo.visitNum);
        $('.datails-Download-data').text('下载次数：' + res.data.numInfo.downloadNum);
        $('#favourite').attr('data-id', datailsId);
      });
      // 获取相似推荐
      $.get('http://139.9.143.69:8001/materials/recommends/' + $(this)[0].dataset.id, function (res) {
        for (var flag = 0; flag < res.data.rows.length; flag++) {
          searchRecommend.push(`<article class="white-panel">
          <img src="${res.data.rows[flag].show_image}" class="thumb">
          <div class="search-img-hover">
              <a class="search-img-download" data-id = ${res.data.rows[flag].id}>免 费 下 载</a>
          </div>
        </article>`)
        }
        $('#gallery-wrapper2').html(searchRecommend.join(''));
        searchRecommend.splice(0, searchRecommend.length);
        detailsFlag = 0;
        $("#gallery-wrapper2").pinterest_grid({
          no_columns: 4,
          padding_x: 15,
          padding_y: 15,
          // margin_bottom: 50,
          single_column_breakpoint: 0
        });
        $(window).resize();
      })
    }
    $(window).resize();
  })
  // 添加收藏功能
  $("#gallery-wrapper").on("click", ".favourite_num", function() {
    var favouriteThis = $(this);
    $.ajax({
      method: 'POST',
      url: 'http://139.9.143.69:8001/usercenter/works/favorites/' + $(this)[0].dataset.id,
      headers: {
        uid: localStorage.getItem('uid')
      },
      success: function (res) {
        if (res.flag) {
          $(favouriteThis).siblings('i').html(parseInt($(favouriteThis).siblings('i').html()) + 1);
          $("#gallery-wrapper .favourite_num").removeClass('layui-icon-heart');
          $("#gallery-wrapper .favourite_num").addClass("layui-icon-heart-fill");
          $("#gallery-wrapper .favourite_num").css('color', 'red');
        }
      }
    })
  })
  // 详情页面的下载按钮
  $('.datails-download').on('click', function () {
    if (sessionStorage.getItem('status') === '401') return
    if (datailsId) {
      $.ajax({
        method: 'POST',
        url: 'http://139.9.143.69:8001/usercenter/download/'+datailsId,
        headers: {
          uid: localStorage.getItem('uid')
        },
        // dataType: "text",
        success: function (res) {
          console.log(res);
          if (res.code !== 0) {
            return console.log(下载链接返回失败);
          }
          console.log(res.data);
		      detailsLink.href = res.data.split("8080")[1];
			    console.log(detailsLink.href );
          detailsLink.download = detailsName;
          detailsLink.click();
        }
      })
    }
  })
  // 下滑搜索框
  var resFlag = false;
  $(window).scroll(function () {
    if ($(window).scrollTop() > 500 && detailsFlag) {
      $(".fication-slide").css("top", "0px");
    } else {
      $(".fication-slide").css("top", "-145px");
    };
  })
  // 添加收藏功能
  $("#favourite").on("click",function() {
    // var favouriteThis = $(this);
    $.ajax({
      method: 'POST',
      url: 'http://139.9.143.69:8001/usercenter/works/favorites/' + $(this)[0].dataset.id,
      headers: {
        uid: localStorage.getItem('uid')
      },
      success: function (res) {
        console.log(res);
        if (res.flag) {
          $('#favourite img').attr('src','img/图层\ 57\ 拷贝.png')
        }
      }
    })
  })
  // 显示更多按钮
  $('.search-img-more').on('click', function () {
    if (parseInt($('#gellery-wrapper1-box').css('height')) < parseInt($('#gallery-wrapper').css('height'))) {
      if (parseInt($('#gallery-wrapper').css('height')) > 2830) {
        $('#gellery-wrapper1-box').css('height', (parseInt($('#gallery-wrapper').css('height')) + 120) + 'px');
      } else ($('#gellery-wrapper1-box').css('height', (parseInt($('#gallery-wrapper').css('height')) + 65) + 'px'))
    }
    $(this).css('cursor', 'not-allowed');
  })
  $('.datails-more').on('click', function () {
    if (parseInt($('#gellery-wrapper2-box').css('height')) < parseInt($('#gallery-wrapper2').css('height'))) {
      $('#gellery-wrapper2-box').css('height', parseInt($('#gallery-wrapper2').css('height'))+'px');
    }
    $(this).css('cursor', 'not-allowed');
  })
  $(window).resize();
  setTimeout(function () {
    $(window).resize();
  }, 1500);
})
