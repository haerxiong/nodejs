/**
 * 每个小时的第一分钟开始执行
 */

var schedule = require("node-schedule");
var query = require('./db.js');
var dingpa = require('./dingpa.js');
var csto = require('./csto/dingpa.js');

var rule = new schedule.RecurrenceRule();
rule.minute = 1;

console.log("start...")
schedule.scheduleJob(rule, function(){
	// d();
	c();
});

function d() {
	console.log("执行任务dingpa");
	query("insert into log(remark,create_time) value(?,sysdate())", ['定时任务dingpa'], function(){});
	query("select * from category where isIT = 1", [], function(err, rs){
		for(var i=0;i<rs.length;i++) {
			dingpa.run(rs[i].href, rs[i].id);
		}
	});
}

var c = function() {
	console.log("执行任务csto");
	query("insert into log(remark,create_time) value(?,sysdate())", ['定时任务csto'], function(){});
	query("select * from csto_category where isIT = 1", [], function(err, rs){
		for(var i=0;i<rs.length;i++) {
			csto.run(rs[i].id, rs[i].href, rs[i].name);
		}
	});
}

// c();