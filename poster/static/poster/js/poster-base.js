/*
$(function(){
	var uiController = {
		currentAbtn:null,
		currentToggle:null,
		init:function(){
			this.bindEvent();
		},
		bindEvent:function(){
			// 点击页面空余部分隐藏toggle菜单 
			$('body').click(function(){
				$('.abutton-info').removeClass('open');
				this.currentAbtn = null;
			});
			$('.abutton-info,#abutton').click(function(event){
				event.stopPropagation();
			});
			$('.abtn').click(function(event) {
				if($('#abutton').hasClass('open')){
					$('#abutton').removeClass('open');
				}else{
					$('#abutton').addClass('open');
				}
				$('.abutton-info').removeClass('open');
				this.currentAbtn = null;
			});
			// 底部toggle菜单 
			$(".dropdown-toggle").click(function(event) {
				$(".dropdown-panel").removeClass('open');
				$(".dropdown-toggle").removeClass('open');
				var toggleTargetName = $(event.currentTarget).data("dropdown");
				if(uiController.currentToggle == toggleTargetName){
					uiController.currentToggle = null;
				}else{
					$(event.currentTarget).addClass('open');
					$("#" + toggleTargetName).addClass('open');
					uiController.currentToggle = toggleTargetName;
				}
			});
			$('.abutton-contact li a').click(function(event){
				var icon = $(this).children('i');
				var btnType = icon.attr("class").split(' ')[1].split('-')[1];
				var topOffset = icon.offset().top+icon.height() - 30;
				var leftOffset = icon.offset().left+icon.width()/2 - 12;
				if(icon.height() >= icon.width()){
					topOffset = icon.offset().top+icon.height()/2 + 15 - 30;
				}
				$('.abutton-info').css('top',topOffset);
				$('.abutton-info .arrow').css('left',leftOffset);
				if(uiController.currentAbtn == btnType){
					$('.abutton-info').removeClass('open');
					uiController.currentAbtn = null;
				}else{
					$('.abutton-info').addClass('open');
					$('.abutton-info section').hide();
					$('.abutton-info section.' + btnType).show();
					//$('.abutton-info section.' + btnType + ' li input').eq(0).trigger('focus');
					uiController.currentAbtn = btnType;
				}
			});
		}
	}
	uiController.init();
})
*/

$(function(){
	$(".dropdown-toggle").registerDropDown();
	$(".abutton-contact .ico-phone").registerDropDown({
			content:['<i class="icon ico-phone"></i><span><input type="text" value="' + $(".abutton-contact .ico-phone").data('django').split(',')[0] +'" /></input>',
					'<i class="icon ico-phone"></i><span><input type="text" value="' + $(".abutton-contact .ico-phone").data('django').split(',')[1] +'" /></input>'],
			offsetYPercent:'50%',
			offsetY:'30',
			arrowOffset:'75%'
		});
	$(".abutton-contact .ico-email").registerDropDown({
			content:['<i class="icon ico-email"></i><span><input type="text" value="'+ $(".abutton-contact .ico-email").data('django') +'" /></span>'],
			offsetYPercent:'50%',
			offsetY:'30',
			arrowOffset:'83%'
		});
	$(".abutton-contact .ico-address").registerDropDown({
			content:['<i class="icon ico-phone"></i><span><input type="text" value="' + $(".abutton-contact .ico-address").data('django')+'" /></input>'],
			offsetYPercent:'50%',
			offsetY:'30',
			arrowOffset:'90%'
		});
	$(".abutton-contact .ico-clock").registerDropDown({
			content:['<i class="text">周一</i><span><input type="text" value="编辑工作时间" /></span>',
                	'<i class="text">周二</i><span><input type="text" value="编辑工作时间" /></span>',
                	'<i class="text">周三</i><span><input type="text" value="编辑工作时间" /></span>',
                	'<i class="text">周四</i><span><input type="text" value="编辑工作时间" /></span>',
                	'<i class="text">周五</i><span><input type="text" value="编辑工作时间" /></span>',
                	'<i class="text">周六</i><span><input type="text" value="编辑工作时间" /></span>',
                	'<i class="text">周日</i><span><input type="text" value="编辑工作时间" /></span>'],
			offsetYPercent:'50%',
			offsetY:'30',
			arrowOffset:'83%',
			dynamicClass:'clock'
		});
});

