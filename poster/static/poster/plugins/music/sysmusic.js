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
            var sm = smusic.children('.system-music').length;
            if(!sm){
                $.ajax({
                    type: 'GET',
                    url: '/api/v1/poster/system/music',
                    success: function (data) {
                        console.log(data);
                        var cbox= '<div class="system-music"><div >'+
                      '<h3>系统音乐</h3><i id = "closesmusic" class="glyphicon glyphicon-remove-circle"></i></div><ul>';
                        for(var i=0;i<data.length;i++){
                            var sysm = data[i].thumbnail_url;
                            cbox += '<li class="music-system" data-img="'+data[i].music_url+'"><span class = "musictext">'+data[i].name+'</span><span data-img="'+data[i].music_url+'" class = "musiclisten" title = "试听">试听</span><span data-img="'+data[i].music_url+'" class = "musicapp" title = "应用">应用</span></li>';
                        }
                        cbox += '</ul></div>';
                        smusic.append(cbox);

                    },
                    error:function(data){

                    }
                });

            }else{
                smusic.children('.system-music').fadeIn(200);
            }
            var s  = this.options;
                var ele = this.$element;
                var callBack_Selected =this.callBack;
                smusic.off('click','.musiclisten').on('click','.musiclisten',function(){
                    var sm = $(this).attr('data-img');
                    console.log(sm)    
                    $('.audiolink').empty().append('<audio  id = "music" autoplay></audio>');
                    $('.audiolink audio').attr("src",sm);
                    var music = document.getElementById("music"); 
                   if (music.paused) { //判读是否播放
                          music.play();//没有就播放
                   } 
                });
                 smusic.off('click','.music-system').on('click','.music-system',function(){
                    var sm = $(this).attr('data-img');
                    $('.audiolink').empty().append('<audio autoplay></audio>');
                    $('.audiolink audio').attr("src",sm);

                });               
                smusic.off('click','.musicapp').on('click','.musicapp',function(event){
                    var sm = $(this).attr('data-img');
                    event.stopPropagation();
                    callBack_Selected(ele,sm);
                })
        }

    //在插件中使用sysMusic对象
    $.fn.changeMusic = function(opt,callBack_Selected){
        //创建sysMusic的实体
        var sysmusic = new sysMusic(this, opt,callBack_Selected);
        sysmusic.init();
    }
})(jQuery, window, document);