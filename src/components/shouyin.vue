<template>
    <div class="cashier">
        <!-- 查询 -->
        <Form ref="form" :model="form" :rules="ruleValidate"  class="top">
            <FormItem  prop="num" >
                <Input v-model="form.num" placeholder="输入商品编码"  clearable></Input>
            </FormItem>
            <FormItem style="width: 0px;" class="btn">
                <Button type="primary" @click="handleSubmit('form')">确认</Button>
            </FormItem>
        </Form>
        <!-- 列表 -->
        <div class="table">
            <Table border :height="tableHeight" :columns="columns" :data="tableData"></Table>
        </div>
        <div class="total">
            <p>数量：{{totalNum}}<span>订单总金额：{{totalMoney}}</span></p>
        </div>
        <div class="footer">
            <h2>选择支付方式</h2>
            <ul>
                <li class="actived">
                    <span class="iconfont">&#xe6fa;</span>
                    <p>现金支付</p>
                </li>
                <li>
                    <span class="iconfont">&#xe7ad;</span>
                    <p>微信支付</p>
                </li>
                <li>
                    <span class="iconfont">&#xe604;</span>
                    <p>支付宝支付</p>
                </li>
                <li>
                    <span class="iconfont">&#xe60a;</span>
                    <p>银行卡支付</p>
                </li>
            </ul>
            <Button type="primary" class="pay">结算</Button>
        </div>
        <!-- 查询的商品弹出框 -->
        <Modal v-model="goodModel" title="选择商品" :closable="false">
            <Table border  :columns="goodColumns" :data="goodData"></Table>
            <div slot="footer">
                <Button type="error"  @click="cancel">取消</Button>
                <Button type="primary"  @click="add">添加</Button>
            </div>
        </Modal>
        <!-- 打印收据 -->
        <div v-show="true">
            <webview ref="printWebview" src="../print.html" nodeintegration/>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            // 表单数据
            form: {
                num: '',
            },
            // 表单验证
            ruleValidate: {
                num: [
                    { required: true, message: '商品编码不能为空', trigger: 'blur' }
                ],
            },
            // 购物车总数量
            totalNum:0,
            // 购物车总价格
            totalMoney:0,
            // 表格高度
            tableHeight:800,
            // 购买商品表格头部
            columns:[
                {
                    title: '商品条码',
                    key: 'coding'
                },
                {
                    title: '商品名称',
                    key: 'name'
                },
                {
                    title: '商品单价',
                    key: 'price'
                },
                {
                    title: '购买数量',
                    key: 'number'
                },
                {
                    title: '小计',
                    key: 'total'
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Icon', {
                                props: {
                                    type: 'ios-plus-outline',
                                },
                                style: {
                                    marginRight: '20px',
                                    cursor: 'pointer',
                                    fontSize:'25px'
                                },
                                on: {
                                    click: () => {
                                        params.row.number=params.row.number+1;
                                        params.row.total=parseFloat(Number(params.row.price)*(params.row.number));
                                    }
                                }
                            }, ''),
                            h('Icon', {
                                props: {
                                    type: 'ios-minus-outline',
                                },
                                style: {
                                    marginRight: '20px',
                                    cursor: 'pointer',
                                    fontSize:'25px'
                                },
                                on: {
                                    click: () => {
                                        if(params.row.number>1){
                                            params.row.number=params.row.number-1;
                                            params.row.total=parseFloat(params.row.price)*(params.row.number);
                                        }else{
                                            this.$Modal.confirm({
                                                title: '提示',
                                                content: '该商品只剩一件，继续删除将不在购买该商品',
                                                okText: '删除',
                                                cancelText: '取消',
                                                onOk: () => {
                                                    this.$store.commit('deleteShoppingCart',params.row);
                                                },
                                            });
                                        }
                                        
                                    }
                                }
                            }, ''),
                            h('Icon', {
                                props: {
                                    type: 'ios-close-outline',
                                },
                                style: {
                                    cursor: 'pointer',
                                    fontSize:'25px'
                                },
                                on: {
                                    click: () => {
                                        
                                    }
                                }
                            }, ''),
                        ]);
                    }
                },
            ], 
            // 购买商品表格数据
            tableData:[],
            // 是否弹出商品框
            goodModel:false,
            // 查询商品表格头部
            goodColumns:[
                {
                    title: '商品条码',
                    // width:120,
                    key: 'coding'
                },
                {
                    title: '商品名称',
                    // width:120,
                    key: 'name'
                },
                {
                    title: '商品数量',
                    // width:70,
                    key: 'number'
                },
                {
                    title: '商品单价',
                    // width:70,
                    key: 'price'
                },
                {
                    title: '商品分类',
                    // width:120,
                    key: 'category'
                },
                
            ],
            // 查询商品数据
            goodData:[]
        }
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
        // /当vue节点渲染完成后，获取<webview>节点
        const webview = this.$refs.printWebview;
        console.log(webview);
        //监听<webview>里面的消息，也就是监听print.html里面的ipcRenderer.sendToHost发送的事件，当该事件发送成功后就会进入下面的回调事件中执行打印操作。
        webview.addEventListener('ipc-message', (event) => {
            console.log(event);
        if (event.channel === 'webview-print-do') {
            //如果收到<webview>传过来的事件，名为"webview-print-do"，就执行 webview.print打印方法，打印<webview>里面的内容。
            webview.print(
            {
                //是否是静默打印
                silent: true,
                printBackground: true,
                //打印机的名称，就是本文一开始获得的打印机列表其中一个
                deviceName: 'xxx',
            },
            (data) => {
                //这个回调是打印后的回调事件，data为true就是打印成功，为false就打印失败
                console.log('webview success', data);
            },
            );
        }
        });
    },
    computed: {
        
    },
    methods: {
        // 查询
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    var db = openDatabase('myData','','',102400); 
                    var _this=this;
                    db.transaction(function(tx){ 
                        tx.executeSql('SELECT * FROM  goodsData WHERE coding=?' , [_this.form.num],function(tx,rs){ 
                           _this.goodModel=true
                            _this.goodData.push(rs.rows[0])
                        }, 
                        function(tx,error){ 
                            console.log(error.source+"::"+error.message); 
                        }); 
                    } )
                }else{
                   
                }
            })
        },
        // 添加到购物车
        add(){
            let shopList=this.$store.state.shoppingCart.shoppingCartList;
            if(shopList.length==0){
                this.$store.commit('addShoppingCart',this.goodData[0]);
            }else{
                shopList.forEach(ele=>{
                    console.log(ele);
                    if(ele.coding==this.goodData[0].coding){
                        this.$Message.error('该商品购物车已存在，请直接到购物车添加购买数量！！')
                    }else{
                        this.$store.commit('addShoppingCart',this.goodData[0]);
                    }
                })
            }
            this.goodModel=false;
            this.goodData=[];
            this.tableData=shopList;
            this.tableData.forEach(item=>{
                item['total']=item.price;
                item.number=1;
            })
            console.log(this.tableData);
            
        },
        // 取消
        cancel(){
            this.goodModel=false;
            this.goodData=[];
        },
    }
}
</script>
    
    