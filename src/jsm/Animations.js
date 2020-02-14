/**
 * generate Benzier curve by P0, P1, P2
 * @param {number} x0 - x of P0
 * @param {number} y0 - y of P0
 * @param {number} x1 - x of P1
 * @param {number} y1 - y of P1
 * @param {number} x2 - x of P2
 * @param {number} y2 - y of P2
 * 
 */
var genBezier2 = function (x0, y0, x1, y1, x2, y2, stepCnt) {
    var x = [];
    var y = [];
    var cnt = 1;
    while (cnt < stepCnt) {
        x.push(((stepCnt-cnt)**2*x0+2*cnt*(stepCnt-cnt)*x1+cnt**2*x2)/(stepCnt**2));
        y.push(((stepCnt-cnt)**2*y0+2*cnt*(stepCnt-cnt)*y1+cnt**2*y2)/(stepCnt**2));
        cnt++;
    }
    x.push(x2);
    y.push(y2);
    return {x,y};
}
/**
 * generate Benzier curve by P0, P1, P2, P3
 * @param {number} x0 - x of P0
 * @param {number} y0 - y of P0
 * @param {number} x1 - x of P1
 * @param {number} y1 - y of P1
 * @param {number} x2 - x of P2
 * @param {number} y2 - y of P2
 * @param {number} x3 - x of P3
 * @param {number} y3 - y of P3 
 */
var genBezier3 = function (x0, y0, x1, y1, x2, y2,x3,y3, stepCnt) {
    var x = [];
    var y = [];
    var cnt = 1;
    while (cnt < stepCnt) {
        x.push(((stepCnt-cnt)**3*x0+3*cnt*(stepCnt-cnt)**2*x1+3*cnt**2*(stepCnt-cnt)*x2+cnt**3*x3)/(stepCnt**3));
        y.push(((stepCnt-cnt)**3*y0+3*cnt*(stepCnt-cnt)**2*y1+3*cnt**2*(stepCnt-cnt)*y2+cnt**3*y3)/(stepCnt**3));
        cnt++;
    }
    x.push(x3);
    y.push(y3);
    return {x,y};
}

var moveX = function(x0,x1,duration,instance,timingArray){
    this.instance = instance;
    this.timingArray = timingArray;
    this.startTimestamp = null;
    this.start = function(){
        window.requestAnimationFrame(this.frame);
    }
    this.frame = timestamp => {
        if(this.startTimestamp===null){
            this.startTimestamp = timestamp;
        }
        if(timestamp-this.startTimestamp < duration){
            var t = Math.floor((timestamp-this.startTimestamp)*50/duration)
            this.instance.position.x = x0 + (x1-x0)*this.timingArray[t];
            window.requestAnimationFrame(this.frame);
        }else{
            this.instance.position.x = x1;
        }
    }
}

var moveZ = function(z0,z1,duration,instance,timingArray){
    this.instance = instance;
    this.timingArray = timingArray;
    this.startTimestamp = null;
    this.start = function(){
        window.requestAnimationFrame(this.frame);
    }
    this.frame = timestamp => {
        if(this.startTimestamp===null){
            this.startTimestamp = timestamp;
        }
        if(timestamp-this.startTimestamp < duration){
            var t = Math.floor((timestamp-this.startTimestamp)*50/duration)
            this.instance.position.z = z0 + (z1-z0)*this.timingArray[t];
            window.requestAnimationFrame(this.frame);
        }else{
            this.instance.position.z = z1;
        }
    }    
}

var moveY = function(y0,y1,duration,instance,timingArray){
    this.instance = instance;
    this.timingArray = timingArray;
    this.startTimestamp = null;
    this.start = function(){
        window.requestAnimationFrame(this.frame);
    }
    this.frame = timestamp => {
        if(this.startTimestamp===null){
            this.startTimestamp = timestamp;
        }
        if(timestamp-this.startTimestamp < duration){
            var t = Math.floor((timestamp-this.startTimestamp)*50/duration)
            this.instance.position.y = y0 + (y1-y0)*this.timingArray[t];
            window.requestAnimationFrame(this.frame);
        }else{
            this.instance.position.y = y1;
        }
    } 
}

export {genBezier2,genBezier3,moveX,moveZ,moveY};