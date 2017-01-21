## 实现一个Promise
调用示例
```javascript
(function() {
    new Promise(function(resolve, reject) {
      	setTimeout(function() {
        	resolve('ok');
      	}, 1000);
    }).then(function(message) {
      	console.log(message);
      	return 1;
    }, function(err) {
      	console.log(err);
      	return 2;
    }).then(function(a) {
      	console.log(a);
    })
 })();
```


与[链式调用](https://github.com/PLDaily/blog/issues/27)的原理基本相同，唯一不同点是链式调用的参数直接传入，而Promise的函数参数为前一个函数执行的返回值。我们先将需要执行的函数存放在数组中，在执行next的时候传入前一个函数的返回值即可。