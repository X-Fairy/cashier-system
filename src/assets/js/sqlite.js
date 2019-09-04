export default {
    openDB(dbname, version, details,size) {
        
        // 浏览器版本号
        //  创建请求打开indexedDB
        var db = openDatabase(dbname,version,details,size); 
        db.transaction(function(tx){
            //首先它创建一个数据库表，里面有3个字段 
            tx.executeSql('',[],function(tx,rs){});
            //插入失败的回调就是在控制台上输入一行错误日志 
        });
    },
}