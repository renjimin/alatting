+function ($) {
    'use strict';

    var Doughnut = function (element, options) {
        this.type = null
        this.$element = null
        this.options = null
        this.chart = null
        this.init('doughnut', element, options)
    }

    Doughnut.VERSION = '1.0'

    Doughnut.DEFAULTS = {
        total: null,
        percent: 50,
        innerCutout: 75,
        color: 'red',
        backgroundColor: 'white'
    }

    Doughnut.prototype.init = function (type, element, options) {
        this.type = type
        this.$element = $(element)
        this.options = options = this.getOptions(options)
        this.initUI(element)
        var that = this
        this.chart = new Chart(this.canvas.getContext('2d')).Doughnut(
            [{
                value: options.percent,
                color: options.color
            }, {
                value: 100 - options.percent,
                color: options.backgroundColor
            }],
            {
                percentageInnerCutout: options.innerCutout,
                animationEasing: 'easeOut',
                showTooltips: false,
                responsive: true,
                maintainAspectRatio: false,
                segmentShowStroke : false,
                onAnimationProgress: function(progress){
                    if(options.total) {
                        that.titleElement.innerHTML = '+' + Math.round(progress * options.total)
                    }
                }
            });
    }

    Doughnut.prototype.getDefaults = function () {
        return Doughnut.DEFAULTS
    }

    Doughnut.prototype.getOptions = function (options) {
        if(typeof options.total == 'string'){
            options.total = parseInt(options.total)
        }
        options = $.extend({}, this.getDefaults(), this.$element.data(), options)
        return options
    }

    Doughnut.prototype.initUI = function (container) {
        var options = this.options
        var canvas = $(container).find('.doughnut-canvas').get(0)
        canvas.width = $(canvas).width()
        canvas.height = $(canvas).height()
        this.canvas = canvas
        this.titleElement = $(container).find('.doughnut-title > *').get(0)
    }

    Doughnut.prototype.update = function () {

    }

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('ty.doughnut')
            var options = typeof option == 'object' && option

            if (!data && /destroy|hide/.test(option)) return
            if (!data) $this.data('ty.doughnut', (data = new Doughnut(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.doughnut

    $.fn.doughnut = Plugin
    $.fn.doughnut.Constructor = Doughnut


    // Doughnut NO CONFLICT
    // ===================

    $.fn.doughnut.noConflict = function () {
        $.fn.doughnut = old
        return this
    }
}(jQuery);
