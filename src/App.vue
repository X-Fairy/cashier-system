<template>
    <div id="app">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive">
          <!-- 这里是会被缓存的视图组件 -->
          </router-view>
        </keep-alive>
        <!-- 这里是不被缓存的视图组件 -->
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>

<script>
// 引入IndexedDB
// import Sqlite from '@/assets/js/sqlite.js'

export default {
  name: "App",
  
  data () {
    return {
      user:{
        name: 'Admin',
        coding: '000',
        position: '管理员',
        password: 'admin',
        jurisdiction: '一级',
        telephone: '###########'
      },
      // 
    }
  },
  created() {
    var db = openDatabase('myData','','',102400); 
    //开启SQLite数据库事务,它用一个回调函数作为参数表明要执行的语句 
    var _this=this;
    db.transaction(function(tx){
      // console.log(tx);
        //首先它创建一个数据库表，里面有3个字段 
        tx.executeSql('CREATE TABLE IF NOT EXISTS userData(coding TEXT,name TEXT,position TEXT,password TEXT,jurisdiction TEXT,telephone TEXT)',[]);
      //   tx.executeSql('INSERT INTO userData VALUES(?,?,?,?,?,?)' , [_this.user.coding,_this.user.name,_this.user.position,_this.user.password,_this.user.jurisdiction,_this.user.telephone],function(tx,rs){ 
      //         console.log("成功保存数据!");
      //   }, 
      //   //插入失败的回调就是在控制台上输入一行错误日志 
      //   function(tx,error){ 
      //       console.log(error.source+":"+error.message); 
      //   });
      //   tx.executeSql('SELECT * FROM userData',[],function(tx,rs){ 
      //     for(let i=0;i<rs.rows.length;i++){
      //       _this.$store.commit('addNewUser',rs.rows[i])
      //     }
      // }); 
    });
    db.transaction(function (context) {
      
    });
    db.transaction(function(tx){
        //首先它创建一个数据库表，里面有3个字段 
        tx.executeSql('CREATE TABLE IF NOT EXISTS goodsData(coding TEXT,name TEXT,price TEXT,number TEXT,category TEXT,date TEXT)',[]);
        tx.executeSql('SELECT * FROM goodsData',[],function(tx,rs){ 
          for(let i=0;i<rs.rows.length;i++){
            _this.$store.commit('addNewGoods',rs.rows[i])
          }
      });  
    });
  }
}
</script>

<style>
html, body, #app {
  height: 100%;
  min-width: 1500px;
}

</style>
