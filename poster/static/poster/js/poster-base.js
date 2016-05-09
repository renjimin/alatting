$(function(){
	var uiController = {
		currentAbtn:null,
		currentToggle:null,
		init:function(){
			this.bindEvent();
		},
		bindEvent:function(){
			$('body').click(function(){
				$('.abutton-info').removeClass('open');
				this.currentAbtn = null;
			});
			$('.abutton-info,#abutton').click(function(event){
				event.stopPropagation();
			});
			$('.abtn').on('click',function(event) {
				if($('#abutton').hasClass('open')){
					$('#abutton').removeClass('open');
				}else{
					$('#abutton').addClass('open');
				}
				$('.abutton-info').removeClass('open');
				this.currentAbtn = null;
			});
			/* music */
			$('#music').click(function(){
				if($(this).hasClass('rotate')){
					$(this).removeClass('rotate');
				}else{
					$(this).addClass('rotate');
				}
			});
			/* dropdown */
			$(".dropdown-toggle").click(function(event) {
				$('.dropdown-panel').removeClass('open');
				var toggleTarget = $("#" + $(event.currentTarget).data("dropdown"));
				toggleTarget.addClass('open');
				console.log(1);
			});
			window.showDetails=this.showDetails;
		},
		showDetails:function (e) {
			var icon = $(e).children('i');
			var btnType = icon.attr("class").split(' ')[1].split('-')[1];
			var topOffset = icon.offset().top+icon.height() - 30;
			var leftOffset = icon.offset().left+icon.width()/2 - 12;
			if(icon.height() >= icon.width()){
				topOffset = icon.offset().top+icon.height()/2 + 15 - 30;
			}
			$('.abutton-info').css('top',topOffset);
			$('.abutton-info .arrow').css('left',leftOffset);
			if(this.currentAbtn == btnType){
				$('.abutton-info').removeClass('open');
				this.currentAbtn = null;
			}else{
				$('.abutton-info').addClass('open');
				$('.abutton-info section').hide();
				var ele = '.abutton-info section.' + btnType;
				$(ele).show();
				currentAbtn = btnType;
			}
		}

	}
	uiController.init();
})