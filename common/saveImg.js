var http = require("http");
var fs = require("fs");

exports.downloadImg = function(url) {
    var filename = url.substring(url.lastIndexOf("/")+1);
    http.get(url, function(res){
        var imgData = "";
        res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开

        res.on("data", function(chunk){
            imgData+=chunk;
        });

        res.on("end", function(){
            fs.writeFile(filename, imgData, "binary", function(err){
                if(err){
                    console.log("down fail");
                }
                console.log("down success");
                var data = fs.readFileSync(filename,"utf-8");
                fs.writeFile(filename, data.replace(/400px/g, "40px"));
            });
        });
    });
}
var url = "http://china.nba.com/media/img/teams/logos/ATL_logo.svg";
// this.downloadImg(url);

var ary = ["OKC","POR","SAC","GSW","LAC","LAL","PHX","UTA","DEN","MIN","DAL","HOU","SAS","MIL","CHI"
,"DET","IND","CLE","PHI","NYK","BOS","BKN","MEM","CHA","ATL","ORL","MIA","NOP","WAS","TOR"];

for(i in ary) {
    this.downloadImg("http://china.nba.com/media/img/teams/logos/" + ary[i] + "_logo.svg");
}