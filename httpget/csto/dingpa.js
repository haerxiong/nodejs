var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var query = require('../db.js');

var sql = "insert into csto_data(title,href,reward,ctn,manNums,create_time,category_id)"
		+ " value(?,?,?,?,?,sysdate(),?)";

var exist = "select 1 from csto_data where href = ?";

var run = function(category_id, type, type_val){
	var path = '/ajax/s?pg=1&'+type+'='+type_val;
	console.log('www.csto.com'+path);

	var http = require('http');  
	var options = {  
	    hostname: 'www.csto.com',  
	    path: encodeURI(path),  
	    method: 'GET'  
	};  
	var t = "";
	var req = http.request(options, function (res) {  
	    res.setEncoding('utf8');  
	    res.on('data', function (chunk) {  
	    	t += chunk;
	    });
	    res.on("end",function(){
	        var rs = JSON.parse(t);
	        $ = cheerio.load(rs.list,{decodeEntities: false});

	        $("dl ").each(function(item){
	        	var obj = {
	        		"reward" : $(this).find(".price").html().trim(),
	        	    "title" : $(this).find(".title").text().trim(),
	        	    "href" : $(this).find(".title a").attr("href"),
	        	    "manNums" : $(this).find(".num a").html().trim(),
	        	    "ctn" : $(this).find(".introduce").text()
	        	};
	        	query(exist, [obj.href], function(e, rs, fields){
					if(e)
						console.log(e);
					if(rs.length == 0) {
						query(sql, [
								obj.title,obj.href,obj.reward,obj.ctn
								,obj.manNums,category_id
							], function(e, rs, fields){
							if(e) {
								console.log(e);
							}
						});
					}
				});
	        });

	    });
	});
	req.on('error', function (e) {  
	    console.log('problem with request: ' + e.message);  
	});
	req.end();
}

module.exports = {
	run : run
}

// demo:
run("4", "type_9", "网站前端开发");