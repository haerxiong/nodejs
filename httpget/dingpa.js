var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var query = require('./db.js');

var sql = "insert into data(title,href,reward,ctn,trusteeship,top,manNums,status,create_time,category_id)"
		+ " value(?,?,?,?,?,?,?,?,sysdate(),?)";

var exist = "select 1 from data where href = ?";

var run = function(url, category_id){
request({
    url: url,
    // gzip: true,
    method: 'post'
}, function(err, response, body) {
    // console.log(body);
	$ = cheerio.load(body,{decodeEntities: false});
	$(".tab-switch tr").each(function(item){
		var obj = {
			"title" : $(this).find(".list-task-title").attr('title'),// 标题
    		"href" : $(this).find(".list-task-title").attr('href'),// 链接
    		"reward" : $(this).find(".list-task-reward").html(),// 价格
    		"ctn" : $(this).find(".list-task-ctn").html(),// 简述
    		"trusteeship" : $(this).find(".list-task-trusteeship").html(),// 已托管
    		"top" : $(this).find(".list-vas-top").html(),// 置顶
    		"manNums" : $(this).find(".blue").html(),// 参与
    		"status" : $(this).find(".normal-p:nth-child(2)").text()// 状态
		};
		query(exist, [obj.href], function(e, rs, fields){
			if(e)
				console.log(e);
			if(rs.length == 0) {
				query(sql, [
						obj.title,obj.href,obj.reward,obj.ctn
						,obj.trusteeship,obj.top,obj.manNums,obj.status,category_id
					], function(e, rs, fields){
					if(e) {
						console.log(e);
					}
				});
			}
		});
	});
    // fs.writeFile('output.html', $(".tab-switch").html());
});
}

module.exports = {
	run : run
}

// demo:
// run('http://task.zbj.com/t-rjkf/p1s5.html', 1);