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
                <Button style="float:left;margin-right:10px;" @click="exportData" type="success">导出Excel</Button>
                <FormItem style="margin-bottom:10px;">
                    交易类型
                    <Select v-model="cd.transactionType" style="width:100px">
                        <Option v-for="item in transactionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    支付方式
                    <Select v-model="cd.payType" style="width:100px">
                        <Option v-for="item in payTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    订单状态
                    <Select v-model="cd.orderStatus" style="width:100px">
                        <Option v-for="item in orderStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    付款时间
                    <DatePicker v-model="cd.payTime" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="请填写时间范围" style="width: 250px"></DatePicker>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    结算时间
                    <DatePicker v-model="cd.balanceTime" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="请填写时间范围" style="width: 250px"></DatePicker>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    <Input v-model="cd.inputVal">
                    <Select v-model="cd.selectType" slot="prepend" style="width: 100px">
                        <Option value="storeName">门店名称</Option>
                        <Option value="bossPhone">注册手机</Option>
                    </Select>
                    </Input>
                </FormItem>
                <FormItem style="margin-bottom:10px; width:220px;" v-show="false">
                    <Row>
                        <Col span="22">
                            <Input v-model="cd.text" placeholder="门店名称/注册手机"></Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem style="margin-bottom:10px;">
                    <Button style="margin-left:5px;" @click.native="getData" type="primary" icon="ios-search">查询</Button>
                    <Button style="margin-left:5px;" @click.native="getData('init')" type="warning" icon="refresh">刷新</Button>
                </FormItem>
            </Form>
            <Row style="margin-bottom:10px;">
                <Col span="10">
                    <Button style="float:left;margin-right:10px;" @click.native="changePageType('add')" type="success" v-show="false">导出Excel</Button>
                    <Button style="float:left;" @click.native="changePageType('list')" type="primary" icon="android-add" v-show="false">成长规则设置</Button>
                </Col>
            </Row>
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
    import ServicePage from './service.vue'
    import SellingPage from './selling.vue'
    import RechargePage from './recharge.vue'
    import common from '../../../base.js'
    export default {
        data () {
            return {
                serviceId:'',//服务订单id
                rechargeId:'',//会员卡充值id
                sellingId:'',//会员卡售卡id
                transactionList:[
                    {
                        value:'',
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
                        value:'',
                        label:'全部'
                    },{
                        value:'alipay',
                        label:'支付宝'
                    },{
                        value:'wechatpay',
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
                        value:'',
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
                    payTime:[],//评论时间范围
                    balanceTime:[],//评论时间范围
                    inputVal:'',
                    selectType:'storeName',
                    storeStatus:'', //店铺状态下拉框
                    text:'', //地区
                    transactionType:'',//交易类型
                    payType:'',//支付类型
                    orderStatus:'',//订单状态
                },
                activatedType: false,//主要解决mounted和activated重复调用
                pageType: 'list',
                openPage: false,
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
                console.log(page)
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
                let url = common.path+"financialTrade/front/findByPage?pageNo="+start+'&pageSize='+size;
                let ajaxData = {
                    pageNo:start,
                    pageSize: size,
                    tradeType:vm.cd.transactionType,//交易类型
                    payType:vm.cd.payType,//支付类型
                    tradeStatus:vm.cd.orderStatus,//订单状态
                    payTime:vm.cd.payTime,//付款时间
                    settlementAmount:vm.cd.balanceTime,//结算时间
                }
                console.log(ajaxData)
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
                    vm.table.tableData1 = oData.data.list;
                    vm.table.loading = false;
                }).catch(function(err){
                })
            },
            /* 初始化表格筛选条件 */
            fnInit () {
                let vm = this;
                vm.table.pageNun = 1;//索引
                vm.table.size = 10;//页数
                vm.cd.payTime = [];//支付时间
                vm.cd.balanceTime = [];//结算时间
                vm.cd.selectType = 'storeName';// 状态
                vm.cd.storeStatus = '';// 输入框类型
                vm.cd.orderStatus = '';//订单状态
                vm.cd.inputVal = "";// 输入框的值
                vm.cd.transactionType = '';//订单来源
                vm.cd.payType = '';//支付类型
            },
            //导出Excel
            exportData(){
                this.$refs.table.exportCsv({
                    filename: '数据',
                    data: this.table.tableData1.filter((data, index) => {
                        // console.log(data)
                        //付款时间
                        data.payTime = data.payTime?common.formatDate(data.payTime):'';
                        //交易类型
                        if(data.tradeType==1){
                            data.tradeType = '服务订单'
                        }else if(data.tradeType==3){
                            data.tradeType = '会员卡售卡'
                        }else if(data.tradeType==4){
                            data.tradeType = '会员卡充值'
                        }
                        //支付方式
                        if(data.payType=='alipay'){
                            data.payType = '支付宝支付'
                        }else if(data.payType=='wechatpay'){
                            data.payType = '微信支付'
                        }
                        //交易状态
                        switch(data.tradeStatus){
                            case '0':return data.tradeStatus = '待付款'; break;
                            case '1':return data.tradeStatus = '交易关闭'; break;
                            case '2':return data.tradeStatus = '待服务'; break;
                            case '4':return data.tradeStatus = '服务中'; break;
                            case '5':return data.tradeStatus = '待评价'; break;
                            case '6':return data.tradeStatus = '评价完成'; break;
                            case '7':return data.tradeStatus = '购卡成功'; break;
                            case '8':return data.tradeStatus = '充值完成'; break;
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
