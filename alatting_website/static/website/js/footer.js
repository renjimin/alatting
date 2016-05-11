function ftcatFunction(){
    var curPage = window.location.pathname.split('/').pop();
    if (curPage=="category") {
        if($('#type-model-ftcat').hasClass('open')) {
            $('#type-model-ftcat').removeClass('open');
            $('.body-container').css("overflow", "");
        } else {
            $('#type-model-ftcat').addClass('open');
            $('.body-container').css("overflow", "hidden");
        }
        return false;
    } else {
        return true;
    }  
}