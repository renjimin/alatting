/**
 * Created by lyhapple on 16/5/17.
 * 更换模板公用模块
 */

;
(function ($) {
    var templateListAPI = yunyeEditorGlobal.API.templates,
        updateTemplateAPI = yunyeEditorGlobal.API.updateTemplate,
        createPageAPI = yunyeEditorGlobal.API.createPage,
        posterpageListAPI = yunyeEditorGlobal.API.posterpages;

    var getParentLayout = function () {
        return $(".yunye-template");
    };

    var getTemplateBoxLayout = function(){
        return $(".template-box");
    };

    var getPageCss = function(){
        return $("#posterPageCss");
    };

    var getLayout = function () {
        return $(".change-template-layout");
    };

    var destroy = function () {
        getLayout().remove();
    };

    var ChangeTemplate = function (options) {
        this.layoutTmplId = "#changeTemplateLayoutTmpl";
        this.listTmplId = "#changeTemplateListTmpl";
        this.ulListId = "#changeTemplatesList";
        this.settings = options;
        this.target = options.target;
        this.posterId = yunyeEditorGlobal.posterId;
        this.posterPageId = yunyeEditorGlobal.posterPageId;
        this.templateId = yunyeEditorGlobal.templateId;
        this.pageDataList = [];
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

        confirmSelectPage: function(){
            var self = this;
            $(".change-template-confirm-btn").click(function (event) {
                var tmpId = self.getSelectedTemplateId();
                if(!tmpId){
                    yyAlert("请选择要切换的页面!");
                    return;
                }
                var page = {};
                $.each(self.pageDataList, function(i, page){
                    if(page.id == tmpId){
                        self.posterPageId = page.id;
                        yunyeEditorGlobal.posterPageId = page.id;
                        yunyeEditorGlobal.templateId = page.template.id;
                        $.fn.yunyeStorage.init();
                        self.resetEditArea(page);
                        return false;
                    }
                });
                self.destroy();
                event.stopPropagation();
            });
        },

        confirmSelectPublishPage: function(){
            var self = this;
            $(".change-template-confirm-btn").click(function (event) {
                var tmpId = self.getSelectedTemplateId();
                if(!tmpId){
                    yyAlert("请选择页面!");
                    return;
                }

                $.each(self.pageDataList, function(i, page){
                    if(page.id == tmpId){
                        yunyeEditorGlobal.posterPageId = tmpId;
                        $("#pageStyle").attr('href', page.css_url);
                        $(".yunye-template").hide();
                        $(".yunye-template[data-page-id='"+ tmpId +"']").show();
                        return false;
                    }
                });
                self.destroy();
                event.stopPropagation();
            });
        },

        resetEditArea: function(page){
            $.fn.yyTools.mask();
            var html = page.temp_html,
                css = page.temp_css;
            html = $.base64.decode(html);
            css = $.base64.decode(css);
            getParentLayout().remove();
            getTemplateBoxLayout().append(html);
            getPageCss().empty().append(css);
            $.fn.yunyeStorage.setHtml('.yunye-template');
            fullcontainer = $('.yunye-template').eq(0);
            addDefaultButtons();
            window.onresize();
            if(window.templateMainActionInit){
                window.templateMainActionInit();
            }
            if(window.templateEventInit){
                window.templateEventInit();
            }
        },

        update: function (templateId) {
            var self = this;
            yyConfirm(
                "更换模板会丢弃当前已编辑的模板主体内容，您确定要继续吗？",
                function () {
                    self.destroy();
                    //显示遮罩
                    $.fn.yyTools.mask(1);

                    $.ajax({
                        type: "PATCH",
                        url: updateTemplateAPI,
                        dataType: "json",
                        data: {
                            "poster_id": self.posterId,
                            "template_id": templateId
                        },
                        success: function (resp) {
                            $.fn.yunyeStorage.cleanPage();
                            yunyeEditorGlobal.templateId = templateId;
                            self.resetEditArea(resp);
                            yyAlert("模板更换成功!");
                        },
                        error: function () {
                            $.fn.yyTools.mask();
                        }
                    });
                }
            );
        },

        create: function (templateId) {
            var self = this;
            self.destroy();
            $.ajax({
                type: "POST",
                url: createPageAPI,
                dataType: "json",
                data: {
                    "poster_id": self.posterId,
                    "template_id": templateId
                },
                success: function(resp){
                    $.fn.yyTools.mask();
                    yyConfirm(
                        "新建页面成功，是否立即编辑新页面？",
                        function () {
                            self.posterPageId = resp.id;
                            yunyeEditorGlobal.posterPageId = resp.id;
                            yunyeEditorGlobal.templateId = templateId;
                            $.fn.yunyeStorage.init();
                            self.resetEditArea(resp);
                        },
                        {
                            'okText': "是",
                            'cancelText': "否"
                        }
                    );
                },
                error: function () {
                    $.fn.yyTools.mask();
                }
            });
        },

        copy: function(){
            var self = this;
            $.ajax({
                type: "POST",
                url: createPageAPI,
                dataType: "json",
                data: {
                    "poster_id": self.posterId,
                    "template_id": self.templateId,
                    "posterpage_id": self.posterPageId,
                    "action": 'copy'
                },
                success: function(resp){
                    $.fn.yyTools.mask();
                    yyConfirm(
                        "复制页面成功, 是否立即编辑新页面？",
                        function () {
                            self.posterPageId = resp.id;
                            yunyeEditorGlobal.posterPageId = resp.id;
                            $.fn.yunyeStorage.init();
                            self.resetEditArea(resp);
                        },
                        {
                            'okText': "是",
                            'cancelText': "否"
                        }
                    );
                },
                error: function (xhr, status, statusText) {
                    $.fn.yyTools.mask();
                    if(xhr && xhr.responseJSON){
                        yyAlert(xhr.responseJSON.detail);
                    }
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
                self.resetTitle('选择模板');
                $(self.ulListId).empty();
                $(self.listTmplId).tmpl(json).appendTo(self.ulListId);

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
            self.$container.append($(self.layoutTmplId).tmpl());
            self.getTemplateList($container);
            self.cancel();
            self.confirm();
            if(self.settings.initAfter && $.isFunction(self.settings.initAfter)){
                self.settings.initAfter();
            }
        },

        destroy: function () {
            destroy();
        },

        resetTitle: function(str){
            $('.change-template-header').text(str);
        },

        getPosterPageList: function($container){
            getLayout().click(function (event) {
                event.stopPropagation();
            });

            var self = this,
                url = posterpageListAPI;
            url += "?poster_id={0}&exclude={1}".format(
                self.posterId, self.posterPageId
            );
            $.getJSON(url, function (json) {
                $.fn.yyTools.mask();
                if(json.length == 0){
                    yyAlert("没有可以切换的页面，您可以新建或复制页面!");
                    return
                }
                
                self.resetTitle('选择页面');
                self.pageDataList = json;
                $(self.ulListId).empty();
                $(self.listTmplId).tmpl(json).appendTo(self.ulListId);

                $(self.ulListId).find("li").click(function (event) {
                    if (!$(self.ulListId).hasClass('cover-item')) {
                        $(self.ulListId).addClass('cover-item');
                    }
                    $(this).addClass('active').siblings().removeClass('active');
                    event.stopPropagation();
                });
            });
        },

        showPageList: function($container){
            var self = this;
            self.$container = $container;
            self.$container.append($(self.layoutTmplId).tmpl());
            self.getPosterPageList($container);
            self.cancel();
            self.confirmSelectPage();
            if(self.settings.initAfter && $.isFunction(self.settings.initAfter)){
                self.settings.initAfter();
            }
        },

        getPublishPageList: function($container){
            getLayout().click(function (event) {
                event.stopPropagation();
            });

            var self = this,
                url = posterpageListAPI;
            url += "?poster_id={0}&exclude={1}".format(
                self.posterId, self.posterPageId
            );
            $.getJSON(url, function (json) {
                $.fn.yyTools.mask();
                if(json.length == 0){
                    yyAlert("没有可以切换的页面!");
                    return
                }
                self.cancel();
                self.confirmSelectPublishPage();
                if(self.settings.initAfter && $.isFunction(self.settings.initAfter)){
                    self.settings.initAfter();
                }

                self.resetTitle('选择页面');
                self.pageDataList = json;
                $(self.ulListId).empty();
                $(self.listTmplId).tmpl(json).appendTo(self.ulListId);

                $(self.ulListId).find("li").click(function (event) {
                    if (!$(self.ulListId).hasClass('cover-item')) {
                        $(self.ulListId).addClass('cover-item');
                    }
                    $(this).addClass('active').siblings().removeClass('active');
                    event.stopPropagation();
                });
            });
        },

        showPublishPageList:function($container){
            var self = this;
            self.$container = $container;
            self.$container.append($(self.layoutTmplId).tmpl());
            self.getPublishPageList($container);
        }
    });

    var methods = {
        "init": function (options) {
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
        },
        "copy": function(){
            return this.each(function () {
                var $this = $(this);
                var ct = new ChangeTemplate({
                    "target": "copy"
                });
                ct.copy();
            });
        },
        "showPageList": function(options){
            return this.each(function () {
                var $this = $(this);
                var ct = new ChangeTemplate(options);
                ct.showPageList($this);
            });
        },
        "showPublishPageList": function(options){
            return this.each(function () {
                var $this = $(this);
                var ct = new ChangeTemplate(options);
                ct.showPublishPageList($this);
            });
        },
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
