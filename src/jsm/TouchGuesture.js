// handle touchstart, touchend, touchmove events on listenTarget
// fire slide left, right, up and down touch guesture events on dispatchTarget
var TouchGuesture = function (listenTarget = document, dispatchTarget = document) {
    var isStarted = false
    var currId = 0
    var startPageX = 0
    var startPageY = 0
    var enabled = true;
    var handleTouchStart = function (evt) {
        if (enabled && !isStarted) {
            var touches = evt.changedTouches;
            if (touches.length > 0) {
                isStarted = true;
                currId = touches[0].identifier
                startPageX = touches[0].pageX;
                startPageY = touches[0].pageY;
            }
        }
    }
    var handleTouchEnd = function (evt) {
        if (enabled && isStarted) {
            var touches = evt.changedTouches;
            for (var i = 0; i < touches.length; i++) {
                if (touches[i].identifier === currId) {
                    var deltaX = touches[i].pageX - startPageX;
                    var deltaY = touches[i].pageY - startPageY;
                    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                        if (Math.abs(deltaX) > Math.abs(deltaY)) {
                            if (deltaX > 0) {
                                dispatchTarget.dispatchEvent(new Event("touchGuestureRight"));
                            } else {
                                dispatchTarget.dispatchEvent(new Event("touchGuestureLeft"));
                            }
                        } else {
                            if (deltaY > 0) {
                                dispatchTarget.dispatchEvent(new Event("touchGuestureDown"));
                            } else {
                                dispatchTarget.dispatchEvent(new Event("touchGuestureUp"));
                            }
                        }
                    }

                    isStarted = false;
                    break;
                }
            }
        }
    }
    var handleTouchCancel = function (evt) {
        if (enabled && isStarted) {
            var touches = evt.changedTouches;
            for (var i = 0; i < touches.length; i++) {
                if (touches[i].identifier === currId) {
                    isStarted = false;
                    break;
                }
            }
        }
    }
    var handleTouchMove = function (evt) {
        if (enabled) {
            evt.preventDefault();
        }
    }

    listenTarget.addEventListener("touchstart", handleTouchStart);
    listenTarget.addEventListener("touchend", handleTouchEnd);
    listenTarget.addEventListener("touchcancel", handleTouchCancel);
    listenTarget.addEventListener("touchmove", handleTouchMove, { passive: false });

    this.isEnabled = function () { return enabled }

    /**
    * @param {boolean} val
    */
    this.setEnabled = function (val) { enabled = val }
}

export { TouchGuesture }