;(function($, window, document,undefined) {
    var doChangeBkg = function(ele,opt,callback) {
        this.$element = ele;
        this.callBack = callback;
        this.defaults = {
            // 'bgkimg':imglist,
            'background-size': 'cover',
            'background-repeat': 'no-repeat',
            'background-image': true,
            'bimg':'bimg'
        },
         this.options = $.extend({}, this.defaults, opt)
    }
    //定义doChangeBkg的方法
    doChangeBkg.prototype.init = function() {
            //var bimg = $('#'+this.options.bimg);
            var bimg = $("body");
            var bk = bimg.children('.system-item').length;
            if(!bk){
                $.ajax({
                    type: 'GET',
                    // async:false,
                    url: 'http://192.168.14.128:8080/api/v1/poster/system/background',
                    success: function (data) {
                        // ss= data;
                        console.log(data);
                        var cbox= '<div class="system-item"><div ><h3>系统图案</h3><i id = "closebg" class="glyphicon glyphicon-remove"></i></div><ul>';
                        for(var i=0;i<data.length;i++){
                            var img = "http://192.168.14.128:8080"+data[i].image_url;
                            cbox += '<li class="item-system" data-img="'+img+'"><img src="'+img+'"></li>';
                        }
                        cbox += '</ul></div>';
                        bimg.append(cbox);

                    },
                    error:function(data){

                    }
                });

            }
            var s  = this.options;
                var ele = this.$element;
                var callBack_Selected =this.callBack;
                bimg.on('click','.item-system',function(){
                var img = $(this).attr('data-img');

                callBack_Selected(ele,img);
            });
        	$("#closebg").click(function(){
                $(".system-item").hide();
            })
        }

    //在插件中使用doChangeBkg对象
    $.fn.bgselect = function(opt,callBack_Selected){
        //创建doChangeBkg的实体
        var doChangeBk = new doChangeBkg(this, opt,callBack_Selected);
        doChangeBk.init();
    }
})(jQuery, window, document);