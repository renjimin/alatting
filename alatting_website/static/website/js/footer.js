function ftcatFunction(){
    var curPage = window.location.pathname.split('/').pop();
    if (curPage=="category") {
        if($('#type-model-ftcat').hasClass('open')) {
            $('#type-model-ftcat').removeClass('open');
        } else {
            $('#type-model-ftcat').addClass('open');
        }
        return false;
    } else {
        return true;
    }  
}