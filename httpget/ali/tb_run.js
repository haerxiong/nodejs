var request = require('request');
var cheerio = require('cheerio');
var co = require('co');
var fs = require('fs');
var iconv = require('iconv-lite');

var json = function(id){
	return new Promise(function(resove, reject){
		var url = "https://detailskip.taobao.com/service/getData/1/p1/item/detail/sib.htm?itemId="+id+"&sellerId=202302469&modules=dynStock,qrcode,viewer,price,duty,xmpPromotion,delivery,upp,activity,fqg,zjys,couponActivity,soldQuantity,originalPrice,tradeContract&callback=onSibRequestSuccess";
		request({
		    url: url,
		    // gzip: true,
		    encoding: null,
		    method: 'get',
		    headers: {
		    	"referer": "https://item.taobao.com/item.htm?id="+id
		    }
		}, function(err, response, body) {
			var res = unescape(body.toString().replace(/\\u/g, '%u'));
			res = res.substring(res.indexOf("{"), res.lastIndexOf("}")+1);
			// 原始库存、价格信息
			// fs.writeFile(id+'.json', res);
			var info = JSON.parse(res);
			console.log(info.data.dynStock.sellableQuantity);
			resove();
		});
	});
}

var html = function(id){
	return new Promise(function(resove, reject){
		var url = "https://item.taobao.com/item.htm?id="+id;
		request({
		    url: url,
		    // gzip: true,
		    encoding: null,
		    method: 'get'
		}, function(err, response, body) {
			var rs = iconv.decode(new Buffer(body), 'gbk');
			// console.log(rs);
			$ = cheerio.load(rs,{decodeEntities: false});
			
			// fs.writeFile(id+'.html', rs);
			resove();
		});
	});
}

html("531414649886");