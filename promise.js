;(function(window, undefined) {
	var isFunction = function(obj) {
		return typeof obj == 'function';
	}
	function Promise(func) {
		if(!isFunction(func)) {
			throw new TypeError('Promise参数必须为函数');
		}

		if(!(this instanceof Promise)) return new Promise(func);

		var that = this;
		this.type = '';
		this.resolveArr = [];
		this.rejectArr = [];

		var resolve = function(value) {
			that.type = 'ok';
			setTimeout(function() {
				that.next.call(this, value, 'ok')
			}, 0);
		}

		var reject = function(value) {
			that.type = 'err';
			setTimeout(function() {
				that.next.call(this, value, 'err')
			}, 0);
		}

		func(resolve, reject);

	}
	Promise.prototype.next = function(value, type) {
		var fn = type == 'ok' ? this.resolveArr.shift() : this.rejectArr.shift();
		fn&&fn(value);
	}
	Promise.prototype.then = function(thenResolve, thenReject) {
		if(!isFunction(thenResolve) || !isFunction(thenReject)) {
			throw new TypeError('then参数必须为函数');
		}

		var that = this;
		var thenResolveCallback = function(value) {
			var result = thenResolve(value);
			if(typeof result != 'undefined') {
				that.next.call(this, result, 'ok');
			}
		}
		var thenRejectCallback = function(value) {
			var result = thenReject(value);
			if(typeof result != 'undefined') {
				that.next.call(this, result, 'err');
			}
		}
		this.type == 'ok' ? this.resolveArr.push(thenResolveCallback) : this.rejectArr.push(thenRejectCallback);
		return this;
	}
	Promise.prototype.catch = function(catchRejectCallabck) {
		return this.then(undefined, catchRejectCallabck);
	}
})(window)