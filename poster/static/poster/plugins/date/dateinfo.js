$(function() {
	var defaults = {
		Event : "click",		//插件绑定的响应事件
		Left : 0,				//弹出时间停靠的左边位置
		Top : 22,				//弹出时间停靠的上边位置
		fuhao : "-",			//日期之间的连接符号
		isTime : false,			//是否开启时间值默认为false
		beginY : 2016,			//年份的开始默认为1949
		endY : 2049				//年份的结束默认为2049
	};
	var options = $.extend(defaults,options);
	var stc;
	var $mhInput = $(this);
	var isToday = true;//是否为今天默认为是	
	var date = new Date();//获得时间对象
	var nowYear = date.getFullYear();//获得当前年份
	var nowMonth = date.getMonth() + 1;//获得当前月份
	var today = date.getDate();//获得当前天数
	var nowWeek = new Date(nowYear, nowMonth - 1, 1).getDay();//获得当前星期
	var nowLastday = getMonthNum(nowMonth, nowYear);//获得最后一天
	//年、月下拉框的初始化
	var i;
	for(i=options.beginY; i<=options.endY; i++){
		$("<option value='"+i+"'>"+i+"年</option>").appendTo($("#year"));
	}
	for(i=1; i<=12; i++){
		$("<option value='"+i+"'>"+i+"月</option>").appendTo($("#month"));
	}		
	ManhuaDate(nowYear, nowMonth, nowWeek, nowLastday);//初始化为当前日期		
	//上一月绑定点击事件
	$("#preMonth").click(function() {
		isToday = false;
		var year = parseInt($("#year").val());
		var month = parseInt($("#month").val());		
		month = month - 1;
		if (month < 1) {
			month = 12;
			year = year - 1;
		}
		if(nowYear==year && nowMonth==month){
			isToday = true;
		}
		var week = new Date(year, month - 1, 1).getDay();
		var lastday = getMonthNum(month, year);
		ManhuaDate(year, month, week, lastday);
	});		
	//年下拉框的改变事件
	$("#year").change(function() {	
		isToday = false;				   
		var year = parseInt($(this).val());		
		var month = parseInt($("#month").val());	
		if(nowYear==year && nowMonth==month){
			isToday = true;
		}
		var week = new Date(year, month - 1, 1).getDay();
		var lastday = getMonthNum(month, year);
		ManhuaDate(year, month, week, lastday);
	});		
	//月下拉框的改变事件
	$("#month").change(function() {
		isToday = false;
		var year = parseInt($("#year").val());		
		var month = parseInt($(this).val());	
		if(nowYear==year && nowMonth==month){
			isToday = true;
		}
		var week = new Date(year, month - 1, 1).getDay();
		var lastday = getMonthNum(month, year);
		ManhuaDate(year, month, week, lastday);
	});		
	//下一个月的点击事件
	 $("#nextMonth").click(function() {
		isToday = false;
		var year = parseInt($("#year").val());
		var month = parseInt($("#month").val());
	
		month = parseInt(month) + 1;
		if (parseInt(month) > 12) {
			month = 1;
			year = parseInt(year) + 1;
		}
		if(nowYear==year && nowMonth==month){
			isToday = true;
		}
		var week = new Date(year, month - 1, 1).getDay();
		var lastday = getMonthNum(month, year);
		ManhuaDate(year, month, week, lastday);
	});
	 
	 //初始化日历
	 function ManhuaDate(year, month, week, lastday) {
		$("#year").val(year);
		$("#month").val(month);
		$('#dpw_clock input').eq(0).val("").attr("disabled",true);
		$('#dpw_clock input').eq(1).val("").attr("disabled",true);
		var table = document.getElementById("calender");
		var n = 1;
		var i,j;
		for (j = 0; j < week; j++) {
			table.rows[1].cells[j].innerHTML = "&nbsp;";
			table.rows[1].cells[j].className = "";
		}
		for (j = week; j < 7; j++) {
			table.rows[1].cells[j].className = calculateClass(j,n);
			table.rows[1].cells[j].innerHTML = n;
			n++;
		}
		for (i = 2; i < 7; i++) {
			for (j = 0; j < 7; j++) {
				if (n > lastday) {
					table.rows[i].cells[j].innerHTML = "&nbsp;";
					table.rows[i].cells[j].className = "";
				}else {
					table.rows[i].cells[j].className = calculateClass(j,n);
					table.rows[i].cells[j].innerHTML = n;
					n++;
				}
			}
		}
		function calculateClass(wk,day){
			if(yunyeEditorGlobal.lifetime.lifetime_special[year+"-"+month+"-"+day]){
				var specificDay = yunyeEditorGlobal.lifetime.lifetime_special[year+"-"+month+"-"+day];
				return (specificDay.enabled === 0) ? "off" : "special" ;
			}else{
				var weekName = (wk === 0) ? "Sunday" : (wk == 1) ? "Monday" : (wk == 2) ? "Tuesday" : (wk == 3) ? "Wednesday" : (wk == 4) ? "Thursday" : (wk == 5) ? "Friday" :  "Saturday" ;
				return (yunyeEditorGlobal.lifetime.lifetime_weekly[weekName].enabled === 0) ? "off" : "" ;
			}
			return "";
		}
	}
	//获得月份的天数
	function getMonthNum(month, year) {
		month = month - 1;
		var LeapYear = ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? true: false;
		var monthNum;
		switch (parseInt(month)) {
		case 0:
		case 2:
		case 4:
		case 6:
		case 7:
		case 9:
		case 11:
			monthNum = 31;
			break;
		case 3:
		case 5:
		case 8:
		case 10:
			monthNum = 30;
			break;
		case 1:
			monthNum = LeapYear ? 29: 28;
		}
		return monthNum;
	}
	$("#calender td").click(function(event) {
		if( event.target.innerHTML  == "&nbsp;" )return;
		$('.calenderTable input').eq(0).val("").attr("disabled",false);
		$('.calenderTable input').eq(1).val("").attr("disabled",false);
		$("td.hover").removeClass("hover");
		$(this).addClass("hover");
		var specificDay = $("#year").val() + "-" + $("#month").val() + "-" + event.target.innerHTML;
		setInput(specificDay);
	});
	function setInput(specificDay){
		var dateinfo= yunyeEditorGlobal.lifetime.lifetime_special[specificDay];
		if(dateinfo){
			$('.calenderTable input').eq(0).val(dateinfo.start);
			$('.calenderTable input').eq(1).val(dateinfo.end);
			if(dateinfo.enabled){$('#dateState').removeClass("off");}else{$('#dateState').addClass("off");}
		}else{
			var darry = specificDay.split("-"),
				week = new Date(parseInt(darry[0]), parseInt(darry[1]) - 1, parseInt(darry[2])).getDay(),
				weekName = (week === 0) ? "Sunday" : (week == 1) ? "Monday" : (week == 2) ? "Tuesday" : (week == 3) ? "Wednesday" : (week == 4) ? "Thursday" : (week == 5) ? "Friday" :  "Saturday" ,
				info = yunyeEditorGlobal.lifetime.lifetime_weekly[weekName];
			$('.calenderTable input').eq(0).val(info.start);
			$('.calenderTable input').eq(1).val(info.end);
			if(info.enabled){$('#dateState').removeClass("off");}else{$('#dateState').addClass("off");}
		}
	}
	$(".glyphicon.glyphicon-transfer").click(function(event) {
		if($(".weekly").is(":visible")){
			$(".calender").show();
			$(".weekly").hide();
			var year = parseInt($("#year").val()),
				month = parseInt($("#month").val()),
				week = new Date(year, month - 1, 1).getDay(),
				lastday = getMonthNum(month, year);
			ManhuaDate(year, month, week, lastday);
		}else{
			$(".calender").hide();
			$(".weekly").show();
		}
	});
	$(".weekly td:nth-child(5n)").click(function(event){
		var target = $(event.currentTarget),
			i = $(".weekly td:nth-child(5n)").index(target),
			weekName = (i == 6) ? "Sunday" : (i === 0) ? "Monday" : (i == 1) ? "Tuesday" : (i == 2) ? "Wednesday" : (i == 3) ? "Thursday" : (i == 4) ? "Friday" :  "Saturday" ;
		if(target.hasClass("off")){
			target.removeClass("off");
			yunyeEditorGlobal.lifetime.lifetime_weekly[weekName].enabled = 1;
		}else{
			target.addClass("off");
			yunyeEditorGlobal.lifetime.lifetime_weekly[weekName].enabled = 0;
		}
	});
	$('#dateState').click(function(event){
		var index = $("#calender td").index($("td.hover")),
			start = $('.calenderTable input').eq(0).val(),
			end = $('.calenderTable input').eq(1).val(),
			enabled,
			specificDay = $("#year").val() + "-" + $("#month").val() + "-" + $("td.hover").html(),
			darry = specificDay.split("-"),
			i = new Date(parseInt(darry[0]), parseInt(darry[1]) - 1, parseInt(darry[2])).getDay(),
			weekName = (i === 0) ? "Sunday" : (i == 1) ? "Monday" : (i == 2) ? "Tuesday" : (i == 3) ? "Wednesday" : (i == 4) ? "Thursday" : (i == 5) ? "Friday" :  "Saturday" ,
			info = yunyeEditorGlobal.lifetime.lifetime_weekly[weekName];
		if( $('#dateState').hasClass("off") ){
			$('#dateState').removeClass("off");
			enabled = 1;
		}else{
			$('#dateState').addClass("off");
			enabled = 0;
		}
		if(start==info.start && end==info.end && enabled==info.enabled){
			$("td.hover").removeClass("special");
			if(enabled){
				$("td.hover").removeClass("off");
			}else{
				$("td.hover").addClass("off");
			}
			delete yunyeEditorGlobal.lifetime.lifetime_special[specificDay];
		}else{
			if(enabled){
				$("td.hover").removeClass("off").addClass("special");
			}else{
				$("td.hover").removeClass("special").addClass("off");
			}
			yunyeEditorGlobal.lifetime.lifetime_special[specificDay] = {start:start,end:end,enabled:enabled};
		}
	});
	$(".weekly input").on('change',function(event){
		var index = $('.weekly input').index($(event.target));
		var start,end;
		if(index%2){
			start = $('.weekly input').eq(index - 1 );
			end = $('.weekly input').eq(index);
		}else{
			start = $('.weekly input').eq(index);
			end = $('.weekly input').eq(index + 1);
		}
		if(start.val() && end.val()){
			var i = parseInt(index/2) ,
				weekName = (i == 6) ? "Sunday" : (i === 0) ? "Monday" : (i == 1) ? "Tuesday" : (i == 2) ? "Wednesday" : (i == 3) ? "Thursday" : (i == 4) ? "Friday" :  "Saturday" ;
			if(end.val() < start.val()){
				$(event.target).blur();
				start.val(yunyeEditorGlobal.lifetime.lifetime_weekly[weekName].start);
				end.val(yunyeEditorGlobal.lifetime.lifetime_weekly[weekName].end);
				yyConfirm("结束时间不能早于开始时间");
			}else{
				yunyeEditorGlobal.lifetime.lifetime_weekly[weekName].start = start.val();
				yunyeEditorGlobal.lifetime.lifetime_weekly[weekName].end = end.val();
			}
		}
	});
});