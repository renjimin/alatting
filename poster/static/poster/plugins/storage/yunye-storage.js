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

        this.getInitData = function(){
            var pages  = {},
                posterData = {
                "head":{},
                "pages": {}
            };
            pages[self.posterPageId] = {
                "html": "",
                "css": {},
                "head": {}
            };
            posterData["pages"] = pages;
            return posterData
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
            return self.getPosterPageData()["html"];
        };

        this.getHeadObj = function(){
            return self.getPosterPageData()["head"];
        };

        this.getCssObj = function(){
            return self.getPosterPageData()["css"];
        };

        this.setAttr = function (target, name, value) {
            var posterData = self.getPosterData();
            posterData["pages"][self.posterPageId][target][name] = value;
            self.storage.set(self.storageKey, posterData);
            return self.storage.get(self.storageKey);
        };

        this.init = function(){
            if(!self.checkRequiredIds()){
                return;
            }
            var storage = $.localStorage,
                key = self.storageKey,
                initData = self.getInitData();
            if(!storage.isSet(key)){
                storage.set(self.storageKey, self.getInitData());
            }else{
                var datas = storage.get(key);
                datas = $.extend(true, datas, initData);
                storage.set(self.storageKey, datas);
            }
            return self.getPosterData();
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
                b64 = $.base64.encode($(domSelector).html());
            posterData['pages'][self.posterPageId]['html'] = b64;
            self.storage.set(self.storageKey, posterData);
            return self.storage.get(self.storageKey);
        };

        this.remove = function () {
            //清除local storage数据
            self.storage.remove(self.storageKey);
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
            "remove": self.remove
        }
    }();
})(jQuery);

$(function(){
    $.fn.yunyeStorage.init();
});
