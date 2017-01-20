;(function(window, undefined) {
	function Promise(resolver) {
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
		if(type == 'ok') {
			var fn = this.resolveArr.shift();
		}else {
			var fn = this.rejectArr.shift();
		}
		fn&&fn(value);
	}

	Promise.prototype.then = function(thenResolve, thenReject) {
		var _this = this;
		Promise(function(resolve, reject) {
			function callback(value) {
				var ret = thenResolve(value);
				if(ret) {
					resolve.call(this, ret);				
				}
			}
			function errback(value) {
				var ret = thenReject(value);
				if(ret) {
					reject.call(this, ret);
				}
			}
			if(_this.type == 'ok') {
				_this.resolveArr.push(callback);
			}else {
				_this.rejectArr.push(errback);
			}
		});
		return this;
	}

})(window)