/**
 * Created by tianhuyang on 11/3/15.
 */

function printPDF(url){
    var popup = window.open(url)
    popup.onload = function(evt){
        this.print()
    }
}

var fillCenter = function ($slider) {
    var $images = $slider.find('img').addBack($slider)
    $images.each(function (index) {
        var $this = $(this);
        if($this.is('img')) {
            var width = $this.parent().width();
            var height = $this.parent().height();
            var w = this.naturalWidth, h = this.naturalHeight;
            if (w / h > width / height) {
                w = w / h * height;
                h = height;
                var left = (width - w) / 2.0 * 100 / width;
                $this.css('margin-left', left + '%');
            }
            else {
                h = h / w * width;
                w = width;
                var top = (height - h) / 2.0 * 100 / height;
                $this.css('margin-top', top + '%');
            }
            w = w / width * 100;
            h = h / height * 100;
            $this.css('width', w + '%');
            $this.css('height', h + '%');
        }
    });

};
