export function addClass(el, className) {
	if (hasClass(el, className)) return 
	let newClassName = el.className.split(' ')
	newClassName.push(className)
	el.className = newClassName.join(' ')
}

export function removeClass(el, className) {
	if (!hasClass(el, className)) return 
	let newClassName = el.className.split(' ')
	let index = newClassName.findIndex(item => {
		return item == className
	})
	newClassName.splice(index, 1)
	el.className = newClassName.join(' ')
}

export function hasClass(el, className) {
	let reg = new RegExp('(^|\\s)' + className + '($|\\s)')
	return reg.test(el.className)
}

export function getData(el, name, val) {
	const prefix = 'data-'
	name = prefix + name
	if (val) {
		return el.setAttribute(name, val)
	} else {
		return el.getAttribute(name)
	}
}

let elementStyle = document.createElement('div').style

let vendor = (() => {
	let transformNames = {
		webkit: 'webkitTransform',
		Moz: 'MozTransform',
		O: 'OTransform',
		ms: 'msTransform',
		standard: 'transform'
	}
	for (let key in transformNames) {
		if (elementStyle[transformNames[key]] !== undefined) {
			return key
		}
	}
	return false
})()

export function prefixStyle(style) {
	if (vendor === false) {
		return false
	}
	if (vendor === 'standard') {
		return style
	}
	return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

/*获取网页元素的绝对位置*/
export function getElementLeft(element){
　var actualLeft = element.offsetLeft;
　var current = element.offsetParent;
　while (current !== null){
　　actualLeft += current.offsetLeft;
　　current = current.offsetParent;
　}
　return actualLeft;
}

export function getElementTop(element){
　var actualTop = element.offsetTop;
　var current = element.offsetParent;
　while (current !== null){
　　actualTop += current.offsetTop;
　　current = current.offsetParent;
　}
　return actualTop;
}

export function extend(to, from) {
  for (let key in from) {
    to[key] = from[key];
  }
}

//改变标题
export function changeTitle(title) {
  document.title = title;
  var i = document.createElement('iframe');
  i.src = '//m.baidu.com/favicon.ico';
  i.style.display = 'none';
  i.onload = function() {
    setTimeout(function() {
      i.remove();
    }, 9);
  }
  document.body.appendChild(i);
}