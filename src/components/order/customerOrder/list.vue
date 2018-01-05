<template>
    <div>
        <!-- 新增容器 -->
        <AddPage v-if="pageType == 'add'"  class="testWrap" v-on:returnList="changePageType"/>
        <!-- 编辑容器 -->
        <div v-if="pageType == 'edit'" class="testWrap">
            编辑
        </div>
        <!-- 订单详情容器 -->
        <OrderPage v-if="pageType == 'order'"  class="testWrap" :orderId="orderId" v-on:returnList="changePageType"/>
        <!-- 退款详情容器 -->
        <RefundPage v-if="pageType == 'refund'"  class="testWrap" :refundId="refundId" v-on:returnList="changePageType"/>
        <!-- 列表容器 -->
        <div v-if="pageType == 'list'" class="testWrap">
            <div class="boxStyle">
            <Row style="margin-bottom:10px;" v-show="false">
                <Col span="5">
                    <ButtonGroup>
                        <Button @click.native="changePageType('list')" type="primary" size="small" icon="ios-search">新增</Button>
                        <Button @click.native="refreshTable" type="warning" size="small" icon="refresh">刷新</Button>
                        <Button type="error" size="small" icon="android-delete">删除</Button>
                    </ButtonGroup>
                </Col>
                <Col span="3" offset="16">
                    <Input size="small" placeholder="please write text" icon="ios-search"></Input>
                </Col>
            </Row>
            <Form :model="cd" inline>
                <Button style="float:left;margin-right:10px;" @click="exportData" type="success">订单导出</Button>
                <FormItem style="margin-bottom:10px;">
                    订单类型
                    <Select v-model="cd.orderType" style="width:100px">
                        <Option v-for="item in orderTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    订单来源
                    <Select v-model="cd.orderOrigin" style="width:100px">
                        <Option v-for="item in orderOriginList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    订单状态
                    <Select v-model="cd.orderStatus" style="width:100px">
                        <Option v-for="item in orderStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    下单时间
                    <DatePicker v-model="cd.startTime" type="date" placeholder="开始时间" style="width:200px;"></DatePicker>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    <DatePicker v-model="cd.endTime" type="date" placeholder="结束时间" style="width:200px;"></DatePicker>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    <Input v-model="cd.inputval">
                    <Select v-model="cd.selectType" slot="prepend" style="width: 100px">
                        <Option value="orderNo">订单号</Option>
                        <Option value="storeName">门店名称</Option>
                        <Option value="addressReveiver">收货人姓名</Option>
                        <Option value="memberPhone">收货人手机</Option>
                    </Select>
                    </Input>
                </FormItem>
                <FormItem style="margin-bottom:10px; width:220px;" v-show="false">
                    <Row>
                        <Col span="22">
                            <Input v-model="area" placeholder="门店名称/注册手机"></Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    <Button style="margin-left:5px;" @click.native="getData" type="primary" icon="ios-search">查询</Button>
                    <Button style="margin-left:5px;" @click.native="getData('init')" type="warning" icon="refresh">刷新</Button>
                </FormItem>
            </Form>
            <Table
                :loading="table.loading" 
                :data="table.tableData1" 
                :columns="tableColumns1" 
                ref="table"
                stripe
                border
                @on-select="fnSelect"
                @on-select-all="fnSelectAll"
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
    import expandRow from './table-expand.vue'
    import OrderPage from './order.vue'
    import RefundPage from './refund.vue'
    import common from '../../../base.js'
    export default {
        data () {
            return {
                src:'../../../static/images/footer/1_1.png',
                area:'', //地区
                orderId:'',//编辑id
                refundId:'',//查看详情Id
                orderTypeList:[
                    {
                        value:'',
                        label:'全部'
                    },{
                        value:'1',
                        label:'上门服务'
                    },{
                        value:'0',
                        label:'到店服务'
                    },
                ],  //订单类型
                orderOriginList:[
                    {
                        value:'0',
                        label:'全部'
                    },{
                        value:'1',
                        label:'微信商城'
                    },{
                        value:'2',
                        label:'APP商城'
                    },
                ],  //订单类型
                orderStatusList:[
                    {
                        value:'',
                        label:'全部'
                    },{
                        value:'2',
                        label:'待客服介入'
                    },{
                        value:'1',
                        label:'退款成功'
                    },
                ],//订单状态
                cd:{
                    startTime:'',//评论时间范围
                    endTime:'',//评论时间范围
                    selectType:'orderNo', //订单号
                    orderType:'',//订单类型
                    orderOrigin:'',//订单来源
                    orderStatus:'',//订单状态
                    inputval:'', // 搜索条件
                },
                activatedType: false,//主要解决mounted和activated重复调用
                pageType: 'list',
                openPage: false,
                
                tableColumns1: [
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
                        title: '退款订单',
                        key: 'orderNo',
                        render:(h,params)=>{
                            return h('div',[
                                h('span',params.row.orderNo)
                            ])
                        }
                    },
                    {
                        title: '退款总金额',
                        key: 'fee',
                        render: (h,params) =>{
                            return h('div',params.row.fee)
                        }
                    },
                    {
                        title: '退货物流单号',
                        key: 'deliveryCode',
                        render:(h,params)=>{
                            if(params.row.deliveryCode){
                                return params.row.deliveryCode 
                            }else{
                                return 3943859435972835
                            }
                        }
                    }, 
                    {
                        title: '退货物流商名称',
                        key: 'deliveryName',
                        render:(h,params)=>{
                            if(params.row.deliveryName){
                                return params.row.deliveryName 
                            }else{
                                return '顺丰快递'
                            }
                        }
                    },
                    {
                        title: '申请时间',
                        key: 'applyTime',
                        render:(h,params)=>{
                            if(params.row.applyTime){
                                return common.formatDate(params.row.applyTime) 
                            }else{
                                return '2018-01-01'
                            }
                        }
                    },
                    {
                        title: '申请退换货的状态',
                        key: 'returnStatus',
                        render:(h,params) =>{
                           let status = params.row.returnStatus;
                           let text = ''
                            if(status==2){
                                text = '申请中'
                            }else if(status==3){
                                text = '审核通过'
                            }
                           return h('div',text)
                        }
                    },
                     {
                        title: '退换货类型',
                        key: 'returnType',
                        render:(h,params) =>{
                           let status = params.row.returnType;
                           let text = ''
                            if(status==1){
                                text = '换货'
                            }else if(status==2){
                                text = '退货'
                            }
                           return h('div',text)
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 200,
                        align: 'center',
                        // fixed: 'right',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.changePageType('order');
                                            this.orderId = params.row.id
                                        }
                                    }
                                }, '订单详情'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.changePageType('refund');
                                            this.refundId = params.row.id
                                        }
                                    }
                                }, '退款详情'),
                            ]);
                        }
                    }
                ],
                table:{
                    recordsTotal:0,
                    pageNun:1,
                    loading: false,
                    size: 10,
                    tableData1: [],
                }
            }
        },
        methods: {
            /* 分页回掉函数 */
            changePage (page) {
                let vm = this;
                vm.table.pageNun = page;   
                vm.getData();             
                // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
            },
            /* 数据获取 */
            getData (init) {
                let vm = this;
                if(!!init&&init=='init'){
                    vm.fnInit();
                }
                let start = vm.table.pageNun;//从第几个开始
                let size = vm.table.size;//每页条数
                let url = common.path+"orderReturn/front/findByPage";
                let ajaxData = {
                    pageNo:start,
                    pageSize: size,
                    addTime:vm.cd.startTime,//下单时间
                    returnStatus:vm.cd.orderStatus,
                }
                ajaxData[vm.cd.selectType] = vm.cd.inputval
                vm.table.loading = true;
                this.$http.post(
                    url,
                    ajaxData,
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(function(res){
                    console.log(res);
                    let oData = res.data
                    vm.table.recordsTotal = oData.data.total;
                    vm.table.tableData1 = res.data.data.list;
                    vm.table.loading = false;
                }).catch(function(err){
                })
            },
             /* 初始化表格筛选条件 */
            fnInit () {
                let vm = this;
                vm.table.pageNun = 1;//索引
                vm.table.size = 10;//页数
                vm.cd.startTime = '';//评价时间
                vm.cd.endTime = '';//评价时间
                vm.cd.orderType = '';// 状态
                vm.cd.orderStatus = '';// 输入框类型
                vm.cd.inputval = "";// 输入框的值
                vm.cd.orderOrigin = '';//订单来源
                vm.cd.selectType = 'orderNo';
            },
            //导出Excel
            exportData(){
                this.$refs.table.exportCsv({
                    filename: '数据',
                    original :true,                 
                    data: this.table.tableData1.filter((data, index) => {
                        // console.log(data)
                        //订单号
                        // data.orderNo = '="'+data.orderNo+'"';
                        //申请时间
                        data.applyTime = data.applyTime?common.formatDate(data.applyTime):'';
                        //申请状态
                        if(data.returnStatus=='2'){
                            data.returnStatus = '申请中'
                        }else{
                            data.returnStatus = '申请成功'
                        }
                        //退换货类型
                        if(data.returnType=='1'){
                            data.returnType = '换货'
                        }else{
                            data.returnType = '退货'
                        }
                    })
                });
            },
            /* 页码改变的回掉函数 */
            changeSize (size) {
                console.log(size);
                let vm = this;
                vm.table.size = size;
                vm.getData();
            },
            /* 选中某一项的回掉函数 */
            fnSelect (selection,row) {
                console.log(row);
                console.log(selection);
            },
            /* 全选时的回调函数 */
            fnSelectAll (selection) {
                console.log(selection);
            },
            changePageType (type) {
                this.pageType = type;
            },
            /* 刷新 */
            refreshTable () {
                var vm = this;
                vm.table.pageNun = 1;
                vm.table.size = 10;
                vm.getData();
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
                        vm.getData();//再次请求数据
                    }
                }
                vm.activatedType = true;//主要解决mounted和activated重复调用
            }
        },
        mounted: function(){
            this.getData();
        },
        activated: function(){
            let vm = this;
            vm.fnExistTabList()
        },
        components:{
            OrderPage,
            expandRow,
            RefundPage,
        }
    }
</script>
<style scoped>
    .testWrap{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0px; top:0px;
        z-index: 1;
        padding:5px 10px 10px 10px;
    }
    .fl{
        float: left; 
    }
    .fr{
        float: right;
    }
</style>