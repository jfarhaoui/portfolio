/**
 * Created by Jacob on 19-1-2016.
 */
/**
 * SmoothScroll
 * This helper script created by DWUser.com.  Copyright 2012 DWUser.com.
 * Dual-licensed under the GPL and MIT licenses.
 * All individual scripts remain property of their copyrighters.
 * Date: 10-Sep-2012
 * Version: 1.0.1
 */
if (!window['jQuery']) alert('The jQuery library must be included before the smoothscroll.js file.  The plugin will not work propery.');

/**
 * jQuery.ScrollTo - Easy element scrolling using jQuery.
 * Copyright (c) 2007-2012 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * @author Ariel Flesler
 * @version 1.4.3.1
 */
;
(function($) {
    var h = $.scrollTo = function(a, b, c) {
        $(window).scrollTo(a, b, c)
    };
    h.defaults = {
        axis: 'xy',
        duration: parseFloat($.fn.jquery) >= 1.3 ? 0 : 1,
        limit: true
    };
    h.window = function(a) {
        return $(window)._scrollable()
    };
    $.fn._scrollable = function() {
        return this.map(function() {
            var a = this,
                isWin = !a.nodeName || $.inArray(a.nodeName.toLowerCase(), ['iframe', '#document', 'html', 'body']) != -1;
            if (!isWin) return a;
            var b = (a.contentWindow || a).document || a.ownerDocument || a;
            return /webkit/i.test(navigator.userAgent) || b.compatMode == 'BackCompat' ? b.body : b.documentElement
        })
    };
    $.fn.scrollTo = function(e, f, g) {
        if (typeof f == 'object') {
            g = f;
            f = 0
        }
        if (typeof g == 'function') g = {
            onAfter: g
        };
        if (e == 'max') e = 9e9;
        g = $.extend({}, h.defaults, g);
        f = f || g.duration;
        g.queue = g.queue && g.axis.length > 1;
        if (g.queue) f /= 2;
        g.offset = both(g.offset);
        g.over = both(g.over);
        return this._scrollable().each(function() {
            if (e == null) return;
            var d = this,
                $elem = $(d),
                targ = e,
                toff, attr = {},
                win = $elem.is('html,body');
            switch (typeof targ) {
                case 'number':
                case 'string':
                    if (/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(targ)) {
                        targ = both(targ);
                        break
                    }
                    targ = $(targ, this);
                    if (!targ.length) return;
                case 'object':
                    if (targ.is || targ.style) toff = (targ = $(targ)).offset()
            }
            $.each(g.axis.split(''), function(i, a) {
                var b = a == 'x' ? 'Left' : 'Top',
                    pos = b.toLowerCase(),
                    key = 'scroll' + b,
                    old = d[key],
                    max = h.max(d, a);
                if (toff) {
                    attr[key] = toff[pos] + (win ? 0 : old - $elem.offset()[pos]);
                    if (g.margin) {
                        attr[key] -= parseInt(targ.css('margin' + b)) || 0;
                        attr[key] -= parseInt(targ.css('border' + b + 'Width')) || 0
                    }
                    attr[key] += g.offset[pos] || 0;
                    if (g.over[pos]) attr[key] += targ[a == 'x' ? 'width' : 'height']() * g.over[pos]
                } else {
                    var c = targ[pos];
                    attr[key] = c.slice && c.slice(-1) == '%' ? parseFloat(c) / 100 * max : c
                }
                if (g.limit && /^\d+$/.test(attr[key])) attr[key] = attr[key] <= 0 ? 0 : Math.min(attr[key], max);
                if (!i && g.queue) {
                    if (old != attr[key]) animate(g.onAfterFirst);
                    delete attr[key]
                }
            });
            animate(g.onAfter);

            function animate(a) {
                $elem.animate(attr, f, g.easing, a && function() {
                        a.call(this, e, g)
                    })
            }
        }).end()
    };
    h.max = function(a, b) {
        var c = b == 'x' ? 'Width' : 'Height',
            scroll = 'scroll' + c;
        if (!$(a).is('html,body')) return a[scroll] - $(a)[c.toLowerCase()]();
        var d = 'client' + c,
            html = a.ownerDocument.documentElement,
            body = a.ownerDocument.body;
        return Math.max(html[scroll], body[scroll]) - Math.min(html[d], body[d])
    };

    function both(a) {
        return typeof a == 'object' ? a : {
            top: a,
            left: a
        }
    }
})(jQuery);

/**
 * jQuery.LocalScroll
 * Copyright (c) 2007-2010 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 05/31/2010
 * @author Ariel Flesler
 * @version 1.2.8b
 **/
;
(function(b) {
    function g(a, e, d) {
        var h = e.hash.slice(1),
            f = document.getElementById(h) || document.getElementsByName(h)[0];
        if (f) {
            a && a.preventDefault();
            var c = b(d.target);
            if (!(d.lock && c.is(":animated") || d.onBefore && !1 === d.onBefore(a, f, c))) {
                d.stop && c._scrollable().stop(!0);
                if (d.hash) {
                    var a = f.id == h ? "id" : "name",
                        g = b("<a> </a>").attr(a, h).css({
                            position: "absolute",
                            top: b(window).scrollTop(),
                            left: b(window).scrollLeft()
                        });
                    f[a] = "";
                    b("body").prepend(g);
                    location = e.hash;
                    g.remove();
                    f[a] = h
                }
                c.scrollTo(f, d).trigger("notify.serialScroll", [f])
            }
        }
    }
    var i = location.href.replace(/#.*/, ""),
        c = b.localScroll = function(a) {
            b("body").localScroll(a)
        };
    c.defaults = {
        duration: 1E3,
        axis: "y",
        event: "click",
        stop: !0,
        target: window,
        reset: !0
    };
    c.hash = function(a) {
        if (location.hash) {
            a = b.extend({}, c.defaults, a);
            a.hash = !1;
            if (a.reset) {
                var e = a.duration;
                delete a.duration;
                b(a.target).scrollTo(0, a);
                a.duration = e
            }
            g(0, location, a)
        }
    };
    b.fn.localScroll = function(a) {
        function e() {
            return !!this.href && !!this.hash && this.href.replace(this.hash, "") == i && (!a.filter || b(this).is(a.filter))
        }
        a = b.extend({}, c.defaults, a);
        return a.lazy ? this.bind(a.event, function(d) {
            var c = b([d.target, d.target.parentNode]).filter(e)[0];
            c && g(d, c, a)
        }) : this.find("a,area").filter(e).bind(a.event, function(b) {
            g(b, this, a)
        }).end().end()
    }
})(jQuery);

// Initialize all .smoothScroll links
jQuery(function($) {
    $.localScroll({
        filter: '.smoothScroll'
    });
});

//expand images
jQuery.noConflict()

jQuery.imageMagnify = {
    dsettings: {
        magnifyby: 2, //default increase factor of enlarged image
        duration: 500, //default duration of animation, in millisec
        imgopacity: 0.2 //opacify of original image when enlarged image overlays it
    },
    cursorcss: 'url(magnify.cur), -moz-zoom-in', //Value for CSS's 'cursor' attribute, added to original image
    zIndexcounter: 100,

    refreshoffsets: function($window, $target, warpshell) {
        var $offsets = $target.offset()
        var winattrs = {
            x: $window.scrollLeft(),
            y: $window.scrollTop(),
            w: $window.width(),
            h: $window.height()
        }
        warpshell.attrs.x = $offsets.left //update x position of original image relative to page
        warpshell.attrs.y = $offsets.top
        warpshell.newattrs.x = winattrs.x + winattrs.w / 2 - warpshell.newattrs.w / 2
        warpshell.newattrs.y = winattrs.y + winattrs.h / 2 - warpshell.newattrs.h / 2
        if (warpshell.newattrs.x < winattrs.x + 5) { //no space to the left?
            warpshell.newattrs.x = winattrs.x + 5
        } else if (warpshell.newattrs.x + warpshell.newattrs.w > winattrs.x + winattrs.w) { //no space to the right?
            warpshell.newattrs.x = winattrs.x + 5
        }
        if (warpshell.newattrs.y < winattrs.y + 5) { //no space at the top?
            warpshell.newattrs.y = winattrs.y + 5
        }
    },

    magnify: function($, $target, options) {
        var setting = {} //create blank object to store combined settings
        var setting = jQuery.extend(setting, this.dsettings, options)
        var attrs = (options.thumbdimensions) ? {
            w: options.thumbdimensions[0],
            h: options.thumbdimensions[1]
        } : {
            w: $target.outerWidth(),
            h: $target.outerHeight()
        }
        var newattrs = {}
        newattrs.w = (setting.magnifyto) ? setting.magnifyto : Math.round(attrs.w * setting.magnifyby)
        newattrs.h = (setting.magnifyto) ? Math.round(attrs.h * newattrs.w / attrs.w) : Math.round(attrs.h * setting.magnifyby)
        $target.css('cursor', jQuery.imageMagnify.cursorcss)
        if ($target.data('imgshell')) {
            $target.data('imgshell').$clone.remove()
            $target.css({
                opacity: 1
            }).unbind('click.magnify')
        }
        var $clone = $target.clone().css({
            position: 'absolute',
            left: 0,
            top: 0,
            visibility: 'hidden',
            border: '1px solid gray',
            cursor: 'pointer'
        }).appendTo(document.body)
        $clone.data('$relatedtarget', $target) //save $target image this enlarged image is associated with
        $target.data('imgshell', {
            $clone: $clone,
            attrs: attrs,
            newattrs: newattrs
        })
        $target.bind('click.magnify', function(e) { //action when original image is clicked on
            var $this = $(this).css({
                opacity: setting.imgopacity
            })
            var imageinfo = $this.data('imgshell')
            jQuery.imageMagnify.refreshoffsets($(window), $this, imageinfo) //refresh offset positions of original and warped images
            var $clone = imageinfo.$clone
            $clone.stop().css({
                    zIndex: ++jQuery.imageMagnify.zIndexcounter,
                    left: imageinfo.attrs.x,
                    top: imageinfo.attrs.y,
                    width: imageinfo.attrs.w,
                    height: imageinfo.attrs.h,
                    opacity: 0,
                    visibility: 'visible',
                    display: 'block'
                })
                .animate({
                        opacity: 1,
                        left: imageinfo.newattrs.x,
                        top: imageinfo.newattrs.y,
                        width: imageinfo.newattrs.w,
                        height: imageinfo.newattrs.h
                    }, setting.duration,
                    function() { //callback function after warping is complete
                        //none added
                    }) //end animate
        }) //end click
        $clone.click(function(e) { //action when magnified image is clicked on
            var $this = $(this)
            var imageinfo = $this.data('$relatedtarget').data('imgshell')
            jQuery.imageMagnify.refreshoffsets($(window), $this.data('$relatedtarget'), imageinfo) //refresh offset positions of original and warped images
            $this.stop().animate({
                    opacity: 0,
                    left: imageinfo.attrs.x,
                    top: imageinfo.attrs.y,
                    width: imageinfo.attrs.w,
                    height: imageinfo.attrs.h
                }, setting.duration,
                function() {
                    $this.hide()
                    $this.data('$relatedtarget').css({
                        opacity: 1
                    }) //reveal original image
                }) //end animate
        }) //end click
    }
};

jQuery.fn.imageMagnify = function(options) {
    var $ = jQuery
    return this.each(function() { //return jQuery obj
        var $imgref = $(this)
        if (this.tagName != "IMG")
            return true //skip to next matched element
        if (parseInt($imgref.css('width')) > 0 && parseInt($imgref.css('height')) > 0 || options.thumbdimensions) { //if image has explicit width/height attrs defined
            jQuery.imageMagnify.magnify($, $imgref, options)
        } else if (this.complete) { //account for IE not firing image.onload
            jQuery.imageMagnify.magnify($, $imgref, options)
        } else {
            $(this).bind('load', function() {
                jQuery.imageMagnify.magnify($, $imgref, options)
            })
        }
    })
};

jQuery.fn.applyMagnifier = function(options) { //dynamic version of imageMagnify() to apply magnify effect to an image dynamically
    var $ = jQuery
    return this.each(function() { //return jQuery obj
        var $imgref = $(this)
        if (this.tagName != "IMG")
            return true //skip to next matched element

    })

};


//** The following applies the magnify effect to images with class="magnify" and optional "data-magnifyby" and "data-magnifyduration" attrs
//** It also looks for links with attr rel="magnify[targetimageid]" and makes them togglers for that image

jQuery(document).ready(function($) {
    var $targets = $('.magnify')
    $targets.each(function(i) {
        var $target = $(this)
        var options = {}
        if ($target.attr('data-magnifyto'))
            options.magnifyto = parseFloat($target.attr('data-magnifyto'))
        if ($target.attr('data-magnifyby'))
            options.magnifyby = parseFloat($target.attr('data-magnifyby'))
        if ($target.attr('data-magnifyduration'))
            options.duration = parseInt($target.attr('data-magnifyduration'))
        $target.imageMagnify(options)
    })
    var $triggers = $('a[rel^="magnify["]')
    $triggers.each(function(i) {
        var $trigger = $(this)
        var targetid = $trigger.attr('rel').match(/\[.+\]/)[0].replace(/[\[\]']/g, '') //parse 'id' from rel='magnify[id]'
        $trigger.data('magnifyimageid', targetid)
        $trigger.click(function(e) {
            $('#' + $(this).data('magnifyimageid')).trigger('click.magnify')
            e.preventDefault()
        })
    })
})