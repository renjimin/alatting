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
	for(var i=options.beginY; i<=options.endY; i++){
		$("<option value='"+i+"'>"+i+"年</option>").appendTo($("#year"));
	}
	for(var i=1; i<=12; i++){
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
		$("#month").val(month)
		var table = document.getElementById("calender");
		var n = 1;
		for (var j = 0; j < week; j++) {
			table.rows[1].cells[j].innerHTML = "&nbsp;"
		}
		for (var j = week; j < 7; j++) {
			if (n == today && isToday) {				
				table.rows[1].cells[j].className="hover";				
			}else {
				table.rows[1].cells[j].className="";
			}
			table.rows[1].cells[j].innerHTML = n;
			n++;
		}
		for (var i = 2; i < 7; i++) {
			for (j = 0; j < 7; j++) {
				if (n > lastday) {
					table.rows[i].cells[j].innerHTML = "&nbsp;"
				}
				 else {
					if (n == today && isToday) {						
						table.rows[i].cells[j].className="hover";						
					}else {
						table.rows[i].cells[j].className="";
					}
					table.rows[i].cells[j].innerHTML = n;
					n++;
				}
			}
		}
	}
	//获得月份的天数
	function getMonthNum(month, year) {
		month = month - 1;
		var LeapYear = ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) ? true: false;
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
		$(".hover").removeClass("hover");
		$(this).addClass("hover");
		var specificDay = $("#year").val() + "-" + $("#month").val() + "-" + event.target.innerHTML;
		setInput(specificDay);
	});
	function setInput(specificDay){
		if( yunyeEditorGlobal.lifetime && yunyeEditorGlobal.lifetime.lifetime_value){
			var dateinfo= yunyeEditorGlobal.lifetime.lifetime_value[specificDay];
			if(dateinfo){
				$('#dpw_clock input').eq(0).val(dateinfo.time_start);
				$('#dpw_clock input').eq(1).val(dateinfo.time_end);
			}
		}
	}

});