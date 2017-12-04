var request = require('request');
var cheerio = require('cheerio');
var co = require('co');
var fs = require('fs');
var iconv = require('iconv-lite');

exports.json = function(id){
	return new Promise(function(resove, reject){
		var url = "https://mdskip.taobao.com/core/initItemDetail.htm?isPurchaseMallPage=false&isUseInventoryCenter=false&isAreaSell=false&tmallBuySupport=true&sellerPreview=false&queryMemberRight=false&tryBeforeBuy=false&cartEnable=true&isRegionLevel=false&cachedTimestamp=1511815191588&offlineShop=false&itemId="
			+id+"&isForbidBuyItem=false&household=false&showShopProm=false&isApparel=true&addressLevel=3&service3C=false&isSecKill=false&callback=setMdskip&timestamp=1511850455693&isg=null&isg2=AsXFMKzMM1kyMReFNoIGMsIv1AE_Kni5IXFOl8cqzPwLXuXQj9KJ5FM2HJ1J&ref=https%3A%2F%2Fwww.tmall.com%2F%3Fspm%3Da220o.1000855.a2226mz.1.46a363e4SqNZOb";
		request({
		    url: url,
		    // gzip: true,
		    encoding: null,
		    method: 'get',
		    headers: {
		    	"referer": "https://detail.tmall.com/item.htm?id="+id
		    }
		}, function(err, response, body) {
			var res = iconv.decode(new Buffer(body), 'gbk');
			// var res = unescape(body.toString().replace(/\\u/g, '%u'));
			res = res.substring(res.indexOf("{"), res.lastIndexOf("}")+1);
			// 原始库存、价格信息
			// fs.writeFile(id+'.json', res);
			var info = JSON.parse(res);
			resove(info);
		});
	});
}

exports.html = function(id){
	return new Promise(function(resove, reject){
		var url = "https://detail.tmall.com/item.htm?id="+id;
		request({
		    url: url,
		    // gzip: true,
		    encoding: null,
		    method: 'get'
		}, function(err, response, body) {
			var rs = iconv.decode(new Buffer(body), 'gbk');
			// console.log(rs);
			$ = cheerio.load(rs,{decodeEntities: false});
			
			fs.writeFile(id+'.html', rs);
			resove();
		});
	});
}

var self = this;
var gid = "41320110185";
var test = function() {
	self.json(gid).then(function(value){
		var q = value.defaultModel.inventoryDO;
		console.log(q);
		/*self.html(gid).then(function(dtl){
			console.log(sku);
		});*/
	});
}
test();