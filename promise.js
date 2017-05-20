;(function(window, undefined) {
	function isFunction(fn) {
		return Object.prototype.toString.call(fn)=== '[object Function]';
	}

	function isArray(arr) {
		return Object.prototype.toString.call(arr) === '[object Array]';
	}

	var PENDING = 0;
	var FULFILLED = 1;
	var REJECTED = 2;

	function Promise(func) {
		if(!isFunction(func)) {
			throw new TypeError('Promise参数必须为函数');
		}
		if(!(this instanceof Promise)) return new Promise(func);

		var that = this;
		this.state = PENDING;
		this.resolveArr = [];
		this.rejectArr = [];

		var resolve = function(value) {
			that.state = FULFILLED;
			setTimeout(function() {
				that.next.call(that, value);
			}, 0);
		}

		var reject = function(value) {
			that.state = REJECTED;
			setTimeout(function() {
				that.next.call(that, value);
			}, 0);
		}

		func(resolve, reject);

	}
	Promise.prototype.next = function(value) {
		var fn = this.state === FULFILLED ? this.resolveArr.shift() : this.rejectArr.shift();
		fn&&fn(value);
	}
	Promise.prototype.then = function(thenResolve, thenReject) {
		if(thenResolve && !isFunction(thenResolve) || thenReject && !isFunction(thenReject)) {
			throw new TypeError('then参数必须为函数');
		}

		var that = this;
		var thenResolveCallback = function(value) {
			var result = thenResolve(value);
			if(typeof result != 'undefined') {
				that.state = FULFILLED;
				that.next.call(that, result);
			}
		}
		var thenRejectCallback = function(value) {
			var result = thenReject(value);
			if(typeof result != 'undefined') {
				that.state = REJECTED;
				that.next.call(that, result);
			}
		}
		this.resolveArr.push(thenResolveCallback);
		this.rejectArr.push(thenRejectCallback);
		return this;
	}
	Promise.prototype.catch = function(catchReject) {
		return this.then(null, catchReject);
	}
	Promise.prototype.resolve = function(arg) {
		return new Promise(function(resolve, reject) {
			resolve(arg);
		});
	}
	Promise.prototype.reject = function(arg) {
		return new Promise(function(resolve, reject) {
			reject(arg);
		})
	}
	Promise.prototype.all = function(allArr) {
		if(!isArray(allArr)) {
			throw new TypeError('all参数必须为数组');
		}
		return this;
	}

	window.Promise = Promise;
})(window)

