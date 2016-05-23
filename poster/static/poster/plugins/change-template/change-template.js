/**
 * Created by lyhapple on 16/5/17.
 * 更换模板公用模块
 */

;
(function ($) {
    var templateListAPI = yunyeEditorGlobal.API.templates,
        updateTemplateAPI = yunyeEditorGlobal.API.updateTemplate,
        createPageAPI = yunyeEditorGlobal.API.createPage;

    var getParentLayout = function () {
        return $(".yunye-template");
    };

    var getLayout = function () {
        return $(".change-template-layout");
    };

    var destroy = function () {
        getLayout().remove();
    };

    var ChangeTemplate = function (options) {
        this.layoutTmpl = $("#changeTemplateLayoutTmpl");
        this.listTmpl = $("#changeTemplateListTmpl");
        this.ulListId = "#change-templates-list";
        this.settings = options;
        this.target = options.target;
        this.posterId = yunyeEditorGlobal.posterId;
        this.posterPageId = yunyeEditorGlobal.posterPageId;
        this.templateId = yunyeEditorGlobal.templateId;
    };

    ChangeTemplate.prototype = $.extend(ChangeTemplate.prototype, {
        cancel: function () {
            var self = this;
            $(".change-template-cancel-btn").click(function (event) {
                self.destroy();
                event.stopPropagation();
            });
        },
        confirm: function () {
            var self = this;
            $(".change-template-confirm-btn").click(function (event) {
                var tmpId = self.getSelectedTemplateId();
                if(!tmpId){
                    yyAlert("请选中一个模板");
                    return;
                }
                if(self[self.target] && $.isFunction(self[self.target])){
                    self[self.target](tmpId);
                }
                event.stopPropagation();
            });
        },
        update: function (templateId) {
            var self = this;
            yyConfirm("更换模板会丢弃当前已编辑的模板内容，您确定要继续吗？", function () {
                self.destroy();
                //清理本地页面编辑缓存
                $.fn.yunyeStorage.cleanPage();
                window.onunload = function(){};
                //显示遮罩
                $.fn.yyTools.mask(1);

                $.ajax({
                    type: "PATCH",
                    url: updateTemplateAPI.format(self.posterPageId),
                    dataType: "json",
                    data: {
                        "poster_id": self.posterId,
                        "template_id": templateId
                    },
                    success: function(posterPage){
                        $.fn.yyTools.mask();
                        yyAlert("模板更换成功, 确定后将刷新当页面！", function(){
                            window.location.href = "/poster/{0}/edit/{1}".format(
                                self.posterId,
                                self.posterPageId
                            );
                        });
                    },
                    error: function () {
                        $.fn.yyTools.mask();
                    }
                });
            });
        },
        create: function (templateId) {
            var self = this;
            $.ajax({
                type: "POST",
                url: createPageAPI,
                dataType: "json",
                data: {
                    "poster_id": self.posterId,
                    "template_id": templateId
                },
                success: function(posterPage){
                    $.fn.yyTools.mask();
                    yyConfirm("新建页面成功，是否立即跳转到新页面？", function(){
                        window.location.href = "/poster/{0}/edit/{1}".format(
                            self.posterId,
                            posterPage.id
                        );
                    });
                },
                error: function () {
                    $.fn.yyTools.mask();
                }
            });
        },

        getSelectedTemplateId: function () {
            return $(this.ulListId).find("li.active").eq(0).data('id');
        },
        getHeader: function () {
            return $(getLayout().find(".change-template-header"));
        },
        getHeaderHeight: function () {
            return this.getHeader().outerHeight();
        },
        getFooter: function () {
            return $(getLayout().find(".change-template-footer"));
        },
        getFooterHeight: function () {
            return this.getFooter().outerHeight();
        },
        getMiddle: function () {
            return $(getLayout().find(".change-templates-list"));
        },
        setMiddleHeight: function () {
            var h = getLayout().outerHeight() - this.getHeaderHeight() - this.getFooterHeight() - 100;
            this.getMiddle().css({"height": h + "px"});
            console.log(h);
        },
        getTemplateList: function ($container) {
            getLayout().click(function (event) {
                event.stopPropagation();
            });

            var self = this,
                url = templateListAPI;
            if(self.target == "update"){
                url += "?exclude=" + self.templateId
            }
            $.getJSON(url, function (json) {
                $(self.ulListId).empty();
                self.listTmpl.tmpl(json).appendTo(self.ulListId);

                $(self.ulListId).find("li").click(function (event) {
                    if (!$(self.ulListId).hasClass('cover-item')) {
                        $(self.ulListId).addClass('cover-item');
                    }
                    $(this).addClass('active').siblings().removeClass('active');
                    event.stopPropagation();
                });
            });
        },
        init: function ($container) {
            var self = this;
            self.$container = $container;
            self.$container.append(self.layoutTmpl.tmpl());
            self.getTemplateList($container);
            self.cancel();
            self.confirm();
            if(self.settings.initAfter && $.isFunction(self.settings.initAfter)){
                self.settings.initAfter();
            }
        },
        destroy: function () {
            destroy();
        }
    });

    var methods = {
        'init': function (options) {
            if(!$.fn.yunyeStorage){
                yyAlert("需要yunyeStorage组件");
                return;
            }
            var settings = {
                target: 'update',    //update, create
                initAfter: null
            };
            if(options){
                settings = $.extend(settings, options);
            }
            return this.each(function () {
                var $this = $(this);
                var ct = new ChangeTemplate(settings);
                ct.init($this);
            });
        },
        "destroy": function () {
            return this.each(function () {
                destroy();
            });
        }
    };

    $.fn.changeTemplate = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('方法 ' + method + ' 不存在');
        }
    }
})(jQuery);
