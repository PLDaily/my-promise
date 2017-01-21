;(function(window, undefined) {
	var isFunction = function(obj) {
		return typeof obj == 'function';
	}

	function Promise(resolver) {
		if (!isFunction(resolver)) {
		    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
		}
		var _this = this;
		this.type = 'ok';//ok为resolve；err为reject
		this.resolveArr = [];
		this.rejectArr = [];
		var resolve = function(value) {
			_this.type = 'ok';
			setTimeout(function() {
				_this.next.call(_this, value, 'ok');
			}, 0);
		}
		var reject = function(value) {
			_this.type = 'err';
			setTimeout(function() {
				_this.next.call(this, value, 'err');
			}, 0)
		}
		resolver(resolve, reject);
	}

	Promise.prototype.next = function(value, type) {
		var fn = type == ok ? this.resolveArr.shift() : this.rejectArr.shift();
		fn&&fn(value);
	}

	Promise.prototype.then = function(thenResolve, thenReject) {
		var _this = this;
		if (!isFunction(thenResolve)) {
		    throw new TypeError('You must pass a thenResolver function as the first argument to the promise constructor');
		}
		if (!isFunction(thenReject)) {
		    throw new TypeError('You must pass a thenReject function as the first argument to the promise constructor');
		}
		Promise(function(resolve, reject) {
			function callback(value) {
				var ret = thenResolve(value);
				if(typeof ret != 'undefined') {
					resolve.call(this, ret);				
				}
			}
			function errback(value) {
				var ret = thenReject(value);
				if(typeof ret != 'undefined') {
					reject.call(this, ret);
				}
			}
			_this.type == 'ok' ? _this.resolveArr.push(callback) : _this.rejectArr.push(errback)
		});
		return this;
	}

})(window)