/*
	用途：模拟豆瓣登录，并获取豆瓣FM收藏的歌曲信息（歌名、歌手、下载地址）	
	使用方法：填写用户名、密码，执行test函数即可。
	执行成功后，歌曲信息会保存到同目录的songs_info文件中
 */
var request = require('request');
var fs = require('fs');
const username = '用户名';
const pwd = '密码';

/* 
	登录豆瓣获取用户标识
	存储并返回用户cookie
*/
exports.login = function(){
	return new Promise(function(resove, reject){
		let t = '&name='+username+'&password='+pwd;
		request({
		    url: "https://accounts.douban.com/j/popup/login/basic",
		    encoding: null,
		    method: 'post',
		    headers: {
		    	"Content-Type" : "application/x-www-form-urlencoded"
		    },
		    body : 'source=fm&referer=https%3A%2F%2Fdouban.fm%2F&ck='+encodeURI(t)+'&captcha_solution=&captcha_id='
		}, function(err, response, body) {
			let setCookie = response.headers['set-cookie'];
			fs.writeFile('setCookie', setCookie);
			resove(setCookie);
		});
	});
}

/* 
	通过标识获取“喜欢的歌”的sid
	存储并返回喜欢歌曲sid串
*/
exports.red = function(cookie){
	return new Promise(function(resove, reject){
		request({
		    url: "https://douban.fm/j/v2/redheart/basic",
		    encoding: null,
		    method: 'post',
		    headers: {
		    	"Content-Type" : "application/x-www-form-urlencoded",
		    	"Cookie" : cookie
		    }
		}, function(err, response, body) {
			let res = unescape(body.toString().replace(/\\u/g, '%u'));
			res = res.substring(res.indexOf("{"), res.lastIndexOf("}")+1);
			// console.log(res);
			let info = JSON.parse(res);

			// sid保存到文件
			let list = info.songs;
			let title = "收藏歌量："+list.length+"\n";
			let txt = '';
			for(let i=0; i<list.length; i++) {
				txt += list[i].sid + "|";
			}
			fs.writeFile('sid_list', title + txt);
			resove(txt);
		});
	});
}

/* 
	通过标识、sid获取“喜欢的歌”的信息
	根据sid获取歌曲信息：名称、歌手、下载地址
*/
exports.infos = function(cookie,sidStr){
	return new Promise(function(resove, reject){
		// let body = 'sids=1904466%7C2530925&kbps=192&ck=uf3K';
		let body = 'sids='+encodeURI(sidStr)+'&kbps=192&ck=uf3K';
		request({
		    url: "https://douban.fm/j/v2/redheart/songs",
		    encoding: null,
		    method: 'post',
		    headers: {
		    	"Content-Type" : "application/x-www-form-urlencoded",
		    	"Cookie" : cookie
		    },
		    body: body
		}, function(err, response, body) {
			let res = unescape(body.toString().replace(/\\u/g, '%u'));
			let songs = JSON.parse(res);

			// sid保存到文件
			let txt = '';
			for(let i=0; i<songs.length; i++) {
				txt += songs[i].title + "\n";
				for(let j=0; j<songs[i].singers.length; j++) {
					txt += songs[i].singers[j].name + ",";
				}
				txt += '\n' + songs[i].url.replace(/\\/g, '') + "\n\n";
			}
			// fs.writeFile('songs_info', txt);
			console.log(txt);

			resove(songs);
		});
	});
}

var self = this;
var test = function() {
	self.login().then(function(ck){
		self.red(ck).then(function(sidStr) {
			// 去掉最后一个多余的'|'符号
			sidStr = sidStr.substring(0, sidStr.length-1);
			self.infos(ck, sidStr);
		});
	});
	
}
test();