<template>
    <div class="orders">
        <div class="search">
            <Form ref="form" :model="form"  inline>
                <FormItem prop="category"  >
                    <Select v-model="form.category" placeholder="请选择商品类别" filterable clearable>
                        <Option v-for="item in categoryList" :value="item.index" :key="item.index">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="name" >
                    <Input type="text" v-model="form.name" placeholder="请输入商品名称"></Input>
                </FormItem>
                <FormItem prop="date" >
                    <DatePicker v-model="form.date" type="date" placeholder="选择时间" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit" class="btn">搜索</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return{
                // 商品分类
                categoryList:[
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
                // 查询表单
                form:{
                    category:'',
                    name:'',
                    date:''
                },

            }
        },
        methods:{
            handleSubmit(){
                console.log(this.form);
            }
        }
    }
</script>