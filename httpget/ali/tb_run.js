var request = require('request');
var cheerio = require('cheerio');
var co = require('co');
var fs = require('fs');
var iconv = require('iconv-lite');

exports.json = function(id){
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
			resove(info);
		});
	});
}

exports.html = function(id){
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
			// fs.writeFile(id+'.html', rs);
			$ = cheerio.load(rs,{decodeEntities: false});

			// 解析页面
			var dtl = {
				title : $(".tb-main-title").html().trim(),
				rate : $("#J_RateCounter").html().trim(),
				sale : $("#J_SellCounter").html().trim(),
				imgs : new Array,
				spec : new Array
			};
			// 解析缩略图
			$("#J_UlThumb li").each(function(i, e){
				dtl.imgs.push($(e).find("img").attr("data-src"));
			});
			// 解析规格
			$("#J_isku dl.J_Prop").each(function(i, e){
				var ary = {};
				$(e).find("li").each(function(ii, ee){
					ary[$(ee).attr('data-value')] = $(ee).find("a").text().trim();
				});
				dtl.spec.push({
					"type" : $(e).find("dt").html(),
					"ary" : ary
				});
			});
			resove(dtl);
		});
	});
}

var self = this;
var gid = "531414649886";
var test = function() {
	self.json(gid).then(function(value){
		var sku = value.data.dynStock.sku;
		self.html(gid).then(function(dtl){
			// console.log(dtl.spec[0].ary);
			console.log(sku);
		});
	});
}
// test();