<template>
    <div class="login">
       <!-- <div class="top">
            <img src="@/assets/images/order_logo.png" style="width: 117px; height: 76px;" alt="">
            <div class="title">
                <h2 class="wel">Welcome!</h2>
                <h3>熙美诚品订货系统</h3>
            </div>
       </div> -->
       <!-- <div class="center"> -->
            <el-form ref="user":model="user":rules="rules" class="form">
                <el-form-item style="display: flex;justify-content: center;">
                    <h2>熙美收银系统</h2>
                </el-form-item>
                <el-form-item prop="coding" >
                    <el-input class="log-input" v-model="user.coding" placeholder="用户名" prefix-icon="el-iconyonghuming"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input class="log-input" v-model="user.password" placeholder="密码" type="password" prefix-icon="el-iconmima" > </el-input>
                </el-form-item>
                <!-- <el-form-item  style="height: 40px;margin-bottom: 20px;" prop="seccode">
                    <el-input class="input" v-model="form.seccode" maxlength="8" placeholder="请输入验证码" prefix-icon="el-iconyanzhengma"></el-input>
                    <div class="divIdentifyingCode" @click="getIdentifyingCode(true)">
                        <img id="imgIdentifyingCode" style="height:40px; width: 100px; cursor: pointer;" alt="点击更换" title="点击更换" />
                    </div>
                </el-form-item> -->
                <el-form-item class="login">
                    <el-button type="primary" class="btn"  @click="login('user')" >登录/Login</el-button>
                </el-form-item>
            </el-form>
        <!-- </div> -->
       <!-- <div class="footer">
            <ul>
                <li>Select station</li>
                <li>杭州（中国）</li>
                <li>DuBai（UAE）</li>
                <li>U.S（Future）</li>
            </ul>
            <div class="content">
                <p>Copyright 2015 dh.xmcpcn.com 熙美诚品（浙江熙彬进出品有限公司） 版权所有 All Rights Reserved</p>
                <p>公司地址：浙江义乌市北苑街道丹溪北路728号熙美诚品大楼</p>
            </div>
       </div> -->
    </div>
</template>
<script>
// import IndexedDB from '../indexedDB/IndexedDB'
export default {
    data(){
        return{
            user: {
                coding: "",
                password: "",
            },
            rules: {
                coding: [{ required: true, message: "请输入用户名", trigger: "blur" }],
                password: [{ required: true, message: "请输入密码", trigger: "blur" }]
            }, 
        }
    },
    created(){

    },
    mounted(){
       
    },
    computed: {
       
    },
    methods: {
        login(form) {
            let obj = {};
            let users = this.$store.state.users.userList;
            users= users.reduce(function(item, next) {
                obj[next.coding] ? '' : obj[next.coding] = true && item.push(next);
                return item;
            }, []);
            console.log(users);
            let loginFlag = true;
            this.$refs[form].validate((valid) => {
                if (valid) {
                    for (let i = 0, len = users.length; i < len; i++) {
                        if (users[i].coding === this.user.coding) {
                            if (users[i].password === this.user.password) {
                                this.$store.commit('setCurrUser', users[i]);
                                this.$Message.success('登录成功');
                                this.loginFlag = false;
                                loginFlag = false;
                                this.$router.push({ path:'/index/shouyin'})
                            } else {
                                this.$Message.error('密码输入错误！'); 
                                this.user.password = '';
                                loginFlag = false;
                            }
                        }
                    }
                    if (loginFlag) {
                        this.$Message.error('账号不存在！'); 
                        this.$refs['user'].resetFields();
                    }
                } 
            });
        },
    }
}
</script>

