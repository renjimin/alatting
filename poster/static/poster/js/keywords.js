
/**
 * Created by zhangjie on 2016/5/3.
 */
$(function(){
    /*选择关键词*/
    $('#ed-choose').on('click','.ed-choose-li',function(e){

        var ths = $(this);
        var chebox = ths.children().children();
        var cont = ths.attr('data-cont');
        var view = ths.attr('data-view');
        var id = ths.attr('data-id');
        var edcont= $('#ed-content');
        if(view == '0'){
            //多余五个关键词会被阻止继续添加
            var num = edcont.children().length;
            if(num>=5){
                yyAlert('您选择的关键词已多余5个');
                return;
            }

            ths.attr('data-view','1');
            chebox.removeClass('glyphicon-unchecked');
            chebox.addClass('glyphicon-checked glyphicon-blue');
            var txt = '<span id="ed-con-li'+id+'" data-id="'+id+'">'+cont+'</span>';
            edcont.append($(txt));
        }else{
            ths.attr('data-view','0');
            chebox.removeClass('glyphicon-checked glyphicon-blue');
            chebox.addClass('glyphicon-unchecked');
            $('#ed-con-li'+id).remove();
        }
    });
    /*选中内容框中点击取消选中内容*/
    $('#ed-content').on('click','span',function(){
        var ths = $(this);
        var id = ths.attr('data-id');
        ths.remove();
        $('.ed-choose-li').filter('[data-id='+id+']').children().children()
            .removeClass('glyphicon-checked glyphicon-blue').addClass('glyphicon-unchecked');
    });

    /*删除自定义关键词*/
    $('#ed-choose').on('click','.glyphicon',function(e){
        e.stopPropagation();
        var ths = $(this);
        var edchos = ths.parent();
        var id = edchos.attr('data-id');

        var url = '/api/v1/poster/keywords/'+id+'/';
        $.ajax({
            url:url,
            type:"DELETE",
            success:function(){
                //删除成功后的操作
                edchos.remove();
                $('#ed-con-li'+id).remove();
            },
            error:function(){
                yyAlert('网络错误，请稍后再试');
            }
        });
    });

    /*自定义添加关键词*/
    $("#addItem").on('click',function(){
        var newKwn = $.trim($('#newKwn').val());
        var newKwv = $.trim($('#newKwv').val());
        if(newKwv =='' ||newKwn == ''){
            yyAlert('请填写必要的词汇');
            return;
        }
        if(getCharLen(newKwn)>50||getCharLen(newKwv)>50){
            yyAlert('请填写的词汇过多');
            return;
        }

        var category_id = $('#sub_category_id').val();
        var url = '/api/v1/poster/category/'+category_id+'/keywords';
        $.ajax({
            url:url,
            data:{verb:newKwv,noun:newKwn},
            type: "POST",
            success:function(data){
                var id = data.id;
                if(data.exists){
                    $('.ed-choose-li').filter('[data-id='+id+']').children().children()
                        .removeClass('glyphicon-unchecked').addClass('glyphicon-checked glyphicon-blue');
                }else{
                    //添加成功后的操作
                    var cht = '<div class="ed-choose-li col-xs-6" data-cont="'+newKwv+newKwn+'" data-view="1" data-id="'+id+'">';
                    cht += '<div class="cbox-line">';
                    cht += '<span class="glyphicon glyphicon-check glyphicon-blue"></span>'+newKwv+'+'+newKwn;
                    cht += '</div><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></div>';
                    $('#ed-choose').children().append($(cht));
                }

                var txt = '<span id="ed-con-li'+id+'" data-id="'+id+'">'+newKwv+newKwn+'</span>';
                $('#ed-content').append($(txt));
                //初始化输入框
                $('#newKwn').prop('value','');
                $('#newKwv').prop('value','');
            },
            error:function(){
                yyAlert('网络错误，请稍后再试');
            }
        });

    });

    /*提交选好的关键词*/
    $("#submit").on('click',function(){
        var edcont = $('#ed-content').children();
        var num = edcont.length;
        var name = '';
        if(num == 0){
            yyAlert('请选择关键词');
            return;
        }

        for(var i=0;i<num;i++){
            var kid= $(edcont.get(i)).attr('data-id');
            if(name)  name += ','+kid;
            else name += kid;
        }
//        console.log(name);
        var main_category_id = $('#main_category_id').val();
        var sub_category_id = $('#sub_category_id').val();
        window.location.href='/poster/create-form/?main_category_id='+main_category_id+'&sub_category_id='+sub_category_id+'&category_keyword_id='+name;
    });

    /*返回*/
    $('#goback').on('click',function(){
        var newKwn = $.trim($('#newKwn').val());
        var newKwv = $.trim($('#newKwv').val());
        var edcont = $('#ed-content').children();
        var num = edcont.length;
        if(newKwn != ''|| newKwv != '' || num!=0){
            yyConfirm('您当前有编辑过的内容，确定要退出吗？',function(){
                window.history.back();
            });
        }
        window.history.back();
    });
});

function getCharLen(char){
    var leng=0;
    var len = char.length;
    if(len==0)return leng;
    for(var i =0 ;i<len;i++){
        var c =char.charCodeAt(i);
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
            leng++;
        }else{
            leng+=2;
        }
    }
    return leng;
}

