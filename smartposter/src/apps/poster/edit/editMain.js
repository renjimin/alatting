app.controller("editController",function($scope,$http){
	// console.log(1123);
	// $(".abutton-group.abutton-contact li a").on("click",function(){
	// 	console.log(123);
	// 	$("#dpw_phone").show();
	// 	$("#dp").css("position","absolute");
	// 	$("#dp").css("top","0");
	// 	$("#dp").css("left","0");
	// 	$("#dp").css("visibility","visible");
	// });

	// $scope.$watch('phone',function(){
	// 	console.log(123213123);
	// });
	$http({
		method:"GET",
		url:"http://192.168.253.128:8000/api/v1/poster/posters/35",
	}).success(function(res){
		$scope.posterData = res;
		console.log(res);
	});

	$scope.dropDown = function($event,offsetY){
		var target = $($event.target);
		var dpTarget = target.data("dropdown");
		var dpw = $('#dp');
		if( dpw.hasClass('open')  && $('#'+dpTarget).is(':visible') ){
			dpw.attr('class', '').removeClass('open');
			$('#dp ul').hide();
		}else{
			dpw.attr('class', '').attr('style', '');
			$('#dp ul').hide();
			dpw.addClass('open');
			$("#"+dpTarget).show();

			dpw.css('top',target.offset().top + target.height() + offsetY - $('.container-fluid').offset().top);
			dpw.css('left',0);
			var arrOffset = target.offset().left + target.width()/2 -15 ;
			$('#dp .arrow').css('top',-30);
			$('#dp .arrow').css('left', arrOffset );
			$('#dp .arrow').attr('class', 'arrow up');
		}
	};

});