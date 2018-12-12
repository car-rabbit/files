$(function() {
  var isTest = true
  var ajaxUrlHost = isTest ? "http://api-test.chetubao.com.cn" : "http://api.chetubao.com.cn";
  var murmur = 0;
  if (window.Fingerprint2) {
    Fingerprint2.get(function(components) {
      murmur = Fingerprint2.x64hash128(
        components
          .map(function(pair) {
            return pair.value;
          })
          .join(),
        31
      );
    });
  }

  $(".m-btn").on("click", function() {
    var $form = $(this).closest(".m-form");
    var $username = $form.find('input[name="username"]').val();
    var $telphone = $form.find('input[name="telphone"]').val();
    // 姓名为1-10位中文或2-50位英文
    var usernameRe = /^(([\u4e00-\u9fa5]{1,10})|(\w{2,50}))$/;
    // 电话号码为1开头，共11位数字
    var telphoneRe = /^1\d{10}$/;
    if ($username == "") {
      // alert("请输入姓名");
      spop({
        template: '<strong style="color:red;">请输入姓名</strong>',
        style: 'warning',
        autoclose:1500,
        icon:false,
        position:"top-center"
    });
      $form.find('input[name="username"]').focus();
      return false;
    }
    if ($telphone == "") {
      // alert("请输入手机号");
      spop({
        template: '<strong style="color:red;">请输入手机号</strong>',
        style: 'warning',
        autoclose:1500,
        icon:false,
        position:"top-center"
    });
      $form.find('input[name="telphone"]').focus();
      return false;
    }
    if (!usernameRe.test($username)) {
      $form.find('input[name="username"]').focus();
      // alert("姓名格式错误");
      spop({
        template: '<strong style="color:red;">姓名格式错误</strong>',
        style: 'warning',
        autoclose:1500,
        icon:false,
        position:"top-center"
    });
      return false;
    }
    if (!telphoneRe.test($telphone)) {
      $form.find('input[name="telphone"]').focus();
      // alert("手机号格式错误");
      spop({
        template: '<strong style="color:red;">手机号格式错误</strong>',
        style: 'warning',
        autoclose:1500,
        icon:false,
        position:"top-center"
    });
      return false;
    }
    $(".m-btn")
      .attr({ disabled: true })
      .removeClass("m-btn-animation");
    $.ajax({
      url: ajaxUrlHost + "/journeyactivity/addActivity",
      type: "post",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({
        phone: $telphone,
        name: $username,
        userChannel: GetQueryString("hmsr"),
        sourceUrl: window.location.href,
        fingerprint: murmur
      }),
      success: function(data) {
        if (data.code == 100024) {
          isShowModal(true);
        } else {
          isShowModal(false);
          $(".m-btn")
            .removeAttr("disabled")
            .addClass("m-btn-animation");
        }
      },
      error: function(err) {
        isShowModal(false);
        $(".m-btn")
          .removeAttr("disabled")
          .addClass("m-btn-animation");
      }
    });
  });

  $(".m-rel").on("click", function() {
    $(".m-footer1")
      .find('input[name="username"]')
      .focus();
  });

  $('input[name="username"]').bind("focus",function(){
    $('.m-rel').css({"position":"static","bottom":0});
  }).bind("blur",function(){
    $(".m-rel").css("position","fixed")
  })

  $('input[name="telphone"]').bind("focus",function(){
    $('.m-rel').css({"position":"static","bottom":0});
  }).bind("blur",function(){
    $(".m-rel").css("position","fixed")
  })

  function isShowModal(status) {
    if (!$("#m-modal").length) {
      var imgsrc = status ? "ok.png" : "err.png";
      var html = `<div id="m-modal">
                <div class="bg"></div>
                <div class="m-modal">
                    <div class="m-modal-box">
                        <div class="m-modal-content">
                            <img src="./assets/images/${imgsrc}">
                        </div>
                        <div class="m-modal-footer">
                            <img src="./assets/images/m-close.png">
                        </div>
                    </div>
                </div>
            </div>`;
      $("body").addClass("modal-open");
      $("body").append(html);

      $(".m-modal-footer").on("click", function() {
        $("#m-modal").remove();
        $("body").removeClass("modal-open");
      });
      if (!status) {
        $(".m-modal-content").on("click", function() {
          $("#m-modal").remove();
          $("body").removeClass("modal-open");
        });
      }
    } else {
      $("#m-modal").remove();
      $("body").removeClass("modal-open");
    }
  }

  function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
    var context = "";
    if (r != null) context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined"
      ? ""
      : context;
  }
});
