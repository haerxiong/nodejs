/**
 * 获取所有分类，插入数据库
 * @type {[type]}
 */
var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var query = require('./db.js');

var sql = "insert into category(name,href) value(?,?)";

request({
    url: 'http://task.zbj.com/t-rjkf/p1s5.html',
    // gzip: true,
    method: 'post'
}, function(err, response, body) {
	$ = cheerio.load(body,{decodeEntities: false});
	$(".list-category-nav .unstyled a").each(function(item){
    		// "href" : $(this).find(".list-task-title").attr('href')
		query(sql, [$(this).html(), $(this).attr('href')], function(e, rs, fields){
			
		});
	});
    // fs.writeFile('output.html', $(".tab-switch").html());
});
