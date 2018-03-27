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
                <Button v-if="operators.excel" style="float:left;margin-right:10px;" @click="exportData" type="success">导出Excel</Button>
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
                        <Option value="storePhone">注册手机</Option>
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
                    <Button v-if="operators.see" style="margin-left:5px;" @click.native="getData('see')" type="primary" icon="ios-search">查询</Button>
                    <Button v-if="operators.refresh" style="margin-left:5px;" @click.native="getData('init')" type="warning" icon="refresh">刷新</Button>
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
    import ServicePage from './service.vue'
    import SellingPage from './selling.vue'
    import RechargePage from './recharge.vue'
    import common from '../../../base.js'
    export default {
        data () {
            return {
                operators:{},
                serviceId:'',//服务订单id
                rechargeId:'',//会员卡充值id
                sellingId:'',//会员卡售卡id
                storeId:'',
                transactionList:[
                    {
                        value:'',
                        label:'全部'
                    },{
                        value:'1',
                        label:'服务订单'
                    },{
                        value:'0',
                        label:'订单退款'
                    },{
                        value:'2',
                        label:'会员卡售卡'
                    },{
                        value:'3',
                        label:'会员卡充值'
                    },
                ],  //交易类型
                payTypeList:[
                    {
                        value:'',
                        label:'全部'
                    },{
                        value:'1',
                        label:'支付宝'
                    },{
                        value:'2',
                        label:'微信'
                    },{
                        value:'3',
                        label:'会员卡'
                    },{
                        value:'4',
                        label:'一卡通'
                    },{
                        value:'5',
                        label:'余额'
                    },
                ],  //支付方式
                orderStatusList:[
                    {
                        value:'',
                        label:'全部'
                    },{
                        value:'12',
                        label:'交易中'
                    },{
                        value:'4',
                        label:'交易完成'
                    },{
                        value:'6',
                        label:'退款完成'
                    },{
                        value:'21',
                        label:'购卡完成'
                    },{
                        value:'31',
                        label:'充值成功'
                    },
                ],//订单状态
                cd:{
                    payTime:[],//评论时间范围
                    balanceTime:[],//结算时间范围
                    inputVal:'',
                    selectType:'storeName',
                    transactionType:'',//交易类型
                    payType:'',//支付类型
                    orderStatus:'',//订单状态
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
                        title: '订单号',
                        width:120,
                        key: 'orderNumber',
                    },
                    // {
                    //     title: '交易流水号',
                    //     width:120,
                    //     key: 'transactionSerialNumber',
                    // },
                    {
                        title: '交易类型',
                        key: 'tradeType',
                        width:100,
                        render:(h,params)=>{
                            let str = ''
                            if(params.row.tradeType==1){
                                str = '服务订单'
                            }else if(params.row.tradeType==2){
                                str = '会员卡售卡'
                            }else if(params.row.tradeType==3){
                                str = '会员卡充值'
                            }
                            return h('div',str)
                        }
                    },
                    {
                        title: '付款时间',
                        width:150,
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
                        title: '订单金额',
                        key: 'orderAmount',
                        width:90,
                        render:(h,params)=>{
                            return h('div',params.row.orderAmount/100)
                        }
                    },
                    {
                        title: '实付金额',
                        key: 'actuallyAmount',
                        width:90,
                        render:(h,params)=>{
                            return h('div',params.row.actuallyAmount/100)
                        }
                    },
                    {
                        title: '结算金额',
                        key: 'settlementAmount',
                        width:90,
                        render:(h,params)=>{
                            return h('div',params.row.settlementAmount/100)
                        }
                    },
                    {
                        title: '平台佣金',
                        key: 'platformCommission',
                        width:90,
                        render:(h,params)=>{
                            return h('div',params.row.platformCommission/100)
                        }
                    },
                    // {
                    //     title: '支付方式',
                    //     key: 'payMethod',
                    //     width:90,
                    //     render:(h,params)=>{
                    //         let str = ''
                    //         if(params.row.payMethod=='1'){
                    //             str = '支付宝支付'
                    //         }else if(params.row.payMethod=='2') {
                    //             str = '微信支付'
                    //         }else if(params.row.payMethod=='3') {
                    //             str = '会员卡支付'
                    //         }else if(params.row.payMethod=='4') {
                    //             str = '一卡通支付'
                    //         }else if(params.row.payMethod=='5') {
                    //             str = '余额支付'
                    //         }
                    //         return h('div',str)
                    //     }
                    // },
                    {
                        title: '交易状态',
                        key: 'tradeStatus',
                        width:90,
                        render:(h,params)=>{
                            let str = '';
                            if(params.row.tradeType=='1'){
                                if(params.row.tradeStatus==1){
                                    str = '待服务'
                                }else if(params.row.tradeStatus==2){
                                    str = '服务中'
                                }else if(params.row.tradeStatus==3){
                                    str = '服务完成'
                                }else if(params.row.tradeStatus==4){
                                    str = '交易完成'
                                }else if(params.row.tradeStatus==5){
                                    str = '退款中'
                                }else if(params.row.tradeStatus==6){
                                    str = '退款完成'
                                }
                            }else if(params.row.tradeType=='2'){
                                if(params.row.tradeStatus=='1'){
                                    str = '售卡成功'
                                }
                            }else if(params.row.tradeType=='3'){
                                if(params.row.tradeStatus=='1'){
                                    str = '充值成功'
                                }
                            }
                            return h('div',str)
                        }
                    },
                    // {
                    //     title: '结算时间',
                    //     key: 'settlementTime',
                    //     width:90,
                    //     render:(h,params)=>{
                    //         if(params.row.settlementTime){
                    //             return h('div',common.formatDate(params.row.settlementTime))
                    //         }else{
                    //             return h('div','无')
                    //         }
                    //     }
                    // },
                    {
                        title: '门店信息',
                        key: 'storeName',
                        width:100,
                        render:(h,params)=>{
                            return h('div',[
                                h('div',params.row.storeName),
                                h('div',params.row.storePhone)
                            ])
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            let arr = [];
                            let infoButton = h('Button', {
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
                                        }else if(params.row.tradeType==2){
                                            this.sellingId = params.row.id;
                                            this.changePageType('selling');
                                        }else if(params.row.tradeType==3){
                                            this.rechargeId = params.row.id;
                                            this.changePageType('recharge');
                                        }
                                    }
                                }
                            }, '详情')
                            if(this.operators.info){
                                arr.push(infoButton)
                            }
                            return h('div', arr);
                        }
                    }
                ],
                tableColumns2: [
                    {
                        title: '订单号',
                        key: 'orderNumber'
                    },
                    {
                        title: '交易流水号',
                        key: 'transactionSerialNumber'
                    },
                    {
                        title: '交易类型',
                        key: 'tradeType'
                    },
                    {
                        title: '付款时间',
                        key: 'payTime'
                    },
                    {
                        title: '订单金额',
                        key: 'orderAmount'
                    },
                    {
                        title: '实付金额',
                        key: 'actuallyAmount'
                    },
                    {
                        title: '结算金额',
                        key: 'settlementAmount'
                    },
                    {
                        title: '平台佣金',
                        key: 'platformCommission'
                    },
                    {
                        title: '支付方式',
                        key: 'payMethod'
                    },
                    {
                        title: '交易状态',
                        key: 'tradeStatus'
                    },
                    {
                        title: '结算时间',
                        key: 'settlementTime'
                    },
                    {
                        title: '门店名称',
                        key: 'storeName'
                    },
                    {
                        title: '门店电话',
                        key: 'storePhone'
                    },
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
                if(!!init&&init=='see'){
                    start = 1;
                }
                let url = common.path2+"platformTradeDetails/selectPlatformListByConditions?pageNo="+start+'&pageSize='+size;
                let ajaxData = {}
                if(vm.storeId){
                    ajaxData.storeId = vm.storeId;
                }
                if(vm.cd.transactionType){
                    ajaxData.tradeType = vm.cd.transactionType
                }
                if(vm.cd.payType){
                    ajaxData.payMethod = vm.cd.payType
                }
                if(!!vm.cd.orderStatus&&vm.cd.orderStatus=='4'){
                    ajaxData.tradeType = '1'
                    ajaxData.tradeStatus = vm.cd.orderStatus
                }else if(!!vm.cd.orderStatus&&vm.cd.orderStatus=='6'){
                    ajaxData.tradeType = '1'
                    ajaxData.tradeStatus = vm.cd.orderStatus
                }else if(!!vm.cd.orderStatus&&vm.cd.orderStatus=='2'){
                    ajaxData.tradeType = '1'
                    ajaxData.tradeStatus = '2'
                }else if(!!vm.cd.orderStatus&&vm.cd.orderStatus=='21'){
                    ajaxData.tradeType = '2'
                    ajaxData.tradeStatus = '1'
                }else if(!!vm.cd.orderStatus&&vm.cd.orderStatus=='31'){
                    ajaxData.tradeType = '3'
                    ajaxData.tradeStatus = '1'
                }
                if(!!vm.cd.payTime[0]){
                    ajaxData.settlementStartTime = common.formatDate(vm.cd.payTime[0]);
                    ajaxData.endPayTime = common.formatDate(vm.cd.payTime[1]);
                }
                if(!!vm.cd.balanceTime[0]){
                    ajaxData.settlementStartTime = common.formatDate(vm.cd.balanceTime[0])
                    ajaxData.settlementEndTime = common.formatDate(vm.cd.balanceTime[1])
                }
                if(vm.cd.inputVal){
                    ajaxData.beauticianNameAndPhone = vm.cd.inputVal;
                }
                console.log(ajaxData)
                vm.table.loading = true;
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
                vm.cd.orderStatus = '';//订单状态
                vm.cd.transactionType = '';//订单来源
                vm.cd.payType = '';//支付类型
                vm.cd.selectType = 'storeName';// 状态
                vm.cd.inputVal = "";// 输入框的值
            },
            //导出Excel
            exportData(){
                this.table.tableData1.filter((data, index) => {
                    //订单号 
                    data.orderNumber = '="'+data.orderNumber+'"';
                    //门店号码 
                    data.storePhone = '="'+data.storePhone+'"';
                    //交易流水号 
                    data.transactionSerialNumber = '="'+data.transactionSerialNumber+'"';
                    //付款时间 
                    data.payTime = data.payTime?common.formatDate(data.payTime):'';
                    //结算时间 
                    data.settlementTime = data.settlementTime?common.formatDate(data.settlementTime):'';
                    //交易类型
                    if(data.tradeType==1){
                        data.tradeType = '服务订单'
                    }else if(data.tradeType==2){
                        data.tradeType = '会员卡售卡'
                    }else if(data.tradeType==3){
                        data.tradeType = '会员卡充值'
                    }
                    //订单金额
                    data.orderAmount = data.orderAmount/100;
                    //实付金额
                    data.actuallyAmount = data.actuallyAmount/100;
                    //结算金额
                    data.settlementAmount = data.settlementAmount/100;
                    //平台佣金
                    data.platformCommission = data.platformCommission/100;
                    //支付方式
                    if(data.payMethod=='1'){
                        data.payMethod = '支付宝支付'
                    }else if(data.payMethod=='2'){
                        data.payMethod = '微信支付'
                    }else if(data.payMethod=='3'){
                        data.payMethod = '会员卡支付'
                    }else if(data.payMethod=='4'){
                        data.payMethod = '一卡通支付'
                    }else if(data.payMethod=='5'){
                        data.payMethod = '余额支付'
                    }
                    //交易状态
                    if(data.tradeType=='服务订单'){
                        if(data.tradeStatus==1){
                            data.tradeStatus = '待服务'
                        }else if(data.tradeStatus==2){
                            data.tradeStatus = '服务中'
                        }else if(data.tradeStatus==3){
                            data.tradeStatus = '服务完成'
                        }else if(data.tradeStatus==4){
                            data.tradeStatus = '交易完成'
                        }else if(data.tradeStatus==5){
                            data.tradeStatus = '退款中'
                        }else if(data.tradeStatus==6){
                            data.tradeStatus = '退款完成'
                        }
                    }else if(data.tradeType=='会员卡售卡'){
                        if(data.tradeStatus=='1'){
                            data.tradeStatus = '售卡成功'
                        }
                    }else if(data.tradeType=='会员卡充值'){
                        if(data.tradeStatus=='1'){
                            data.tradeStatus = '充值成功'
                        }
                    }
                })
                this.$refs.table.exportCsv({
                    filename: '交易流水',
                    columns: this.tableColumns2,
                    data: this.table.tableData1
                });
                this.getData();
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
            },
             /*===================== 菜单权限配置 start ====================*/
            /* 获取该菜单拥有的权限 */
            fnGetOperators () {
                let vm = this;
                function fnGetDatas (id,vm) {
                    let list = [];
                    let menuArrs = []; // 相同menuId的数组
                    let strArrs = []; // 权限数组 ["add","edit"]
                    /* 菜单对应的权限组 */
                    if(!!JSON.parse(window.localStorage.getItem("userInfo")).operator.list){
                        list = JSON.parse(window.localStorage.getItem("userInfo")).operator.list;
                    }
                    /* 每个用户有可能被分配了多个角色，所以需要合并相同menuId的权限组 */
                    for(var c = 0;c<list.length;c++){
                        if(list[c].menuId == id){
                            menuArrs.push(list[c]);
                        }
                    }

                    for(var j = 0;j<menuArrs.length;j++){
                        if(!!menuArrs[j].operCode){
                            vm.fnChangeOperators(menuArrs[j].operCode.split(","));
                        }
                    }
                }
                /* 得到所有的菜单 */
                let arrs = JSON.parse(window.localStorage.getItem("userInfo")).menu;
                for(var i = 0;i<arrs.length;i++){
                    if(!!arrs[i].hasChildList){
                        for(var j = 0;j<arrs[i].childList.length;j++){
                            if(arrs[i].childList[j].href == this.$route.path){
                                fnGetDatas(arrs[i].childList[j].menuId,vm)
                            }
                        }
                    }else{
                        if(arrs[i].href == this.$route.path){
                            fnGetDatas(arrs[i].menuId,vm)
                        }
                    }
                }
            },
            /* 权限的遍历 */
            fnChangeOperators (arrs) {
                // operators{}是开关对象
                let vm = this;
                arrs.forEach(function(item,index){
                    vm.operators[item] = true;
                })
            }
            /*=================== 菜单权限配置 end ===========================*/
        },
        mounted: function(){
            if(JSON.parse(window.localStorage.getItem('userInfo')).store){
                this.storeId = JSON.parse(window.localStorage.getItem('userInfo')).store.id;
            }
            this.fnGetOperators();
            this.getData();
        },
        activated: function(){
            let vm = this;
            vm.fnExistTabList()
        },
        components:{
            ServicePage,
            SellingPage,
            RechargePage,
            expandRow
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
