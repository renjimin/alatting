/**
 * Created by lyhapple on 16/5/11.
 */

(function(){
    $.fn.yunyeStorage = function(){
        var self = this;
        this.getPosterId = function(){
            if(window.yunyeEditorGlobal){
                return window.yunyeEditorGlobal.posterId;
            }else{
                return "";
            }
        };

        this.getPosterPageId = function(){
            if(window.yunyeEditorGlobal){
                return window.yunyeEditorGlobal.posterPageId;
            }else{
                return "";
            }
        };

        this.storage = $.localStorage;
        this.posterId = this.getPosterId();
        this.posterPageId = this.getPosterPageId();
        this.storageKey = "yunyeTemplateData" + this.posterId;

        this.getPosterCleanData = function(){
            return {
                "head": {},
                "pages": {}
            };
        };

        this.getPageCleanData = function(){
            return {
                "html": "",
                "css": {}
            };
        };

        this.getPageInitData = function(){
            var pd = {}, key = self.posterPageId;
            pd[key] = self.getPageCleanData();
            return pd;
        };

        this.getPosterInitData = function(){
            return self.getPosterCleanData();
        };

        this.getInitData = function(){
            var poster = self.getPosterInitData(),
                page = self.getPageInitData();
            poster["pages"] = $.extend(
                poster["pages"], page
            );
            return poster
        };

        this.getPosterData = function () {
            return self.storage.get(self.storageKey);
        };

        this.getPosterHeadData = function () {
            return self.getPosterData()["head"];
        };

        this.getPosterPagesData = function () {
            return self.getPosterData()["pages"];
        };

        this.getPosterPageData = function(){
            return self.getPosterPagesData()[self.posterPageId];
        };

        this.getHtmlObj = function(){
            var pageData = self.getPosterPageData();
            if(pageData){
                return self.getPosterPageData()["html"];
            }else{
                return "";
            }
        };

        this.getCssObj = function(){
            var pageData = self.getPosterPageData();
            if(pageData){
                return self.getPosterPageData()["css"];
            }else{
                return {};
            }
        };

        this.setAttr = function (target, name, value) {
            var posterData = self.getPosterData();
            posterData["pages"][self.posterPageId][target][name] = value;
            self.storage.set(self.storageKey, posterData);
            return self.storage.get(self.storageKey);
        };

        this.getHead = function (name){
            return self.getPosterData()["head"][name];
        };

        this.setHead = function (name, value) {
            var posterData = self.getPosterData();
            posterData["head"][name] = value;
            self.storage.set(self.storageKey, posterData);
            return self.storage.get(self.storageKey);
        };

        this.getCss = function(name){
            return self.getCssObj()[name];
        };

        this.setCss = function(className, valueObj){
            return self.setAttr("css", className, valueObj);
        };

        this.getHtml = function(){
            var b64 = self.getHtmlObj();
            return $.base64.decode(b64);
        };

        this.setHtml = function(domSelector){
            // base64 encode html
            var posterData = self.getPosterData(),
                b64 = $.base64.encode($(domSelector)[0].outerHTML);
            posterData['pages'][self.posterPageId]['html'] = b64;
            self.storage.set(self.storageKey, posterData);
            return self.storage.get(self.storageKey);
        };

        this.remove = function () {
            //清除local storage数据
            self.storage.remove(self.storageKey);
        };

        this.cleanPage = function(){
            var pageId = self.posterPageId;
            if(arguments.length > 0){
                pageId = arguments[0];
            }
            var posterData = self.getPosterData();
            posterData["pages"][pageId] = self.getPageCleanData();
            self.storage.set(self.storageKey, posterData);
            return self.storage.get(self.storageKey);
        };

        this.checkRequiredIds = function(){
            var passed = true;
            if(!self.getPosterId() || !self.getPosterPageId()){
                passed = false;
            }
            if(!passed){
                yyAlert("缺少必要参数,无法继续操作");
            }
            return passed;
        };

        this.init = function(){
            if(!self.checkRequiredIds()){
                return;
            }
            var storage = $.localStorage,
                key = self.storageKey;
            if(!storage.isSet(key)){
                storage.set(key, self.getInitData());
            }else{
                var poster = storage.get(key);
                var page = poster['pages'][self.posterPageId];
                if(!page){
                    poster["pages"] = $.extend(
                        poster["pages"], self.getPageInitData()
                    );
                    storage.set(key, poster);
                }
            }
            return self.getPosterData();
        };

        return {
            "init": self.init,
            "getPosterData": self.getPosterData,
            "getPosterHeadData": self.getPosterHeadData,
            "getPosterPageData": self.getPosterPageData,
            "getPosterPagesData": self.getPosterPagesData,
            "setHead": self.setHead,
            "getHead": self.getHead,
            "setCss": self.setCss,
            "getCss": self.getCss,
            "setHtml": self.setHtml,
            "getHtml": self.getHtml,
            "remove": self.remove,
            "cleanPage": self.cleanPage,
            "getCssObj": self.getCssObj
        }
    }();
})(jQuery);

$(function(){
    $.fn.yunyeStorage.init();
});
