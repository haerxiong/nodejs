// 异步测试
var co = require("co");

var askhttp = function (name) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
        	console.log("hi"+name);
            resolve();
        }, 500);
    })
};

var run = function*() {
	yield askhttp("b");
	yield askhttp("a");
}

co(run).then(function(){
	console.log("ok")
}).then(function(){
	console.log("ok")
});