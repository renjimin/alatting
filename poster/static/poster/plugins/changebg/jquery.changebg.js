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
                    url: '/api/v1/poster/system/background',
                    success: function (data) {
                        // ss= data;
                        console.log(data);
                        var cbox= '<div class="system-item"><div><h3>系统背景</h3><i id = "closebg" class="glyphicon glyphicon-remove-circle"></i></div><ul>';
                        for(var i=0;i<data.length;i++){
                            var img = data[i].thumbnail_url;
                            cbox += '<li class="item-system" data-img="'+data[i].image_url+'"><img src="'+img+'"></li>';
                        }
                        cbox += '</ul></div>';
                        bimg.append(cbox);

                    },
                    error:function(data){

                    }
                });

            }else{
                bimg.children('.system-item').fadeIn(200);
            }
            var s  = this.options;
            var ele = this.$element;
            var callBack_Selected =this.callBack;
            bimg.off('click','.item-system').on('click','.item-system',function(){
                    var img = $(this).attr('data-img');
                    $('.item-system').css({ 
                        'opacity':'.5',
                        'border': '3px solid rgba(0,0,0,0)'
                    });
                    $(this).css({
                        'opacity':'1',
                        'border': '3px solid #01a1ef'
                    })
                callBack_Selected(ele,img);
            });
            bimg.on('touchstart', '#closebg',function(){
                    $(".system-item").fadeOut(200);
            });               
        }

    //在插件中使用doChangeBkg对象
    $.fn.bgselect = function(opt,callBack_Selected){
        //创建doChangeBkg的实体
        var doChangeBk = new doChangeBkg(this, opt,callBack_Selected);
        doChangeBk.init();
    }
})(jQuery, window, document);