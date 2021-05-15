function Slider() {
	this.sldrRoot = document.querySelector('.background')
	this.sldrList = this.sldrRoot.querySelector('.slider-list');
	this.sldrElements = this.sldrList.querySelectorAll('.image');
	this.sldrElemFirst = this.sldrList.querySelector('.image');
	this.leftArrow = this.sldrRoot.querySelector('div.slider-arrow-left');
	this.rightArrow = this.sldrRoot.querySelector('div.slider-arrow-right');
	this.indicatorDots = this.sldrRoot.querySelector('div.slider-dots');
	this.sldrButton = this.sldrRoot.querySelector('.slider-button');
	this.auto = true;
	this.options = Slider.defaults;
	Slider.initialize(this)
};

Slider.defaults = {
	loop: true, 
	interval: 2000,
	buttons: true,
	dots: true,
	button: true
};

Slider.prototype.elemPrev = function(num) {
	num = num || 1;
	
	let prevElement = this.currentElement;
	this.currentElement -= num;
	if(this.currentElement < 0) this.currentElement = this.elemCount-1;

	if(!this.options.loop) {
		if(this.currentElement == 0) {
			this.leftArrow.style.display = 'none'
		};
		this.rightArrow.style.display = 'block'
	};
	
	this.sldrElements[this.currentElement].style.opacity = '1';
	this.sldrElements[prevElement].style.opacity = '0';

	if(this.options.dots) {
		this.dotOn(prevElement); this.dotOff(this.currentElement)
	}
	localStorage.setItem('slideIndexStorage',Number(this.currentElement));
};

Slider.prototype.elemNext = function(num) {
	num = num || 1;
	
	let prevElement = this.currentElement;
	this.currentElement += num;
	if(this.currentElement >= this.elemCount) this.currentElement = 0;

	if(!this.options.loop) {
		if(this.currentElement == this.elemCount-1) {
			this.rightArrow.style.display = 'none'
		};
		this.leftArrow.style.display = 'block'
	};
	this.sldrElements[this.currentElement].style.opacity = '1';
	this.sldrElements[prevElement].style.opacity = '0';

	if(this.options.dots) {
		this.dotOn(prevElement); this.dotOff(this.currentElement)
	}
	localStorage.setItem('slideIndexStorage', Number(this.currentElement));
};

Slider.prototype.dotOn = function(num) {
	this.indicatorDotsAll[num].style.cssText = 'background-color:#DEB887; cursor:pointer;'
};

Slider.prototype.dotOff = function(num) {
	this.indicatorDotsAll[num].style.cssText = 'background-color:#CD853F; cursor:default;'
};

Slider.initialize = function(that) {
	let status = 0;
	let auto = 0;
	let slideIndex;
	that.elemCount = that.sldrElements.length;
	if (localStorage.hasOwnProperty('slideIndexStorage')){
		slideIndex = Number(localStorage.getItem('slideIndexStorage'));
		that.currentElement = slideIndex;
	}else{
		that.currentElement = 0;
	}
	if (localStorage.hasOwnProperty('auto')){
		status = Number(localStorage.getItem('auto'));
		that.currentElement = slideIndex;
	}else{
		localStorage.setItem('auto',0);
	}

	let bgTime = getTime();

	function getTime() {
		return new Date().getTime();
	};
	function setAutoScroll() {
		that.autoScroll = setInterval(function() {
			let fnTime = getTime();
			if(fnTime - bgTime + 10 > that.options.interval) {
				bgTime = fnTime; that.elemNext()
			}
		}, that.options.interval)
	};
	if(that.elemCount <= 1) {
		that.options.auto = false; that.options.buttons = false; that.options.dots = false;
		that.leftArrow.style.display = 'none'; that.rightArrow.style.display = 'none'
	};
	if(that.elemCount >= 1) {  
		that.sldrElements[that.currentElement].style.opacity = '1';
	};
	if(!that.options.loop) {
		that.leftArrow.style.display = 'none';
		that.options.auto = false;
	}
	if (status == 1) {
		document.getElementById('p1').innerHTML = 'STOP';
		setAutoScroll();
	}else if (status == 0){
		document.getElementById('p1').innerHTML = 'START';
		{clearInterval(that.autoScroll)};
		auto = false;
	};

	if(that.options.buttons) {
		that.leftArrow.addEventListener('click', function() {
			let fnTime = getTime();
			if(fnTime - bgTime > 1000) {
				bgTime = fnTime; that.elemPrev()
			}
		}, false);
		that.rightArrow.addEventListener('click', function() {
			let fnTime = getTime();
			if(fnTime - bgTime > 1000) {
				bgTime = fnTime; that.elemNext()
			}
		}, false);
		addEventListener('keyup', function(event) {
    		if (event.keyCode == 37){
      		let fnTime = getTime();
				if(fnTime - bgTime > 1000) {
					bgTime = fnTime; that.elemPrev()
                }
            }    
		}, false);
		addEventListener('keyup', function(event) {
    		if (event.keyCode == 39){
      		let fnTime = getTime();
				if(fnTime - bgTime > 1000) {
					bgTime = fnTime; that.elemNext()
                }
            }    
		}, false);
		that.sldrButton.addEventListener('click', function() {
			if (status == 0) {
    			document.getElementById('p1').innerHTML = 'STOP';
    			setAutoScroll();
    			status = 1;
    			that.auto = true;
    			localStorage.setItem('auto', 1);
  			}
  			else {
    			document.getElementById('p1').innerHTML = 'START';
    			{clearInterval(that.autoScroll)};
    			status = 0;
    			that.auto = false;
    			localStorage.setItem('auto', 0);
  				}
		}, false);
	}
	else {
		that.leftArrow.style.display = 'none'; that.rightArrow.style.display = 'none'
	};
	if(that.options.dots){
		let sum = '', diffNum;
		for(let i=0; i<that.elemCount; i++) {
			sum += '<span class="dot"></span>'
		};

		that.indicatorDots.innerHTML = sum;
		that.indicatorDotsAll = that.sldrRoot.querySelectorAll('span.dot');

		for(let n=0; n<that.elemCount; n++) {
			that.indicatorDotsAll[n].addEventListener('click', function() {
				diffNum = Math.abs(n - that.currentElement);
				if(n < that.currentElement) {
					bgTime = getTime(); that.elemPrev(diffNum)
				}
				else if(n > that.currentElement) {
					bgTime = getTime(); that.elemNext(diffNum)
				}
			}, false)
		};
		that.dotOff(slideIndex);  
		for(let i=0; i<that.elemCount; i++) {
			if(i != slideIndex){
			that.dotOn(i)
			}
		}
	}
};
