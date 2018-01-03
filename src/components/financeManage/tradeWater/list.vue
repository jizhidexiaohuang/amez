<template>
    <div>
        <!-- 服务订单容器 -->
        <ServicePage v-if="pageType == 'service'" class="testWrap" :serviceId="serviceId" v-on:returnList="fnBackformAdd"></ServicePage>
        <!-- 会员售卡容器 -->
        <RechargePage v-if="pageType == 'recharge'" class="testWrap" :rechargeId="rechargeId" v-on:returnList="fnBackformAdd"></RechargePage>
        <!-- 会员卡充值容器 -->
        <SellingPage v-if="pageType == 'selling'"  class="testWrap" :sellingId="sellingId" v-on:returnList="fnBackformAdd"/>
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
                <Button style="float:left;margin-right:10px;" @click.native="changePageType('add')" type="success">导出Excel</Button>
                <FormItem style="margin-bottom:10px;">
                    交易类型
                    <Select v-model="transactionType" style="width:100px">
                        <Option v-for="item in transactionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    支付方式
                    <Select v-model="payType" style="width:100px">
                        <Option v-for="item in payTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    订单状态
                    <Select v-model="orderStatus" style="width:100px">
                        <Option v-for="item in orderStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    付款时间
                    <DatePicker v-model="cd.payStartTime" type="date" placeholder="开始时间" style="width:200px;"></DatePicker>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    <DatePicker v-model="cd.payEndTime" type="date" placeholder="结束时间" style="width:200px;"></DatePicker>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    结算时间
                    <DatePicker v-model="cd.accountStartTime" type="date" placeholder="开始时间" style="width:200px;"></DatePicker>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    <DatePicker v-model="cd.accountEndTime" type="date" placeholder="结束时间" style="width:200px;"></DatePicker>
                </FormItem>
                <FormItem style="margin-bottom:10px;" v-show="false">
                    <Input v-model="value">
                    <Select v-model="selectType" slot="prepend" style="width: 80px">
                        <Option value="门店名称">门店名称</Option>
                        <Option value="注册手机">注册手机</Option>
                    </Select>
                    </Input>
                </FormItem>
                <FormItem style="margin-bottom:10px; width:220px;">
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
            <Row style="margin-bottom:10px;">
                <Col span="10">
                    <Button style="float:left;margin-right:10px;" @click.native="changePageType('add')" type="success" v-show="false">导出Excel</Button>
                    <Button style="float:left;" @click.native="changePageType('list')" type="primary" icon="android-add" v-show="false">成长规则设置</Button>
                </Col>
            </Row>
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
    import ServicePage from './service.vue'
    import SellingPage from './selling.vue'
    import RechargePage from './recharge.vue'
    import common from '../../../base.js'
    export default {
        data () {
            return {
                value:'',
                serviceId:'',//服务订单id
                rechargeId:'',//会员卡充值id
                sellingId:'',//会员卡售卡id
                selectType:'门店名称',
                storeStatus:'', //店铺状态下拉框
                area:'', //地区
                transactionType:'',//交易类型
                payType:'',//支付类型
                orderStatus:'',//订单状态
                transactionList:[
                    {
                        value:'0',
                        label:'全部'
                    },{
                        value:'1',
                        label:'服务订单'
                    },{
                        value:'2',
                        label:'订单退款'
                    },{
                        value:'3',
                        label:'会员卡售卡'
                    },{
                        value:'4',
                        label:'会员卡充值'
                    },
                ],  //交易类型
                payTypeList:[
                    {
                        value:'0',
                        label:'全部'
                    },{
                        value:'1',
                        label:'支付宝'
                    },{
                        value:'2',
                        label:'微信'
                    },{
                        value:'3',
                        label:'现金'
                    },{
                        value:'4',
                        label:'会员卡'
                    },{
                        value:'5',
                        label:'一卡通'
                    },
                ],  //支付方式
                orderStatusList:[
                    {
                        value:'0',
                        label:'全部'
                    },{
                        value:'1',
                        label:'交易中'
                    },{
                        value:'2',
                        label:'交易完成'
                    },{
                        value:'3',
                        label:'退款完成'
                    },{
                        value:'4',
                        label:'购卡完成'
                    },{
                        value:'5',
                        label:'充值成功'
                    },
                ],//订单状态
                cd:{
                    payStartTime:'',//评论时间范围
                    payEndTime:'',//评论时间范围
                    accountStartTime:'',//评论时间范围
                    accountEndTime:'',//评论时间范围
                    operType:"1"//评论类型、不用重置
                },
                activatedType: false,//主要解决mounted和activated重复调用
                pageType: 'list',
                openPage: false,
                tableData1: [],
                tableColumns1: [
                    {
                        type: 'index',
                        title:'序号',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '订单号',
                        key: 'orderNo',
                    },
                    {
                        title: '交易流水号',
                        key: 'tradeNo',
                    },
                    {
                        title: '付款时间',
                        key: 'payTime',
                        render:(h,params)=>{
                            if(params.row.payTime){
                                return h('div',common.formatDate(params.row.payTime))
                            }else{
                                return h('div','无')
                            }
                        }
                    },
                    {
                        title: '交易类型',
                        key: 'tradeType',
                        render:(h,params)=>{
                            let str = ''
                            if(params.row.tradeType==1){
                                str = '服务订单'
                            }else if(params.row.tradeType==2){
                                str = '订单退款'
                            }else if(params.row.tradeType==3){
                                str = '会员卡售卡'
                            }else{
                                str = '会员卡充值'
                            }
                            return h('div',str)
                        }
                    },
                    {
                        title: '订单金额',
                        key: 'orderAmount',
                        render:(h,params)=>{
                            return h('div',params.row.orderAmount/100)
                        }
                    },
                    {
                        title: '实付金额',
                        key: 'payAmount',
                        render:(h,params)=>{
                            return h('div',params.row.payAmount/100)
                        }
                    },
                    {
                        title: '结算金额',
                        key: 'settlementAmount',
                        render:(h,params)=>{
                            return h('div',params.row.settlementAmount/100)
                        }
                    },
                    {
                        title: '平台佣金',
                        key: 'platformCommission',
                        render:(h,params)=>{
                            return h('div',params.row.platformCommission/100)
                        }
                    },
                    {
                        title: '支付方式',
                        key: 'payType',
                        render:(h,params)=>{
                            let str = ''
                            if(params.row.payType=='wechatpay'){
                                str = '微信支付'
                            }else {
                                str = '支付宝支付'
                            }
                            return h('div',str)
                        }
                    },
                    {
                        title: '交易状态',
                        key: 'tradeStatus',
                        render:(h,params)=>{
                            let str = '';
                            if(params.row.tradeStatus==0){
                                str = '待付款'
                            }else if(params.row.tradeStatus==1){
                                str = '交易关闭'
                            }else if(params.row.tradeStatus==2){
                                str = '待服务'
                            }else if(params.row.tradeStatus==4){
                                str = '服务中'
                            }else if(params.row.tradeStatus==5){
                                str = '待评价'
                            }else if(params.row.tradeStatus==6){
                                str = '评价完成'
                            }else if(params.row.tradeStatus==7){
                                str = '购卡成功'
                            }else if(params.row.tradeStatus==8){
                                str = '充值成功'
                            }
                            return h('div',str)
                        }
                    },
                    {
                        title: '结算时间',
                        key: 'beginSettlementTime',
                        render:(h,params)=>{
                            if(params.row.beginSettlementTime){
                                return h('div',common.formatDate(params.row.beginSettlementTime))
                            }else{
                                return h('div','无')
                            }
                        }
                    },
                    {
                        title: '门店信息',
                        key: 'storeName',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 180,
                        // align: 'center',
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
                                        if(params.row.tradeType==1){
                                            this.serviceId = params.row.id;
                                            this.changePageType('service');
                                        }else if(params.row.tradeType==3){
                                            this.sellingId = params.row.id;
                                            this.changePageType('selling');
                                        }else if(params.row.tradeType==4){
                                            this.rechargeId = params.row.id;
                                            this.changePageType('recharge');
                                        }
                                    }
                                }
                               }, '详情')
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
                console.log(page)
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
                let url = common.path+"financialTrade/front/findByPage?pageNo="+this.pageNun+'&pageSize='+this.size;
                // let url = "http://172.16.20.151:8080/product/front/findByPage?pageNo=1&pageSize=1";
                let ajaxData = {
                    pageNo:start,
                    pageSize: size
                }
                vm.loading = true;
                this.$http.post(
                    url,
                    {
                        headers: {
                            'Content-type': 'application/json;charset=UTF-8'
                        },
                    }
                ).then(function(res){
                    console.log(res);
                    let oData = res.data
                    vm.recordsTotal = oData.data.total;
                    vm.tableData1 = oData.data.list;
                    vm.loading = false;
                }).catch(function(err){
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
            fnBackformAdd (type) {
                this.changePageType(type);
                this.getData();
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
            ServicePage,
            SellingPage,
            RechargePage
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
