/**
 * 每个小时的第一分钟开始执行
 */

var schedule = require("node-schedule");
var query = require('../db.js');
var dingpa = require('./dingpa.js');

var rule = new schedule.RecurrenceRule();
rule.minute = 1;

console.log("start...")
schedule.scheduleJob(rule, function(){
	q();
});

function q() {
	console.log("执行任务");
	query("insert into log(remark,create_time) value(?,sysdate())", ['定时任务'], function(){});
	query("select * from csto_category where isIT = 1", ['定时任务'], function(err, rs){
		for(var i=0;i<rs.length;i++) {
			dingpa.run(rs[i].id, rs[i].href, rs[i].name);
		}
	});
}

// q();