/**
 * Created by ubuntu on 10/19/15.
 */
$(document).ready(function () {
    function setSelectedSrc(selected, src) {
        var name = '_selected'
        var pattern = new RegExp(name + '$');
        var parts = src.split('.')
        var hasName = parts[0].match(pattern);
        if (selected) {
            if (!hasName) {
                parts[0] += name;
                src = parts[0] + '.' + parts[1];
            }
        }
        else {
            if (hasName) {
                parts[0] = parts[0].replace(pattern, '');
                src = parts[0] + '.' + parts[1];
            }
        }
        return src;
    }

    var popover = $('[data-toggle="sub-menu"]').popover({animation: true})
    popover.on('show.bs.popover', function (evt) {
        var $img = $(this).find('img');
        var src = $img.attr('src');
        src = setSelectedSrc(true, src);
        $img.attr("src", src);
    });
    popover.on('inserted.bs.popover', function(evt){
        $(".rating").rating();
    });
    popover.on('shown.bs.popover', function () {
        // make the top of the popover relative
        var popover = $(this).data('bs.popover');
        var $tip = popover.$tip;
        var top = $tip.position().top / $tip.parent().outerHeight() * 100 + '%';
        $tip.css('top', top);
    });
    popover.on('hide.bs.popover', function (evt) {
        var $img = $(this).find('img');
        var src = $img.attr('src');
        src = setSelectedSrc(false, src);
        $img.attr("src", src);
    });
});
// dismiss popover
$('body').on('click', function (e) {
    $('[data-toggle="sub-menu"]').each(function () {
        //the 'is' for buttons that trigger popups
        //the 'has' for icons within a button that triggers a popup
        //&& $('.popover').has(e.target).length === 0
        $this = $(this);
        if (!$this.is(e.target) && $this.has(e.target).length === 0) {
            var tipId = $this.attr('aria-describedby');
            if (tipId) {
                $this.triggerHandler('click');
            }
        }
    });
});
