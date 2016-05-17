/**
 * Created by lyhapple on 16/5/17.
 * 更换模板公用模块
 */

;
(function ($) {
    var layoutTmpl = $("#changeTemplateLayoutTmpl"),
        listTmpl = $("#changeTemplateListTmpl");

    var ChangeTemplate = function(){
        this.layoutTmpl = layoutTmpl;
        this.listTmpl = listTmpl;
        this.parentDom = $(".yunye-template");

    };

    ChangeTemplate.prototype.init = function(){
          alert('开发中..');
    };

    $.fn.changeTemplate = function(){
        return this.each(function(){
            var ct = new ChangeTemplate();
            ct.init();
        });
    }
})(jQuery);

$(function () {
    $(".icon-change-template").click(function () {
        $("body").changeTemplate();
    });
});