var request = require('request');
var cheerio = require('cheerio');
var co = require('co');

var http = require('http');
var rs = "";
var options = {
	hostname: 'china.nba.com',
	path: '/teams/schedule/#!/knicks',
	method: 'GET'
};
var req = http.request(options, function(res) {
	res.setEncoding('utf8');
	res.on('data', function(chunk) {
		rs += chunk;
	});
	res.on('end', function(e) {
		console.log(rs);
	});
});
req.on('error', function(e) {
	console.log('problem with request: ' + e.message);
});
req.end();