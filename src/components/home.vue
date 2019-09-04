<template>
        <div class="app-container">
            <!-- 左边菜单 -->
            <vAside />
            <!-- 右边内容 -->
            <div class="main-content" :class="isShow?'':'active'">
                <router-view />
            </div>
        </div>
    </template>
    
    <script>
    import vAside from './vAside.vue'
    
    export default {
        data(){
            return {
               isShow:true/*修改*/
            }
        },
        components: {
            vAside
        },
        methods:{
            
        }
    }
    </script>
    
    <style lang="less" scoped>
    .app-container{
        width: 100%;
        height: 100%;
        margin: 0 auto;
        position: relative;
        overflow: hidden;
        .main-content{
            margin-left: 100px;
            transition:margin-left 0.5s linear;
            height: 100%;
            position: relative;;
            width: 100%;
        }
        
    }
    </style>
    
    
    
    