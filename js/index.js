$(function () {
  // 搜索功能
  $('body').on('click', '.qtw-button', function () {
    var searchText = $('.search-input input').val().trim()
    if (searchText) {
      window.location.href = `/search.html?search=${searchText}&catId=${catId}`
    }
    $('.search-input input').val('')
  }).on('keyup', function (e) {
    if (e.keyCode === 13 && $('.search-input input').val().trim()) {
      $('.qtw-button').click()
    }
  })

  // 搜素下拉选择框
  $('.func-search-class').click(function () {
    $('.search-selected').show()
  }).mouseleave(function () {
    $('.search-selected').hide()
  })

  var catId = ''
  $('.search-box').on('click', '.search-selected li', function () {
    console.log($(this).text());
    $('.func-search-class span').text($(this).text())
    catId = $(this).attr('data-falg')
    $('.search-selected').hide()
  })

  // 搜索框焦点事件
  $('.search-input input').focus(function () {
    // console.log(1);
    $(this).attr('placeholder', '')
  })
  $('.search-input input').blur(function () {
    // console.log(1);
    $(this).attr('placeholder', '通 过 关 键 字 搜 索 U X D L')
  })


  //瀑布流图片渲染
  $.get(
    'http://139.9.143.69:8001/materials/choiceness/0', {
      page: 1,
      size: 30,
    },
    function (res) {
      // console.log(res.data.rows)
      // 调用 template 函数
      var htmlStr = template('pictures', res.data.rows)
      // console.log(htmlStr);
      // 渲染 HTML 结构
      $('#gallery-wrapper').html(htmlStr)
      $(window).resize();
    }
  )
  // 显示更多按钮
  $('.morr').on('click', function () {
    console.log($('#gallery-wrapper').css('height'));
    $('.selected').css({
      // 'overflow': 'visible',
      'max-height': $('#gallery-wrapper').css('height')
    })
    $(this).css({
      'background': "#ccc",
      'cursor': 'not-allowed'
    });
  })


  $('#gallery-wrapper').pinterest_grid({
    no_columns: 4,
    padding_x: 20,
    padding_y: 20,
    margin_bottom: 120,
    single_column_breakpoint: 700,
  })
  $('.search-img-download').on('click', function () {
    $('.details').show()
    window.scroll(0, 0)
    $(window).resize()
  })
  $('.datails-close').on('click', function () {
    $('.details').hide()
    $(window).resize()
  })
  $('#gallery-wrapper').pinterest_grid({
    no_columns: 4,
    padding_x: 40,
    padding_y: 15,
    // margin_bottom: 50,
    single_column_breakpoint: 0,
  })
  $('#gallery-wrapper2').pinterest_grid({
    no_columns: 4,
    padding_x: 15,
    padding_y: 15,
    // margin_bottom: 50,
    single_column_breakpoint: 0,
  })
  $('.details').hide()

  var searchRecommend = [];

  var datailsId = '';


  // 添加收藏功能
  $("#gallery-wrapper").on("click", "#favourite", function (e) {
    e.stopPropagation();
    if (sessionStorage.getItem('status') === '401') {
      layer.msg('请登陆', {
        time: 1000
      });
      $('#login').click()
      return
    }
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
        }
      }
    })
    $(this).attr('src', './img/favorite2.png');
  })

  // 详情页面
  $('[id*=gallery-wrapper]').on("click", ".search-img-hover", function () {
    console.log(1);
    // if (sessionStorage.getItem('status') === '401') return
    // console.log($(this).attr('id'));
    // $.ajax({
    //   method: 'GET',
    //   url: 'http://139.9.143.69:8001/materials/' + $(this).attr('id'),
    //   success: function (res) {
    //     console.log(res);
    //   }
    // })

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
      });
      // 获取相似推荐
      $.get('http://139.9.143.69:8001/materials/recommends/' + $(this)[0].dataset.id, function (res) {
        console.log(res);
        for (var flag = 0; flag < (res.data.rows.length >= 8 ? 8 : res.data.rows.length); flag++) {
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

  var detailsName = '';
  var detailsLink = $('#datails-download-none')[0];

  // 下载
  $("body").on("click", ".datails-download", function () {
    // console.log(1);
    if (sessionStorage.getItem('status') === '401') {
      $('.details').hide();
      $('#login').click()
      return
    }
    $.ajax({
      method: 'POST',
      url: 'http://139.9.143.69:8001/usercenter/download/105',
      headers: {
        uid: localStorage.getItem('uid')
      },
      success: function (res) {
        console.log(res);
        detailsLink.href = res.data.split("8080")[1];
        console.log(detailsLink.href);
        detailsLink.download = detailsName;
        console.log(detailsName)
        detailsLink.click();
        // location.href = res.data
        // $('.datails-download')[0].href = res.data
        // var imgURL = URL.createObjectURL(res.data)
        // console.log(imgURL);
      }
    })
  })
})