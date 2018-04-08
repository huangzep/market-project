/*大转盘旋转动画*/
import {prefixStyle} from 'common/js/dom'

const transform = prefixStyle('transform')
export default {
	rotate(el, start, end, callback, duration) {
		this.$el = el
    this._animateStartAngle = start || this._angle
    this.animateTo = end + 360 * 8
    this.duration = duration || 10000 
    this.callback = callback
    this._animateStart()
	},
	_animateStart() {	
		if (this._timer) {
			clearTimeout(this._timer);
		}
		this._animateStartTime = +new Date;
		this._animate();
	},
	 _animate() {
     let actualTime = +new Date;
     let checkEnd = actualTime - this._animateStartTime >  this.duration
     if (checkEnd) {
     	clearTimeout(this._timer)
     } else {
     	 let angle = this.easing(0, actualTime - this._animateStartTime, this._animateStartAngle, this.animateTo - this._animateStartAngle, this.duration);
       this._rotate((~~(angle*10))/10);

       this._timer = setTimeout(() => {
        this._animate.call(this)
       }, 10) 
     }        
     if (this.callback && checkEnd){
       this._angle = this.animateTo;
       this._rotate(this._angle);
       this.callback()
     }
  },
  _rotate(angle) {
  	this._angle = angle;
 	  this.$el.style[transform]="rotate("+(angle%360)+"deg)";
  },
  easing(x, t, b, c, d) {
  	return -c * ((t=t/d-1)*t*t*t - 1) + b; 
  }
}