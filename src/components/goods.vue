<template>
    <div class="goods">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
            <el-menu-item v-for="item in category" :key="item.index" :index="item.index">{{item.name}}</el-menu-item>
            <el-menu-item style="margin-left: 100px;">
                <el-input clearable placeholder="请输入商品名称" suffix-icon="el-iconsearch-copy" v-model="goodname" style="width: 300px;"></el-input>
            </el-menu-item>
        </el-menu>
        <div class="add">
            <Button type="primary" @click="addGood">商品入库</Button>
        </div>
        <div class="table">
            <Table border :height="tableHeight" :columns="columns" :data="tableData"></Table>
        </div>
        <div class="footer">
            <!-- 分页  -->
            <Page  :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
        <!-- 商品入库 -->
        <Modal v-model="isShow" title="新增商品"  cancel-text ok-text="关闭">
            <Form ref="newGoods" :model="newGoods" :rules="ruleValidate" :label-width="100"> 
                <FormItem label="商品编码" prop="coding"> 
                    <Input v-model="newGoods.coding" placeholder="请输入商品编码" clearable></Input> 
                </FormItem> 
                <FormItem label="商品名称" prop="name"> 
                    <Input v-model="newGoods.name" placeholder="请输入商品名称" clearable></Input> 
                </FormItem> 
                <FormItem label="商品单价" prop="price"> 
                    <Input v-model="newGoods.price" placeholder="请输入商品单价" clearable></Input> 
                </FormItem>
                <FormItem label="商品数量" prop="number"> 
                    <Input v-model="newGoods.number" placeholder="请输入商品数量" clearable></Input> 
                </FormItem>
                <FormItem label="商品分类" prop="category"> 
                    <Select v-model="newGoods.category" placeholder="请选择商品分类"> 
                        <Option v-for="item in category" :key="item.index" :value="item.name">{{item.name}}</Option> 
                    </Select> 
                </FormItem>
                <FormItem label="入库时间" prop="date">
                    <DatePicker type="datetime" v-model="newGoods.date"  placeholder="请选择入库时间" style="width: 390px"></DatePicker>
                </FormItem> 
                <FormItem label="商品图片" prop="img" class="images"> 
                    <Upload v-model="newGoods.img" multiple action="//jsonplaceholder.typicode.com/posts/e" :on-success="uploadImage" :format="['jpg','jpeg','png']" :on-format-error="handleFormatError">
                        <Button type="ghost" icon="images" class="ghost" >上传图片</Button>
                    </Upload>
                    <Button class="look_image" icon="eye" v-if="isShowImageButton" @click="carouse=true">查看上传图片</Button>                    
                </FormItem> 
                <FormItem class="btn"> 
                    <Button type="primary" @click="handleSubmit('newGoods')">提交</Button>
                    <Button type="ghost" @click="handleReset('newGoods')" style="margin-left: 8px">重置</Button>
                </FormItem> 
            </Form>
        </Modal>
        <!-- 修改商品信息 -->
        <Modal title="修改商品信息" v-model="setGoodsFlag" :styles="{top: '20px'}" width="400"> 
            <Form ref="setGoods" :model="setGoods" :rules="checkSetGoods" :label-width="80"> 
                <FormItem label="商品编码" prop="coding"> 
                    <Input v-model="setGoods.coding"  readonly></Input> 
                </FormItem> 
                <FormItem label="商品名称" prop="name"> 
                    <Input v-model="setGoods.name"></Input> 
                </FormItem> 
                <FormItem label="商品单价" prop="price"> 
                    <Input v-model.number="setGoods.price"></Input> 
                </FormItem> 
                <FormItem label="商品库存" prop="number"> 
                    <Input v-model.number="setGoods.number"></Input> 
                </FormItem> 
                <FormItem label="商品分类" prop="category"> 
                    <Select v-model="setGoods.category" placeholder="请选择商品分类"> 
                        <Option v-for="item in category" :key="item.index" :value="item.name">{{item.name}}</Option> 
                    </Select> 
                </FormItem>
                <FormItem label="入库时间" prop="date">
                    <DatePicker type="datetime" v-model="setGoods.date"  placeholder="请选择入库时间"></DatePicker>
                </FormItem> 
            </Form>
            <div class="set-goods-footer" slot="footer">
                <Button type="success"  @click="submitChangeGoods('setGoods')">确认更改</Button>
                <Button @click.native="deleteGoods" type="error"   title="删除商品，请谨慎操作" style="margin: 10px 0px 0px 0px">删除商品</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import Sqlite from '@/assets/js/sqlite.js'
    import {changeTime} from '@/assets/js/tool.js'
    export default{
        data(){
            // 检查新商品编码
            const checkNewCoding = (rule, value, callback) => {
                const reg = /^[0-9]\d*$/g;
                if (value === '') {
                    callback(new Error('请输入商品编码'));
                } else {
                    if (reg.test(value)) {
                        const goods = this.$store.state.goods.goodsList;
                        for (let i = 0, len = goods.length; i < len; i++) {
                            if (goods[i].coding === value) {
                                callback(new Error('商品编码已存在，请使用便捷入库添加已有商品'));
                            }
                        }
                        callback();
                    } else {
                        callback(new Error('商品编码为数字'));
                    }
                }
            }
            // 检查价格
            const checkPrice = (rule, value, callback) => {
                const reg = /^(\d+\.\d{1,1}|\d+)$/g;
                if (value === '') {
                    callback(new Error('请输入商品价格'));
                } else if (reg.test(value)) {
                    callback();
                } else {
                    callback(new Error('商品单价应为最多一位小数的数字'));
                }
            }
            // 检查数量
            const checkNumber = (rule, value, callback) => {
                const reg = /^[1-9]\d*$/g;
                if (value === '') {
                    callback(new Error('请输入商品数量'));
                } else {
                    if (reg.test(value)) {
                        callback();
                    } else {
                        callback(new Error('商品数量为整数数字'));
                    }
                }
            }
            return{
                // 商品分类
                category:[
                    {index:'1',name:'家居百货'},
                    {index:'2',name:'健康美容'},
                    {index:'3',name:'饰品系列'},
                    {index:'4',name:'文体礼品'},
                    {index:'5',name:'季节产品'},
                    {index:'6',name:'精品包饰'},
                    {index:'7',name:'儿童玩具'},
                    {index:'8',name:'毛绒公仔'},
                    {index:'9',name:'数码配件'},
                    {index:'10',name:'休闲食品'},
                    {index:'11',name:'物料耗材'}
                ],
                activeIndex: '',
                // 输入框输入的商品名称
                goodname:'',
                // 表格高度
                tableHeight:800,
                // 表头
                columns:[
                    {
                        title: '商品条码',
                        key: 'coding',
                        align:'center'
                    },
                    {
                        title: '商品名称',
                        key: 'name',
                        align:'center'
                    },
                    {
                        title: '商品分类',
                        key: 'category',
                        align:'center'
                    },
                    {
                        title: '商品价格',
                        key: 'price',
                        align:'center'
                    },
                    {
                        title: '销售数量',
                        key: 'LASTTIME',
                        align:'center'
                    },
                    {
                        title: '库存',
                        key: 'number',
                        align:'center'
                    },
                    {
                        title: '状态',
                        key: 'LASTTIME',
                        align:'center'
                    },
                    {
                        title: '入库时间',
                        key: 'date',
                        align:'center'
                    },
                    {
                        title: '操作',
                        key: 'LASTTIME',
                        align:'center',
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    class: 'handle_one',
                                    style:{
                                        marginRight:'15px',
                                        color:'@bgColor'
                                    },
                                    domProps:{
                                        title:'点击编辑商品'
                                    },
                                    on: {
                                        click: () => {
                                           this.setGoodsFlag=true;
                                           this.setGoods=params.row;
                                           this.setGoods.date=new Date();
                                        }
                                    }
                                }, '编辑'),
                                h('a', {
                                    class: 'handle_two',
                                    domProps:{
                                        title:'点击查看商品详情'
                                    },
                                    on: {
                                        click: () => {
                                            
                                        }
                                    }
                                }, '详情'),
                            ]);
                        }
                    },
                ],
                // 表格数据
                tableData:[],
                // 总页数
                total:0,
                // 当前页
                currentPage:1,
                // 每页几条数据
                pageSize:20,
                // 是否显示商品入库弹出框
                isShow:false,
                // 商品入库表单数据
                newGoods: { 
                    coding: '', 
                    name: '', 
                    price: '', 
                    number: '', 
                    category: '', 
                    date:'',
                    img:[]
                }, 
                // 表单验证
                ruleValidate: {
                    name: [
                        { required: true, message: '商品名称不能为空', trigger: 'blur' }
                    ],
                    coding: [
                        { required: true, validator: checkNewCoding, trigger: 'blur' },
                    ],
                    price: [
                        { required: true, validator: checkPrice, trigger: 'blur' }
                    ],
                    number: [
                        { required: true, validator: checkNumber, trigger: 'blur' }
                    ],
                    date:[
                        { required: true, type: 'date', message: '请选择日期', trigger: 'blur' }
                    ],
                    category: [
                        { required: true, message: '商品分类不能为空', trigger: 'blur' }
                    ],
                },
                // 是否显示查看图片按钮
                isShowImageButton:false,
                // 是否显示修改商品弹出框
                setGoodsFlag:false,
                // 修改的商品id
                id:'',
                // 修改表单数据
                setGoods: {
                    coding:'',
                    name: '', 
                    price: '', 
                    number: '', 
                    category: '', 
                    date: '', 
                },
                checkSetGoods: {
                    name: [
                        { required: true, message: '商品名称不能为空', trigger: 'blur' }
                    ],
                    price: [
                        { required: true, validator: checkPrice, trigger: 'blur' }
                    ],
                    number: [
                        { required: true, validator: checkNumber, trigger: 'blur' }
                    ],
                    date:[
                        { required: true, type: 'date', message: '请选择日期', trigger: 'blur' }
                    ],
                    category: [
                        { required: true, message: '商品分类不能为空', trigger: 'blur' }
                    ],
                },
               
            }
        },
        created(){
            this.getGoodsList();
            this.newGoods.date=new Date();
        },
        mounted(){
            setTimeout(()=> {
                // 得到浏览器内容高度
                var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                this.tableHeight = (windowHeight- 340);
            },100)
            // 调整浏览器的时候
            $(window).on('resize', () => {
                var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                this.tableHeight = (windowHeight - 340);
            })     
        },
        methods:{
            // 获取商品列表
            getGoodsList(){
                this.$store.state.goods.goodsList.forEach(item=>{
                    item.date=changeTime(item.date);
                })
                this.tableData=this.$store.state.goods.goodsList;
            },
            // 商品分类导航菜单
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            // 点击商品入库
            addGood(){
                this.isShow=true;
                this.title='新增商品';
            },
            // 商品入库
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (this.$store.state.currUser.coding) {
                            this.$store.commit('addNewGoods', this.newGoods);
                            this.isShow=false;
                            this.$Message.success('添加成功');
                            var db = openDatabase('myData','','',102400); 
                            var _this=this;
                            db.transaction(function(tx){ 
                                tx.executeSql('INSERT INTO goodsData VALUES(?,?,?,?,?,?)' , [_this.newGoods.coding,_this.newGoods.name,_this.newGoods.price,_this.newGoods.number,_this.newGoods.category,_this.newGoods.date],function(tx,rs){ 
                                   
                                }, 
                                //插入失败的回调就是在控制台上输入一行错误日志 
                                function(tx,error){ 
                                    console.log(error.source+"::"+error.message); 
                                }); 
                            } )
                            
                        } else {
                            this.$Message.info({
                                content: '用户未登录，3秒后跳转到登录页面',
                                duration: 3
                            });
                            setTimeout(() => {
                                window.open('http://localhost:80');
                            }, 3000);
                        }
                    } 
                })
            },
            
            // 提交修改商品信息
            submitChangeGoods (setGoods) {
                this.$refs[setGoods].validate((valid) => {
                    if (valid) {
                        if (this.$store.state.currUser.coding) {
                            if (this.$store.state.currUser.jurisdiction === '一级') {
                                var db = openDatabase('myData','','',102400); 
                                var _this=this;
                                db.transaction(function(tx){
                                    tx.executeSql('UPDATE  goodsData set name=?, price=?,number=?,category=? where coding=?',[_this.setGoods.name,_this.setGoods.price,_this.setGoods.number,_this.setGoods.category,_this.setGoods.coding],function(tx,rs){ 
                                        _this.$store.commit('changeGoods', _this.setGoods);
                                        _this.setGoodsFlag=false;
                                        _this.$Message.success('修改成功');
                                    }, 
                                    //插入失败的回调就是在控制台上输入一行错误日志 
                                    function(tx,error){
                                        _this.$Message.error('修改失败！');
                                        console.log(error.source+"::"+error.message); 
                                    }); 
                                } )
                                 
                            } else {
                                this.$Message.error('当前用户没有修改商品信息权限');
                            }
                        } else {
                            this.$Message.info({
                                content: '用户未登录，3秒后跳转到登录页面',
                                duration: 3
                            });
                            window.open('http://localhost:80');
                           
                        }
                    } else {
                        this.$Message.error('表单验证失败，无法添加新商品');
                    }
                })
            },
                
            // 删除商品
            deleteGoods () {
                if (this.$store.state.currUser.coding) {
                    if (this.$store.state.currUser.jurisdiction === '一级') {
                        var db = openDatabase('myData','','',102400); 
                        var _this=this;
                        var title=this.setGoods.name
                        this.$Modal.confirm({
                            title: '商品：'+title,
                            content: '确认要删除该商品吗',
                            onOk: () => {
                                db.transaction(function(tx){
                                    tx.executeSql('DELETE FROM goodsData WHERE coding=?',[_this.setGoods.coding],function(tx,rs){ 
                                        _this.$store.commit('deleteGoods', _this.setGoods);
                                        _this.setGoodsFlag=false;
                                        _this.$Message.success('删除成功');
                                    }, 
                                    function(tx,error){
                                        _this.$Message.error('删除失败！');
                                        console.log(error.source+"::"+error.message); 
                                    }); 
                                })
                            },
                        });
                    } else {
                        this.$Message.error('当前用户没有修改商品信息权限');
                    }
                } else {
                    this.$Message.info({
                        content: '用户未登录，3秒后跳转到登录页面',
                        duration: 3
                    });
                    window.open('http://localhost:80');
                    
                }
                
                
            },
            // 表单重置
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            /*
            * 图片格式验证
            */ 
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
                });
            },
            // 上传图片
            uploadImage(){
                if (this.newGoods.img.length !== 0) {
                    this.isShowImageButton = true;
                } else {
                    this.isShowImageButton = false;
                }
            },
            // 分页
            changePage(index){
                this.currentPage=index;
            },
            
        }
    }
</script>