/**
 * 数据库操作，直接引入此方法
 * @type {[type]}
 */
var mysql=require("mysql");  
var pool = mysql.createPool({  
    host: '47.92.159.35',  
    user: 'root',  
    password: 'wx2017',  
    database: 'dingpa',  
    port: '3306'  
});  
  
var query = function(sql,options,callback){  
    pool.getConnection(function(err,conn){  
        if(err){  
            callback(err,null,null);  
        }else{  
            conn.query(sql,options,function(err,results,fields){  
                //释放连接  
                conn.release();  
                //事件驱动回调  
                callback(err,results,fields);  
            });  
        }  
    });  
};  
  
module.exports = query;

/*query("insert into data(title,href) value(?,?)",['lw',3],function(e,rs,fields){
    console.log(e);
});*/

/*query("select 1 from data where href = ?",[2],function(e,rs,fields){
    console.log(rs.length);
});*/