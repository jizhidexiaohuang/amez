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
                <Button style="float:left;margin-right:10px;" @click.native="changePageType('add')" type="success">订单导出</Button>
                <FormItem style="margin-bottom:10px;">
                    订单类型
                    <Select v-model="orderType" style="width:100px">
                        <Option v-for="item in orderTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    订单来源
                    <Select v-model="orderOrigin" style="width:100px">
                        <Option v-for="item in orderOriginList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    订单状态
                    <Select v-model="orderStatus" style="width:100px">
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
                    <Input v-model="value">
                    <Select v-model="selectType" slot="prepend" style="width: 100px">
                        <Option value="订单号">订单号</Option>
                        <Option value="门店名称">门店名称</Option>
                        <Option value="收货人姓名">收货人姓名</Option>
                        <Option value="收货人手机">收货人手机</Option>
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
                </FormItem>
            </Form>
            <Table
                :loading="loading" 
                :data="tableData1" 
                :columns="tableColumns1" 
                stripe
                border
                @on-select="fnSelect"
                @on-select-all="fnSelectAll"
            ></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page 
                        :total="recordsTotal" 
                        :current="pageNun"
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
                value:'',
                orderId:'',//编辑id
                refundId:'',//查看详情Id
                selectType:'门店名称',
                storeStatus:'', //店铺状态下拉框
                area:'', //地区
                orderType:'',//订单类型
                orderOrigin:'',//订单类型
                payType:'',//支付类型
                orderStatus:'',//订单状态
                orderTypeList:[
                    {
                        value:'0',
                        label:'全部'
                    },{
                        value:'1',
                        label:'上门服务'
                    },{
                        value:'2',
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
                        value:'0',
                        label:'全部'
                    },{
                        value:'1',
                        label:'待客服介入'
                    },{
                        value:'2',
                        label:'退款成功'
                    },
                ],//订单状态
                cd:{
                    startTime:'',//评论时间范围
                    endTime:'',//评论时间范围
                    operType:"1"//评论类型、不用重置
                },
                activatedType: false,//主要解决mounted和activated重复调用
                pageType: 'list',
                openPage: false,
                tableData1: [],
                parentMsg:'',
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
                test:1,
                recordsTotal:0,
                pageNun:1,
                loading: false,
                size: 10,
            }
        },
        methods: {
            /* 分页回掉函数 */
            changePage (page) {
                let vm = this;
                vm.pageNun = page;   
                vm.getData();             
                // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
            },
            /* 数据获取 */
            getData () {
                let vm = this;
                let start = (vm.pageNun-1)*vm.size;//从第几个开始
                let size = vm.size;//每页条数
                let url = common.path+"orderReturn/front/findByPage";
                let ajaxData = {
                    pageNo:start,
                    pageSize: size
                }
                vm.loading = true;
                this.$http.post(
                    url,
                    JSON.stringify(ajaxData),
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(function(res){
                    console.log(res);
                    let oData = res.data
                    vm.recordsTotal = oData.data.total;
                    vm.tableData1 = res.data.data.list;
                    vm.loading = false;
                }).catch(function(err){
                })
            },
            /* 查看详情 */
            show (index) {
                this.$Modal.info({
                    title: '老师活动详情',
                    content: `老师名称：${this.tableData1[index].teacherName}<br>老师类型：${this.tableData1[index].typeName}<br>活动类型：${this.tableData1[index].typeName}`
                })
            },
            /* 页码改变的回掉函数 */
            changeSize (size) {
                console.log(size);
                let vm = this;
                vm.size = size;
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
                vm.pageNun = 1;
                vm.size = 10;
                vm.getData();
            },
            /* 判断页签中是否有该模块，如果有则使用缓存，如果没有则重新加载数据 */
            fnExistTabList () {
                let vm = this;
                if(!!vm.activatedType){
                    let arrs = [];
                    let type = vm.$store.getters.tabTrue;
                    if(!!!type){
                        vm.tableData1 = [];//为了处理进来的时候看到之前缓存的页面
                        vm.loading = true;//进一步模拟第一次进来时的页面效果
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