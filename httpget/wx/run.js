var request = require("request");
var cheerio = require("cheerio");

var chk = function(code, resove, reject){
	// var url = "http://mp.weixin.qq.com/s/ohqcQJabVtgLr3PavWkptA1";
	var url = "http://mp.weixin.qq.com/s/" + code;
	// console.log(url);
	request({
		url: url
	}, function(e, resp, body){
		if(resp.headers.retkey != 11) {
			$ = cheerio.load(body,{decodeEntities: false});
			var title = $('.rich_media_title').html().trim();
			if(resove) {
				resove([url, title]);
			}
		}
	});
}

exports.chk = function(code){
	return new Promise(function(resove, reject){
		return chk(code, resove, reject);
	});
}

function randomWord(len){
    var str = "",
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    for(var i=0; i<len; i++){
        pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}

// "ohqcQJabVtgLr3PavWkptA"
var flag = 0;
var i = 0;
while(flag==0 && i < 1000){
	i++;
	var code = randomWord(20);
	if(i==1){
		code = "ohqcQJabVtgLr3PavWkptA";
	}
	this.chk(code).then(function(v){
		flag++;
		console.log(v);
	});
	chk(code);
}
// chk('ohqcQJabVtgLr3PavWkptA');