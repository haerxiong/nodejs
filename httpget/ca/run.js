var request = require('request');
var cheerio = require('cheerio');
var co = require('co');

var inArray = [];
// inArray = ["男", "裤"];
var output = function(id){
	return new Promise(function(resove, reject){
		// http://www.canda.cn/200199300.html
		// http://www.canda.cn/200197099.html
		var url = "http://www.canda.cn/20019"+id+".html";
		request({
		    url: url,
		    // gzip: true,
		    method: 'post'
		}, function(err, response, body) {
			// console.log(url);
			if(!response.headers.status || response.headers.status.indexOf('404')<0) {
				$ = cheerio.load(body,{decodeEntities: false});
				var name = $(".product-name").html().trim();
				var price = $(".price").html().trim();
				var flag = true;
				for(var i=0;i<inArray.length;i++) {
					if(name.indexOf(inArray[i])<0) {
						flag = false;break;
					}
				}
				if(flag) {
					console.log(name + " " + price + " " + url);
				}
			}
			resove();
		});
	});
}
output(9298);
co(function*(){
	// yield output(8829);
	// yield output(7099);
	// yield output(9298);
});
/*for(var i=0;i<1000;i++) {
	var t = i + "";
	switch(t.length) {
	case 1:
		t = "000" + t;
		break;
	case 2:
		t = "00" + t;
		break;
    case 3:
    	t = "0" + t;
		break;
	}
	output(t);
}*/