/**
 * Created by tianhuyang on 10/15/15.
 */

videojs.initialize = function(id){
    videojs(id, {}, function(){
    });
}

videojs.start = function (id) {
    var isWebkit = /AppleWebKit/.test(navigator.userAgent);
    var player = videojs.getPlayers()[id];
    if (isWebkit) {
        var parent = player.el_.parentNode;
        document.body.appendChild(player.el_);
    }
    player.on('fullscreenchange', function (evt) {
        if (this.isFullscreen()) {
            //this.player(); Android browser not support
        }
        else {
            this.pause();
            if (isWebkit) {
                parent.insertBefore(this.el_, parent.firstChild);
            }
        }
    });
    player.on('pause', function(evt){
         $('.vjs-controls-disabled .vjs-poster').css({'display': 'inline-block'});
    });
    player.requestFullscreen();
    player.play();
    $('.vjs-controls-disabled .vjs-poster').css({'display': 'none'});
}
