$(function () {
	var storageAPI = $.fn.yunyeStorage,
		saveData = function () {
			function parseStyle(string) {
				if(!string)return;
				var atrributes = string.split(";");
				var returns = {};
				for (var i in atrributes) {
					if (i == atrributes.length - 1)return returns;
					var key = $.trim(atrributes[i].split(":")[0]),
						value = $.trim(atrributes[i].split(":")[1]);
					returns[key] = value;
				}
			   
			}
			/*去掉海报元素的编辑控件-zj*/
		$('.yunye-template').attr('data-page-id',
		yunyeEditorGlobal.posterPageId);
			$('.cnd-element').removeClass('active');
			$('.text-element').removeClass('text-element-act');
			$('.ele-rotate-ctrl').remove();
			/*为海报模板上的所有元素添加transform兼容-zj*/
			$('.cnd-element').each(function(){
				var _this = $(this);
				var rotate = _this.attr('data-rotate');
				var scale = _this.attr('data-scale');
				var tranf = '';
				if(rotate){
					rotate = parseFloat(rotate).toFixed(2);
					tranf += 'rotate('+rotate+'deg) ';
				}
				if(scale){
					tranf += 'scale('+scale+')';
				}
				if(tranf){
					setDomTranStyle(_this,tranf);
				}
			});

			$(".change-template-layout").remove();
			storageAPI.setHtml(".yunye-template");
			//电话手机邮箱
			if(!!$('#phoneInput').val())storageAPI.setHead("phone", $('#phoneInput').val());
			if(!!$('#mobileInput').val())storageAPI.setHead("mobile", $('#mobileInput').val());
			if(!!$('#emailInput').val())storageAPI.setHead("email", $('#emailInput').val());
			//logo
			storageAPI.setHead("logo_title",$('.header-logo h2').html());
			storageAPI.setHead("logo_img",$('.header-logo img').attr("src"));
			if( !!$('.header-logo h2').html().trim() ){
				storageAPI.setHead("logoTitleType","text");
			}else{
				storageAPI.setHead("logoTitleType","image");
			}
			storageAPI.setCss(".header", parseStyle($('.header').attr("style")));
			storageAPI.setCss(".header-logo h2", parseStyle($('.header-logo h2').attr("style")));
			storageAPI.setCss(".header-logo img", parseStyle($('.header-logo img').attr("style")));

			if ($('#logo_title').attr("style"))storageAPI.setCss("logo_title", parseStyle($('#logo_title').attr("style")));
			storageAPI.setHead("unique_name", $('#logo_title').html());
			if ($('#short_description').attr("style"))storageAPI.setCss("#short_description", parseStyle($('#short_description').attr("style")));
			storageAPI.setHead("short_description", $('#short_description').html());
			//日历周期性
			var lifetime = yunyeEditorGlobal.lifetime;
			var inputs = $(".weekly input");
			for (var i = 0; i < (inputs.length) / 2; i++) {
				var weekName = (i == 6) ? "Sunday" : (i === 0) ? "Monday" : (i == 1) ? "Tuesday" : (i == 2) ? "Wednesday" : (i == 3) ? "Thursday" : (i == 4) ? "Friday" : "Saturday",
					info = lifetime.lifetime_weekly[weekName];
				info.start = inputs.eq(i * 2).val();
				info.end = inputs.eq(i * 2 + 1).val();
				info.enabled = $(".weekly td:eq(" + (i * 6 + 4) + ")").hasClass("off") ? 0 : 1;
				if(!info.enabled){
					delete info.start;
					delete info.end;
				}
			}
			storageAPI.setHead("lifetime", lifetime);
			storageAPI.setHead("updated_at", yunyeEditorGlobal.updated_at);
		};

	var setDomTranStyle = function(ele,value){
			var csobj={};
			var csss = ele.attr('style');
			csss = csss.substr(0,csss.length-1);
			csss = csss.split(';');
			for(var i=0;i<csss.length;i++){
				var sa= csss[i].split(':');
				csobj[sa[0]]=sa[1];
			}
			csobj['transform']=value;
			csobj['-webkit-transform']=value;
			csobj['-moz-transform']=value;
			csobj['-ms-transform']=value;
			csobj['-o-transform']=value;
			csss = JSON.stringify(csobj);
			csss = csss.replace(/","/g,';');
			csss = csss.substr(1,csss.length-2);
			csss = csss.replace(/"/g,'');
			csss += ';';
			ele.attr('style',csss);
		};

    var saveDataCallback = function(){
        $.fn.yyTools.mask();
        yyAlert("保存成功");
    };

    var postSaveData = function(callback){
        $.fn.yyTools.mask(1);
		try{
			saveData();
		}catch (e){
			$.fn.yyTools.mask();
			yyAlert("缓存数据保存失败，暂时无法提交！");
			if(console){
                console.log(e);
            }
			return;
		}
		var full_json = JSON.stringify(storageAPI.getPosterData());
		var url = yunyeEditorGlobal.API.save.format(
			yunyeEditorGlobal.posterId
		);
		$.ajax({
			type: 'PATCH',
			dataType: 'json',
			data: {"data": full_json},
			url: url,
			success: function (data) {
				callback();
			},
			error: function (xhr, status, statusText) {
                $.fn.yyTools.mask();
                yyAlert("保存失败，服务器内部错误");
			}
		});
    };

    var copyPageCallback = function(){
        $("body").changeTemplate(
            "destroy"
        ).changeTemplate(
            "copy"
        );
    };

	$(".back-to-home").click(function () {
		var url = $(this).data("url");
		yyConfirm("您确定要退出海报编辑吗？<br>确定后将自动保存已编辑的数据！", function () {
			try{
				//saveData();
			}catch(e){}
			window.location.href = url;
		});
	});

    $('.btn-page').registerPopUp({
		id: 'dpw_btn_page',
		offsetXPercent: 50,
		offsetYPercent: 50,
		offsetY: 30,
		arrowOffset: 30,
		orientation: 0,
		list: [
			{
				icon: "glyphicon glyphicon-file",
				text: "新增页面",
				callback: function () {
					if (!$.fn.yunyeStorage) {
						yyAlert("无法继续操作，需要yunyeStorage");
						return false;
					}
                    postSaveData(function () {
                        $.fn.yyTools.mask();
                        $("body").changeTemplate(
                            "destroy"
                        ).changeTemplate({
                                "target": "create",
                                "initAfter": function () {
                                    $("#changeTemplatesList").css('height', "70%");
                                }
                            });
                    });
				}
			},
			{
				icon: "glyphicon glyphicon-duplicate",
				text: "复制页面",
				callback: function () {
                    if (!$.fn.yunyeStorage) {
                        yyAlert("无法继续操作，需要yunyeStorage");
                        return false;
                    }
                    yyConfirm("您确定要复制当前页面吗？", function () {
                            $.fn.yyTools.mask(1);
                            postSaveData(copyPageCallback);
                        },
                        {
                            'okText': "确定",
                            'cancelText': "取消"
                        }
                    );
				}
			},
            {
				icon: "glyphicon glyphicon-retweet",
				text: "切换页面",
				callback: function () {
                    postSaveData(function () {
                        $("body").changeTemplate(
                            "destroy"
                        ).changeTemplate(
                            "showPageList", {
                                "target": "showPageList",
                                "initAfter": function () {
                                    $("#changeTemplatesList").css('height', "70%");
                                }
                            }
                        );
                    });
				}
			}
		]
	});

	$(".btn.btn-save").on("click", function () {
        postSaveData(saveDataCallback);
	});

	$(".btn.btn-post").on("click", function () {
		$.fn.yyTools.mask(1);
		try{
			saveData();
		}catch (e){
			$.fn.yyTools.mask();
			yyAlert("待保存数据处理失败，暂时无法发布！");
			console.log(e);
			return;
		}

		var full_json = JSON.stringify(storageAPI.getPosterData()),
			api = yunyeEditorGlobal.API;
		var url = api.publish.format(yunyeEditorGlobal.posterId);
		$.ajax({
			type: 'PATCH',
			dataType: 'json',
			data: {"data": full_json},
			url: url,
			success: function (data) {
				$.fn.yyTools.mask();
				yyConfirm(
					"发布成功！<br>您需要查看发布的海报吗？",
					function(){
						window.location.href = api.show.format(
							yunyeEditorGlobal.posterId
						);
					},
					{
						'okText':'查看',
				'cancelText':'不查看'
					}
				);
			},
			error: function (xhr, status, statusText) {
				if (xhr.status == 500) {
					$.fn.yyTools.mask();
					yyAlert("发布失败，服务器内部错误");
				}
			}
		})
	});

	window.onunload = function (event) {
		saveData();
	}
});