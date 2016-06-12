/**
 * Created by chulin on 16-6-8.
 */
/* 统计数据展示动画插件 */
;(function($){
    $.fn.extend({
        'staimate':function(option){
            var def = [
                {
                    color:'#16B3FD',
                    snum:100,
                    process:50,
                },
                {
                    color:'#fdda53',
                    snum:100,
                    process:50,
                },
                {
                    color:'#05cfbb',
                    snum:100,
                    process:83,
                }
            ];
            var opt = $.extend(true,[],def,option);
            var $this = this;
            var showProcess = function(context,idata,ptm){
                setTimeout(function(){
                    if(ptm<idata.process){
                        ptm++;
                        context.beginPath();
                        context.lineWidth=20;
                        context.arc(60, 60, 40, -Math.PI*0.5, -Math.PI*0.5+Math.PI*2*ptm/100, false);
                        context.strokeStyle= idata.color;
                        context.stroke();
                        showProcess(context,idata,ptm);
                    }
                },10);
            }
            $this.each(function(index){
                $(this).children('.st-cv-num').html(opt[index].snum);

                var ths = $(this).children('.canvas').get(0);
                var context = ths.getContext('2d');
                context.clearRect(0,0,120,120);
                context.beginPath();
                context.lineWidth=20;
                context.arc(60,60,40,0,Math.PI*2,false);
                context.strokeStyle = '#666769';
                context.stroke();
                showProcess(context,opt[index],0);
            });
            return $this;

        }
    })
})(jQuery);

$(function (){
    var id = $('#posterid').val();
    var curWwwPath = window.document.location.href;
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    var localhostPaht = curWwwPath.substring(0, pos);
    var pageInfo={
        id:id,
        sCont:'yunye',
        sDesc:'',
        sUrl:localhostPaht+'/mobile/poster/'+id+'/'
    };

    /* 获取海报详情信息 */
    $.ajax({
        type: 'GET',
        url: '/api/v1/poster/posters/'+id,
        success:function(data){
            $('#body-main-title').children('.title-name').html(data['unique_name']);
        },
        error: function(xhr, status,statusText){
            $('#body-main-title').children('.title-name').html('获取数据错误');
        }
    });

    /* 获取统计数据 */
    $.ajax({
        type: 'GET',
        url: '/api/v1/poster/'+id+'/statistics',
        success:function(data){
            /* 更新统计数据 */
            var std = [
                {
                    name:'favortes',
                    count:data['poster_statistics']['favorites_count'],
                    change:data['history_statistics']['favortes_count_change']
                },
                {
                    name:'views',
                    count:data['poster_statistics']['views_count'],
                    change:data['history_statistics']['views_count_change']
                },
                {
                    name:'likes',
                    count:data['poster_statistics']['likes_count'],
                    change:data['history_statistics']['likes_count_change']
                },
                {
                    name:'shares',
                    count:data['poster_statistics']['shares_count'],
                    change:data['history_statistics']['shares_count_change']
                },
                {
                    name:'fun',
                    count:data['poster_statistics']['fun_count'],
                    change:data['history_statistics']['fun_count_change']
                },
                {
                    name:'ratings',
                    count:data['poster_statistics']['ratings_count'],
                    change:data['history_statistics']['ratings_average_change']
                }
            ];
            console.log(std);
            updateStatData(std);

            /* 显示统计数据动画 */
            $('.st-cv-li').staimate([
                {
                    process:data['history_statistics']['fun_change_percent'],
                    snum:data['poster_statistics']['fun_score'],
                },
                {
                    process:data['history_statistics']['popular_change_percent'],
                    snum:data['poster_statistics']['popular_score'],
                },
                {
                    process:data['history_statistics']['credit_change_percent'],
                    snum:data['poster_statistics']['credit_score'],
                }
            ]);
        },
        error: function(xhr, status,statusText){
            yyAlert('网络错误,请稍候再试!');
        }
    });
    function updateStatData(d){
        var $info = $('.st-info-li');
        for(var i = 0;i<d.length;i++){
            var $ths= $info.filter('.st-info-'+d[i].name);
            $ths.children('.st-info-num').html(d[i].count);
            if(d[i].change == 0){
                $ths.children('.st-info-change').css('display','none');
            }else{
                $ths.children('.st-info-change').html(d[i].change);
            }
        }
    }

    /* 回到个人中心主页面 */
    $('#page-close').on('click',function(){
        location.href='/mobile/account/profile.html';
    });

    /* 收藏当前海报 */
    $('#ctrl-favorite').on('click',function(){
        var status = $(this).attr('data-fav');
        if(status == 0){
            $(this).find('.fa').css('color','#feba01');
            $(this).attr('data-fav','1');
        }else{
            $(this).find('.fa').css('color','#808080');
            $(this).attr('data-fav','0');
        }
    });
    /* 浏览海报信息 */
    $('#ctrl-view').on('click',function(){
        location.href = '/mobile/posters/'+id+'/';
    });
    /* 显示海报统计信息 */
    $('#ctrl-statistics').on('click',function(){
        location.href = '/mobile/account/posters/'+id+'/statistics.html';
    });

    /* ----分享功能模块---- */
    /* 显示分享菜单 */
    $('#ctrl-share').on('click',function(){
        showShare(true);
    });
    /* 关闭分享菜单 */
    $('#body-share').on('click',function(){
        showShare(false);
    });
    $('#share-weibo').on('click',function(e){
        e.stopPropagation();
        var surl  = encodeURIComponent(pageInfo.sUrl);
        var url = 'http://service.weibo.com/share/share.php?url='+surl+'%230-tsina-1-81561-397232819ff9a47a7b7e80a40613cfe1&title='+pageInfo.sCont+'&appkey=1343713053&searchPic=true#_loginLayer_1465027314257';
        window.open(url);
    });
    $('#share-qq').on('click',function(e){
        e.stopPropagation();
        var surl  = encodeURIComponent(pageInfo.sUrl);
        var url = 'http://connect.qq.com/widget/shareqq/index.html?url='+surl+'%230-sqq-1-12603-9737f6f9e09dfaf5d3fd14d775bfee85&title='+pageInfo.sCont+'&desc='+pageInfo.sDesc+'&summary=';
        window.open(url);
    });
    $('#share-comment').on('click',function(e){
        e.stopPropagation();
        var surl  = encodeURIComponent(pageInfo.sUrl);
        var smsCont = '我在云页上找到一个不错的海报,推荐给你看看'+surl;
        var url = 'mailto:?body='+smsCont;
        location.href=url;
    });
    $('#share-envelope').on('click',function(e){
        e.stopPropagation();
        var surl  = encodeURIComponent(pageInfo.sUrl);
        var subject = '推荐一个不错的海报给你看看';
        var body = '我在云页上找到一个不错的海报,推荐给你看看'+surl;
        var url = 'mailto:?subject='+subject+'&body='+body;
        location.href=url;
    });
    $('#share-weixin').on('click',function(e){
        e.stopPropagation();
        console.log('weixin:none');
    });
    function showShare(type){
        var chd = $('#body-share').children();
        var num = chd.length-2;
        var top = 80;
        if(type){
            $('#body-share').fadeIn(200);
            for(var i=0;i<num;i++){
                var tops  = top+80*(i+1);
                var index = i+2;
                chd.eq(index).animate({top:tops+'px'},400);
            }
        }else{
            $('#body-share').fadeOut(200);
            for(var i=0;i<num;i++){
                var index= i+2;
                chd.eq(index).animate({top:top+'px'},400);
            }
        }
    }

});