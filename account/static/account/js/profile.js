/**
 *
 */
$(document).ready(function () {
	/*footer*/
	$('.footer-tab li.active').removeClass("active");
	$('.footer-tab').find("li").eq(3).addClass("active");
	/*add*/
	$(".ac-add .ac-list-item-ctrl").click(function(){
	    alert("添加更多模板");
	});
	/*edit*/
	$(".ac-item-back").click(function(){
		var state_id = $(this).attr('id')
	    var poster_id = state_id.substr(state_id.lastIndexOf('-') + 1);
	    alert("删除 poster_id: " + poster_id);
	});
	$(".ac-item-edit").click(function(){
	    var state_id = $(this).attr('id')
	    var poster_id = state_id.substr(state_id.lastIndexOf('-') + 1);
	    alert("编辑 poster_id: " + poster_id);
	});

	$( ".ac-temp-box-list" ).hover(
		function() {
			var state_id = $(this).attr('id')
		    var poster_id = state_id.substr(state_id.lastIndexOf('-') + 1);
		    var ctrl_id = "ac-list-item-ctrl-list-"+poster_id;
			$( "#"+ctrl_id ).removeClass("hidden");
		}, function() {
			var state_id = $(this).attr('id')
		    var poster_id = state_id.substr(state_id.lastIndexOf('-') + 1);
		    var ctrl_id = "ac-list-item-ctrl-list-"+poster_id;
		    $( "#"+ctrl_id ).addClass("hidden");
		}
	);
});

