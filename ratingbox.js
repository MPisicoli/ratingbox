/*
 * ratingbox.js Version 0.1
 * jQuery Plugin that use font-awesome to display rating boxes.
 *  
 * Licensed under MIT license
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright (c) 2017 Michele Pisicoli
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a 
 * copy of this software and associated documentation files (the "Software"), 
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
 * IN THE SOFTWARE.
 */
(function($, window, document, undefined) {

    var pluginName = 'ratingBox';
 
    function Plugin(element, options) {
        this.el = element;
        this.$el = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, options);
        this.options = getOptions(this.$el, this.options);
        this.init();
    }

    Plugin.prototype = {
        
        init: function() {
            createBox(this.$el, this.options);
            if (this.options.mode === 'rating') {
                attachHandlers(this.$el, this.options);
            }
            if ($.isFunction(this.options.onClick)) {
                var boxOnClick = this.options.onClick;
                this.$el.on('click', function () {
                    boxOnClick = $.proxy(boxOnClick, this);
                    boxOnClick();
                });
            }
        },

        destroy: function() {
            this.$el.off('click');
            this.$el.removeData();
        },

        setValue: function(val) {
            this.$el.data('value', val);
            this.options.value = val;
            createBox(this.$el, this.options);
        }
    };

    // render a rating box whith stars
    function createBox(e, options) {
        $('i', e).remove();
        $('span', e).remove();

        // create star icons
        for (var i = 1; i <= 5; i++) {
            var $star = $('<i></i>');
            $star.data('i', i);
            $star.addClass('fa')
            var classe = "fa-star";
            if (i > options.value) {
                if (i - options.value > 0.5) {
                    classe += "-o";
                } else {
                    classe += "-half-o";
                }
            }
            $star.addClass(classe);
            if (options.size > 1 && options.size <= 5 && (options.size + '').length === 1) {
                $star.addClass('fa-' + options.size + 'x');
            }
            $(e).append($star);
        }
        if (options.displayValue) {
            $(e).append('<span class="value"> (' + options.value + ')</span>');
        }

        // search for input element inside the box and update its value
        var input = $('input', e);
        if (input) {
            $(input).val(options.value);
        }
    }

    // get options for a specific rating box, including current value
    function getOptions(e, defaults) {
        var options = {};

        options.value = $(e).data('value');
        if (options.value == null || options.value == undefined) {
            options.value = defaults.value;
        }
        if (!$.isNumeric(options.value)) {
            options.value = 0;
        }

        options.mode = $(e).data('mode');
        if (!options.mode) {
            options.mode = defaults.mode;
        }
        if (options.mode.toLowerCase() === 'rating') {
            options.mode = 'rating';
        } else {
            options.mode = 'display';
        }

        options.displayValue = $(e).data('display-value');
        if (options.displayValue == null || options.displayValue == undefined) {
            options.displayValue = defaults.displayValue;
        }
        options.displayValue = options.displayValue === 'true' || options.displayValue === true;


        options.size = $(e).data('size');
        if (!options.size) {
            options.size = defaults.size;
        }
        if (!$.isNumeric(options.size)) {
            options.size = 1;
        }

        options.onClick = defaults.onClick;

        return options;
    }

    // Attach internal handlers
    function attachHandlers(e, options) {
        $(e).on('mouseover', '.fa', function () {
            var index = $(this).data('i');
            $('.fa', e).each(function (i, elem) {
                if (i + 1 <= index) {
                    $(elem).removeClass('fa-star-o fa-star-half-o');
                    $(elem).addClass('fa-star');
                } else {
                    $(elem).removeClass('fa-star fa-star-half-o');
                    $(elem).addClass('fa-star-o');
                }
            });
        });
        $(e).on('mouseleave', '.fa', function () {
            createBox(e, options);
        });
        $(e).on('click', '.fa', function () {
            var index = $(this).data('i');
            $(e).data('value', index);
            options.value = index;
            createBox(e, options);
        });

    }

    $.fn[pluginName] = function(options) {
        var args = arguments;

        if (options === undefined || typeof options === 'object') {
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            if (Array.prototype.slice.call(args, 1).length == 0 && $.inArray(options, $.fn[pluginName].getters) != -1) {
                var instance = $.data(this[0], 'plugin_' + pluginName);
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            } else {
                return this.each(function() {
                    var instance = $.data(this, 'plugin_' + pluginName);
                    if (instance instanceof Plugin && typeof instance[options] === 'function') {
                        instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    }
                });
            }
        }
    };

    $.fn[pluginName].defaults = {
        value: 0,            // Current value of the box (float 0 to 5)
        size: 1,             // Size of the box (1 to 5)
        displayValue: false, // Display current value on the right side
        mode: 'display',     // 'display' for read only mode, or 'rating' to allow user rating
        onClick: null        // Custom hanlder for 'click' event
    };

})(jQuery, window, document);
