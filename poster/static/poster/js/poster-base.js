$(function(){
	var uiController = {
		currentAbtn:null,
		currentToggle:null,
		init:function(){
			this.bindEvent();
		},
		bindEvent:function(){
			/* 点击页面空余部分隐藏toggle菜单 */
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
			/* 底部toggle菜单 */
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
					var ele = '.abutton-info section.' + btnType;
					$(ele).show();
					uiController.currentAbtn = btnType;
				}
			});
		}
	}
	uiController.init();
})