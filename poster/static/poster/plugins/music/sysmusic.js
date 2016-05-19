;(function($, window, document,undefined) {
    var sysMusic = function(ele,opt,callback) {
        this.$element = ele;
        this.callBack = callback;
        this.defaults = {},
         this.options = $.extend({}, this.defaults, opt)
    }
    //定义sysMusic的方法
    sysMusic.prototype.init = function() {
            var smusic = $("body");
            var sm = smusic.children('.system-item').length;
            if(!sm){
                $.ajax({
                    type: 'GET',
                    url: '/api/v1/poster/system/background',
                    success: function (data) {
                        console.log(data);
                        var cbox= '<div class="system-item"><div ><h3>系统音乐</h3></div><ul>';
                        for(var i=0;i<data.length;i++){
                            var sysm = data[i].thumbnail_url;
                            cbox += '<li class="item-system" data-img="'+data[i].image_url+'"><audio src="'+sysm+'"></audio></li>';
                        }
                        cbox += '</ul></div>';
                        smusic.append(cbox);

                    },
                    error:function(data){

                    }
                });

            }else{
                smusic.children('.system-item').fadeIn(200);
            }
            var s  = this.options;
                var ele = this.$element;
                var callBack_Selected =this.callBack;
                smusic.off('click','.item-system').on('click','.item-system',function(){
                var sm = $(this).attr('data-img');
                callBack_Selected(ele,img);
            });
        }

    //在插件中使用sysMusic对象
    $.fn.changeMusic = function(opt,callBack_Selected){
        //创建sysMusic的实体
        var sysmusic = new sysMusic(this, opt,callBack_Selected);
        sysmusic.init();
    }
})(jQuery, window, document);