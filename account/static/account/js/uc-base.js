/**
 * Created by chulin on 16-6-16.
 */
var userInfo={
    id:'',
    name:'',
    hdicon:'',
    defHdIcon:'/static/account/img/headicon-default.jpg'
};

/* 获取个人信息 */
$.ajax({
    type: 'GET',
    url: '/api/v1/account/profile',
    success:function(data){
        if(!$.isEmptyObject(data)){
            userInfo.id=data.id;
            userInfo.name=getUserName(data);
            userInfo.hdicon=(data.person.avatar)?data.person.avatar:userInfo.defHdIcon;
        }
    },
    error:function(xhr, status,statusText){
        //yyAlert("网络错误,请刷新再试!");
    }
});

/* 整理用户名 */
function getUserName(d){
    return (d.person.phonenumber)?d.person.phonenumber:d.email;
}

/* 加载动画的显示与隐藏 */
function showLoadTips($obj,type){
    if(type == 'show'){
        $obj.append('<div class="data-loading"><i class="fa fa-spinner fa-pulse fa-5x"></i><br>数据加载中,请稍等...</div>');
    }
    if(type == 'success'){
        $obj.children('.data-loading').remove();
    }
    if(type == 'error'){
        $obj.children('.data-loading').remove();
        $obj.append('<span class="error-msg">网络错误,请稍候再试!</span>');
    }
}

/* 获取当前时间,格式:YY-mm-dd H:i:s  */
function nowTime(){
    var d = new Date();
    var addZero = function(num){
        if(num<10){
            num = '0'+num;
        }
        return num;
    }
    var year = d.getFullYear();
    var month = addZero(d.getMonth()+1);
    var day = addZero(d.getDate());
    var hours = addZero(d.getHours());
    var minute = addZero(d.getMinutes());
    var seconds = addZero(d.getSeconds());
    return year+'-'+month+'-'+day+' '+hours+':'+minute+':'+seconds;
}




