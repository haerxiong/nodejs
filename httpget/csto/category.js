/**
 * 获取所有分类，插入数据库
 * @type {[type]}
 */
var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var query = require('../db.js');

var sql = "insert into csto_category(name,href) value(?,?)";

var http = require('http');  
var options = {  
    hostname: 'www.csto.com',  
    path: '/project/list?',  
    method: 'GET'  
};  
var req = http.request(options, function (res) {  
    res.setEncoding('utf8');  
    res.on('data', function (chunk) {  
        // console.log('BODY: ' + chunk);  
        $ = cheerio.load(chunk,{decodeEntities: false});
        $(".realm_set .hover_show ul li a").each(function(item){
			console.log($(this).html() + $(this).attr("s_name"));
			query(sql, [$(this).html(), $(this).attr('s_name')], function(e, rs, fields){
			});
		});
    });  
});  
req.on('error', function (e) {  
    console.log('problem with request: ' + e.message);  
});  
req.end();
