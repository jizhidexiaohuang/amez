<template>
    <div>
        <!-- 新增容器 -->
        <AddPage v-if="pageType == 'add'"  class="testWrap" v-on:returnList="changePageType"/>
        <!-- 编辑容器 -->
        <div v-if="pageType == 'edit'" class="testWrap">
            编辑
        </div>
        <!-- 详情容器 -->
        <div v-if="pageType == 'info'" class="testWrap">详情</div>
        <!-- 列表容器 -->
        <div v-if="pageType == 'list'" class="testWrap">
            <div class="boxStyle">
                <Tabs type="card" v-model="cd.operType" @click.native="getData('init')">
                    <TabPane label="买家评论" name="1"></TabPane>
                    <TabPane label="卖家评论" name="2"></TabPane>
                </Tabs>
                <Form :model="cd" inline v-if="false">
                    <FormItem style="margin-bottom:10px;">
                        评价时间
                        <DatePicker v-model="cd.time" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="请填写时间范围" style="width: 300px"></DatePicker>
                    </FormItem>
                </Form>
                <Row style="margin-bottom:10px;">
                    <Col span="5">
                        <Button v-if="!!operators.see" style="margin-left:5px;" @click.native="getData" type="primary" icon="ios-search">查询</Button>
		                <Button v-if="!!operators.refresh" style="margin-left:5px;" @click.native="getData('init')" type="warning" icon="refresh">刷新</Button>
                    </Col>
                    <Col span="3" offset="16" v-if="false">
                        <Button style="float:right;" @click.native="changePageType('list')" type="success" icon="android-add">新增</Button>
                    </Col>
                </Row>
                <Table
                    :loading="table.loading" 
                    :data="table.tableData1" 
                    :columns="table.tableColumns" 
                ></Table>
                <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                        <Page 
                            :total="table.recordsTotal" 
                            :current="table.pageNun"
                            show-sizer 
                            @on-change="changePage"
                            @on-page-size-change="changeSize"
                        ></Page>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    // import AddPage from './add.vue'
    import expandRow from './table-expand.vue'
    export default {
        data () {
            return {
                operators: {},
                cd:{
                    time:[],//评论时间范围
                    operType:"1"//评论类型、不用重置
                },
                table:{
                    recordsTotal:0,//总数量
                    pageNun:1,//索引
                    loading: false,//加载状态
                    size: 10,//长度 
                    tableData1: [],//数据
                    //table头
                    tableColumns: [
                        
                    ],
                    //买家表头
                    buyerColumns: [
                        {
                            type: 'expand',
                            width: 50,
                            render: (h, params) => {
                                return h(expandRow, {
                                    props: {
                                        row: params.row
                                    }
                                })
                            }
                        },
                        {
                            title: '买家名称',
                            key: 'memberName',
                        },
                        {
                            title: '评价时间',
                            key: 'payTime',
                            render: (h,params) =>{
                                return "2017/12/16 12:16"
                            }
                        },
                        {   
                            title: '订单编号',
                            key: 'orderId',
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 180,
                            // align: 'center',
                            // fixed: 'right',
                            render: (h, params) => {
                                let arrs = [];
                                let obj1 = h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.fnDeleteItem(params.row.id);
                                        }
                                    }
                                }, '删除')
                                if(!!this.operators.delete){
                                    arrs.push(obj1);
                                }
                                return h('div',arrs);
                            }
                        }
                    ],
                    //卖家表头
                    sellerColumns: [
                        {
                            type: 'expand',
                            width: 50,
                            render: (h, params) => {
                                return h(expandRow, {
                                    props: {
                                        row: params.row
                                    }
                                })
                            }
                        },
                        {
                            title: '商家名称',
                            key: 'parentBeauticianName',
                        },
                        {
                            title: '评价时间',
                            key: 'payTime',
                            render: (h,params) =>{
                                return "2017/12/16 12:16"
                            }
                        },
                        {
                            title: '订单编号',
                            key: 'orderId',
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 180,
                            // align: 'center',
                            // fixed: 'right',
                            render: (h, params) => {
                                let arrs = [];
                                let obj1 = h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            // this.test(params.index)
                                        }
                                    }
                                }, '删除');
                                if(!!this.operators.delete){
                                    arrs.push(obj1);
                                }

                                return h('div',arrs);
                            }
                        }
                    ],
                },
                activatedType: false,//主要解决mounted和activated重复调用
                pageType: 'list',//子页面类型
                storeId: '',
            }
        },
        methods: {
            /* 分页回掉函数 */
            changePage (page) {
                let vm = this;
                vm.table.pageNun = page;   
                vm.getData();             
            },
            /* 初始化表格筛选条件 */
            fnInit () {
                let vm = this;
                vm.table.pageNun = 1;//索引
                vm.table.size = 10;//页数
                vm.cd.time = [];//评价时间
            },
            /* 数据获取 */
            getData (init) {
                let vm = this;
                if(!!init&&init=='init'){
                    vm.fnInit();
                }
                /* 买家和卖家的表头不一样 */
                if(vm.cd.operType == "1"){
                    vm.table.tableColumns = vm.table.buyerColumns;
                }else{
                    vm.table.tableColumns = vm.table.sellerColumns;
                }
                let start = vm.table.pageNun;//从第几页开始
                let size = vm.table.size;//每页条数
                let url = vm.common.path2+"orderComment/front/findByPage?pageNo="+start+"&pageSize="+size;
                let ajaxData = {
                    pageNo:start,
                    pageSize: size,
                    operType: vm.cd.operType
                }
                if(!!vm.storeId){
                    ajaxData.storeId = vm.storeId;
                }
                vm.table.loading = true;
                this.$http.post(
                    url,
                    ajaxData,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                ).then(function(res){
                    let oData = res.data.data
                    vm.table.recordsTotal = oData.total;
                    vm.table.tableData1 = res.data.data.list;
                    vm.table.loading = false;
                }).catch(function(err){
                })
            },
            /* 删除一条列表 */
            fnDeleteItem (id) {
                let vm = this;
                this.$Modal.confirm({
                    title: '删除买家评价',
                    content: '确定要删除此评价吗？',
                    onOk: function(){
                        let ajaxData = {
                            id: 20
                        }
                        let url = vm.common.path2+"orderComment/deleteById/"+id;
                        this.$http.delete(
                            url,
                        ).then(function(res){
                            if(res.data.code == 200){
                                setTimeout(function(){
                                    vm.$Message.success(res.data.message);
                                },500)
                                vm.getData();
                            }else{
                                vm.$Message.error(res.data.message);
                            }
                        }).catch(function(err){
                        })
                    }
                })
            },
            /* 页码改变的回掉函数 */
            changeSize (size) {
                let vm = this;
                vm.table.size = size;
                vm.getData();
            },
            changePageType (type) {
                this.pageType = type;
            },
            /* 判断页签中是否有该模块，如果有则使用缓存，如果没有则重新加载数据 */
            fnExistTabList () {
                let vm = this;
                if(!!vm.activatedType){
                    let arrs = [];
                    let type = vm.$store.getters.tabTrue;
                    if(!!!type){
                        vm.table.tableData1 = [];//为了处理进来的时候看到之前缓存的页面
                        vm.table.loading = true;//进一步模拟第一次进来时的页面效果
                        vm.pageType = 'list'//显示列表页，放在这里是给上边的处理留点时间，也就是初始化放在这段代码上边
                        
                        vm.cd.operType = "1"
                        vm.getData('init');//再次请求数据
                    }
                }
                vm.activatedType = true;//主要解决mounted和activated重复调用
            },
        },
        mounted: function(){
            let vm = this;
            let store = JSON.parse(window.localStorage.getItem("userInfo")).store;
            if(store!=null){
                vm.storeId = store.id;
            }
            this._u.operatorsEdit(this); // 控制页面按钮的显示
            this.getData();
        },
        activated: function(){
            let vm = this;
            vm.fnExistTabList()
        },
        components:{
            expandRow
        }
    }
</script>
<style scoped>
</style>