var request = require('request');
var fs = require('fs');

// setInterval(t, '200');

function t(){
	request({
	    url: 'http://www.landbond.com/gb/2017-8-16/zhichi.php?id=49',
	    gzip: true,
	    method: 'post'
	}, function(err, response, body) {
	    console.log(body);
	    // fs.writeFile('output.html', body);
	});
}

for(var i=0;i<500;i++) {
	// t();
}


var t = parseInt("2147483647");
console.log(t+1);