
/**
 * Created by zhangjie on 2016/5/3.
 */
$(function(){
    var requeststr = GetRequest();
    console.log(requeststr);
    //$('#cat').html(requeststr.cate+"--");
    //$('#subcat').html(requeststr.subcate);

    /*选择关键词*/
    $('#ed-choose').on('click','.ed-choose-li',function(e){
        var ths = $(this);
        var chebox = ths.find('input');
        var cont = ths.attr('data-cont');
        var view = ths.attr('data-view');
        var id = ths.attr('data-id');
        var edcont= $('#ed-content');
        if(view == '0'){
            ths.attr('data-view','1');
            chebox.prop('checked','true');
            var txt = '<span id="ed-con-li'+id+'" data-id="'+id+'">'+cont+'</span>';
            edcont.append($(txt));
        }else{
            ths.attr('data-view','0');
            chebox.removeProp("checked");;
            $('#ed-con-li'+id).remove();
        }

    });

    $('#ed-choose').on('click','.glyphicon',function(e){
        e.stopPropagation();
        var ths = $(this);
        var edchos = ths.parent();
        var id = edchos.attr('data-id');

        //删除成功后的操作
        edchos.remove();
        $('#ed-con-li'+id).remove();

    });

    /*自定义添加关键词*/
    $("#addItem").on('click',function(){

        var newKwn = $('#newKwn').val();
        var newKwv = $('#newKwv').val();
        if(newKwv =='' ||newKwn == ''){
            alert('请填写必要的词汇');
            return;
        }

        //添加成功后的操作
        var num = $('.ed-choose-li').length;
        var id = num+1;
        var cht = '<div class="ed-choose-li col-xs-6" data-cont="'+newKwn+newKwv+'" data-view="1" data-id="'+id+'">';
            cht += '<div class="cbox-line">';
            cht += '<input type="checkbox" checked="checked">'+newKwn+'+'+newKwv;
            cht += '</div><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></div>';
        $('#ed-choose').children().append($(cht));
        var txt = '<span id="ed-con-li'+id+'" data-id="'+id+'">'+newKwn+newKwv+'</span>';
        $('#ed-content').append($(txt));

        $('#newKwn').prop('value','');
        $('#newKwv').prop('value','');

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
        window.location.href='/poster/create-form/';
    });
});

