'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Widget = (function () {
    function Widget(selector) {
        _classCallCheck(this, Widget);

        this.selector = selector;
        this.div = $(this.selector);
        this.divDom = this.div[0];

        // mouse/touch input parameters
        this.pointerX = null;
        this.pointerY = null;
        this.savePointerX;
        this.savePointerY;
        this.mousePressed = false;
        this.isGesture = false;
        this.gestureRot = 0;
        this.gestureScale = 1.0;
    }

    _createClass(Widget, [{
        key: 'bindCallbacks',
        value: function bindCallbacks() {
            var _this = this;

            this.bind('mousedown', function (e) {
                return _this.mousedown(e);
            });
            this.bind('mousemove', function (e) {
                return _this.mousemove(e);
            });
            this.bind('mouseup', function (e) {
                return _this.mouseup(e);
            });
            this.bind('mousewheel', function (e) {
                return _this.mousewheel(e);
            });
            this.bind('DOMMouseScroll', function (e) {
                return _this.mousewheel(e);
            });
            this.bind('touchstart', function (e) {
                return _this.mousedown(e);
            });
            this.bind('touchmove', function (e) {
                return _this.mousemove(e);
            });
            this.bind('touchend', function (e) {
                return _this.mouseup(e);
            });
            this.bind('touchcancel', function (e) {
                return _this.mouseup(e);
            });
            this.bind('gesturestart', function (e) {
                return _this.gesturestart(e);
            });
            this.bind('gesturechange', function (e) {
                return _this.gesturechange(e);
            });
            this.bind('gestureend', function (e) {
                return _this.gestureend(e);
            });
        }
    }, {
        key: 'bind',
        value: function bind(eventType, callback) {

            this.divDom.addEventListener(eventType, callback);
        }
    }, {
        key: 'resize',
        value: function resize() {

            // override

        }
    }, {
        key: 'width',
        value: function width() {

            return this.div.width();
        }
    }, {
        key: 'height',
        value: function height() {

            return this.div.height();
        }
    }, {
        key: 'calcPointerXY',
        value: function calcPointerXY(event) {

            // calculation of div position by traversing DOM tree
            var top = 0;
            var left = 0;
            var dom = this.divDom;
            if (dom.offsetParent) {
                left = dom.offsetLeft;
                top = dom.offsetTop;
                while (dom = dom.offsetParent) {
                    left += dom.offsetLeft;
                    top += dom.offsetTop;
                }
            }
            dom = this.divDom;
            do {
                left -= dom.scrollLeft || 0;
                top -= dom.scrollTop || 0;
            } while (dom = dom.parentNode);

            if (!_.isUndefined(event.touches) && event.touches.length > 0) {
                this.eventX = event.touches[0].clientX;
                this.eventY = event.touches[0].clientY;
            } else {
                this.eventX = event.clientX;
                this.eventY = event.clientY;
            }

            this.pointerX = this.eventX - left;
            this.pointerY = this.eventY - top;
        }
    }, {
        key: 'savePointerXY',
        value: function savePointerXY() {

            this.savePointerX = this.pointerX;
            this.savePointerY = this.pointerY;
        }
    }, {
        key: 'mousedown',
        value: function mousedown(event) {

            this.calcPointerXY(event);

            event.preventDefault();

            this.mouseclick(event);

            var now = new Date().getTime();

            var isDoubleClick = now - this.timeLastPressed < 500;
            if (isDoubleClick) {
                this.mousedoubleclick(event);
            };

            this.timeLastPressed = now;

            this.savePointerXY();
            this.mousePressed = true;
        }
    }, {
        key: 'mousemove',
        value: function mousemove(event) {

            this.calcPointerXY(event);

            event.preventDefault();

            // skip if touch gesture has started
            if (this.isGesture) {
                return;
            }

            var shiftDown = event.shiftKey == 1;

            var rightMouse = event.button == 2 || event.which == 3;

            if (this.mousePressed) {

                if (rightMouse || shiftDown) {

                    this.rightmousedrag(this.savePointerX, this.savePointerY, this.pointerX, this.pointerY);
                } else {

                    this.leftmousedrag(this.savePointerX, this.savePointerY, this.pointerX, this.pointerY);
                }
            }

            this.savePointerXY();
        }
    }, {
        key: 'mouseup',
        value: function mouseup(event) {

            this.calcPointerXY(event);

            event.preventDefault();

            if (!_.isUndefined(event.touches)) {

                this.pointerX = null;
                this.pointerY = null;
            }

            this.mousePressed = false;
        }
    }, {
        key: 'gesturestart',
        value: function gesturestart(event) {

            event.preventDefault();
            this.isGesture = true;
            this.gestureRot = 0;
            this.gestureScale = event.scale * event.scale;
        }
    }, {
        key: 'gesturechange',
        value: function gesturechange(event) {

            event.preventDefault();
            gesturedrag(event.rotation - this.gestureRot, this.gestureScale / event.scale);

            this.gestureRot = event.rotation;
            this.gestureScale = event.scale;
        }
    }, {
        key: 'gestureend',
        value: function gestureend(event) {

            event.preventDefault();
            this.isGesture = false;
            this.mousePressed = false;
        }
    }, {
        key: 'mousewheel',
        value: function mousewheel(event) {

            event.preventDefault();

            if (!_.isUndefined(event.wheelDelta)) {
                var wheel = event.wheelDelta / 120;
            } else {
                // for Firefox
                var wheel = -event.detail / 12;
            }

            this.mousescroll(wheel);
        }

        // override these functions

    }, {
        key: 'mousescroll',
        value: function mousescroll(wheel) {}
    }, {
        key: 'mouseclick',
        value: function mouseclick(event) {}
    }, {
        key: 'mousedoubleclick',
        value: function mousedoubleclick(event) {}
    }, {
        key: 'leftmousedrag',
        value: function leftmousedrag(x0, y0, x1, y1) {}
    }, {
        key: 'rightmousedrag',
        value: function rightmousedrag(xDiff, yDiff) {}
    }, {
        key: 'gesturedrag',
        value: function gesturedrag(rot, scale) {}
    }]);

    return Widget;
})();

module.exports = Widget;

