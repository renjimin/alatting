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
        value: 50,
        innerCutout: 75,
        title: '75'
    }

    Doughnut.prototype.init = function (type, element, options) {
        this.type = type
        this.$element = $(element)
        this.options = options = this.getOptions(options)
        this.initUI(element)
        this.chart = new Chart(this.canvas.getContext('2d')).Doughnut(
            [{
                value: options.value,
                label: '1',
                color: 'red'
            }, {
                value: 100 - options.value,
                color: '#F0F0F0'
            }],
            {
                percentageInnerCutout: options.innerCutout,
                animationEasing: 'easeOut',
                showTooltips: false,
                responsive: true,
                maintainAspectRatio: false
            });
    }

    Doughnut.prototype.getDefaults = function () {
        return Doughnut.DEFAULTS
    }

    Doughnut.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options)
        return options
    }

    Doughnut.prototype.initUI = function (container) {
        var options = this.options
        var canvas = $(container).find('canvas').get(0)
        canvas.width = $(canvas).width()
        canvas.height = $(canvas).height()
        this.canvas = canvas
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
